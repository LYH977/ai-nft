/* eslint-disable @typescript-eslint/ban-ts-comment */

import { act, renderHook, waitFor } from '@testing-library/react'
import { toast } from 'react-toastify'

import {
  mockOwnerAddress,
  MockContract,
  setCurrentChainId,
  MockProvider,
} from '@/mockData'
import { SEPOLIA_CHAIN_ID } from '@/utils/constants'

import { useBlockchain } from '../useBlockchain'

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
  },
}))

describe('useBlockchain unit test', () => {
  const wrongChainId = 43534
  const mockReload = jest.fn()

  const map: any = {}
  const mockEthereum = {
    on: jest.fn((eventName: string, callback: any) => {
      if (!map[eventName]) map[eventName] = callback
    }),
    request: jest.fn().mockResolvedValue([mockOwnerAddress]),
  }

  const mockProviderObject = new MockProvider()

  const mockContractObject = new MockContract()

  beforeAll(() => {
    Object.defineProperty(global.window, 'location', {
      value: {
        reload: mockReload,
      },
    })
  })

  beforeEach(() => {
    Object.defineProperty(global.window, 'ethereum', {
      value: mockEthereum,
      writable: true,
      configurable: true,
    })
    jest.doMock('ethers', () => ({
      ethers: {
        Contract: MockContract,
        providers: { Web3Provider: MockProvider },
      },
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('ChainChanged Test', () => {
    it('should reload the page when the chain is changed', async () => {
      await waitFor(() => {
        renderHook(() => useBlockchain())
      })
      map['chainChanged']()
      expect(mockReload).toHaveBeenCalledTimes(1)
    })
  })

  describe('AccountsChanged Test', () => {
    beforeEach(() => {
      setCurrentChainId(SEPOLIA_CHAIN_ID)
    })
    afterEach(() => {
      jest.clearAllMocks()
    })
    it('should show success toast message when new owner address is detected', async () => {
      await waitFor(() => {
        renderHook(() => useBlockchain())
      })
      act(() => {
        map['accountsChanged']([mockOwnerAddress])
      })
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          `Account changed to ${mockOwnerAddress}`
        )
      })
    })

    it('should show error toast message when crypto wallet is not detected', async () => {
      await waitFor(() => {
        renderHook(() => useBlockchain())
      })
      act(() => {
        map['accountsChanged']()
      })
      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith(
          'New crypto wallet is not detected!. Please refresh the page.'
        )
      })
    })

    it('should warn the user if the sepolia testnet is no longer detected', async () => {
      await waitFor(() => {
        renderHook(() => useBlockchain())
      })
      setCurrentChainId(wrongChainId)

      act(() => {
        map['accountsChanged']([mockOwnerAddress])
      })
      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith(
          'Sepolia testnet is no longer detected'
        )
      })
    })
  })

  describe('LoadBlockchainData Function Test', () => {
    beforeEach(() => {
      setCurrentChainId(SEPOLIA_CHAIN_ID)
      Object.defineProperty(global.window, 'ethereum', {
        value: mockEthereum,
        writable: true,
        configurable: true,
      })
    })

    it('should load blockchain data when the hook is mounted', async () => {
      const { result } = renderHook(() => useBlockchain())

      await waitFor(async () => {
        expect(result.current.ownerAddress).toBe(mockOwnerAddress)
        expect(result.current.provider).toEqual(mockProviderObject)

        expect(result.current.smartContract).toEqual(mockContractObject)
        expect(toast.success).toHaveBeenCalledWith(
          'Crypto wallet is connected!'
        )
      })
    })

    it('should warn the user if the sepolia testnet is not detected', async () => {
      setCurrentChainId(wrongChainId)
      renderHook(() => useBlockchain())
      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith(
          'Sepolia testnet is not detected'
        )
      })
    })

    it('should warn the user if the crypto wallet is not detected', async () => {
      delete global.window.ethereum

      renderHook(() => useBlockchain())
      expect(toast.warning).toHaveBeenCalledWith(
        'Crypto wallet is not detected!'
      )
    })
    it('should warn the user if there is an error with the crypto wallet', async () => {
      delete global.window.ethereum.request

      await waitFor(() => {
        renderHook(() => useBlockchain())
      })
      expect(toast.warning).toHaveBeenCalledWith(
        'Something wrong with crypto wallet. Please log in your account properly.'
      )
    })
  })
})
