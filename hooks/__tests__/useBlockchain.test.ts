/* eslint-disable @typescript-eslint/ban-ts-comment */
import { renderHook, waitFor } from '@testing-library/react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'

import { MockContract, mockOwnerAddress, mockProvider } from '@/mockData'

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import { useBlockchain } from '../useBlockchain'

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
  },
}))

describe('useBlockchain unit test', () => {
  beforeAll(() => {
    //@ts-ignore
    jest.spyOn(ethers, 'Contract').mockImplementation(MockContract)
    jest
      .spyOn(ethers.providers, 'Web3Provider')
      //@ts-ignore
      .mockImplementation(mockProvider)
    ;(window as any).ethereum = {}
  })

  it('should warn the user if there is an error with the crypto wallet', async () => {
    jest
      .spyOn(ethers.providers, 'Web3Provider')
      //@ts-ignore
      .mockImplementationOnce({})
    renderHook(() => useBlockchain())
    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith(
        'Something wrong with crypto wallet. Please log in your account properly.'
      )
    })
  })

  it('should load blockchain data when the hook is mounted', async () => {
    const { result } = renderHook(() => useBlockchain())
    await waitFor(() => {
      expect(result.current.ownerAddress).toBe(mockOwnerAddress)
      // expect(result.current.provider).toBe(mockProvider)
      //@ts-ignore
      // expect(result.current.smartContract).toEqual(MockContract)
      // expect(MockContract).toHaveBeenCalledWith(
      //   CONTRACT_ADDRESS,
      //   NFT.abi,
      //   mockProvider
      // )
      // expect(mockSigner.getAddress).toHaveBeenCalled()
      expect(toast.success).toHaveBeenCalledWith('Crypto wallet is connected!')
    })
  })

  it('should warn the user if the crypto wallet is not detected', async () => {
    delete (window as any).ethereum
    renderHook(() => useBlockchain())
    expect(toast.warning).toHaveBeenCalledWith('Crypto wallet is not detected!')
  })
})
