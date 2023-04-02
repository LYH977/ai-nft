import { act, renderHook, waitFor } from '@testing-library/react'
import axios from 'axios'
import { toast } from 'react-toastify'

import {
  getMockServerErrorResponse,
  getMockServerSuccessResponse,
  MockContract,
  mockCreatedAt,
  mockDesc,
  mockImgName,
  mockOwnerAddress,
  mockTokenURI,
  mockTotalSupply,
  MockProvider,
} from '@/mockData'
import { base64 } from '@/public/mock/base64'

import { useNFT } from '../useNFT'

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('useNFT unit test', () => {
  const mockContractObject = new MockContract()
  const mockProviderObject = new MockProvider()

  const mockEvent: any = { preventDefault: jest.fn() }
  const mockSetImage = jest.fn()
  beforeAll(() => {
    mockedAxios.get.mockResolvedValue(
      getMockServerSuccessResponse({
        name: mockImgName,
        createdAt: mockCreatedAt,
        description: mockDesc,
      })
    )
  })
  afterEach(() => {
    mockContractObject.clearIndex()
  })
  it('should return an empty collection and a loading state initially with undefined contract variable', () => {
    const { result } = renderHook(() =>
      useNFT(undefined, mockProviderObject, mockOwnerAddress)
    )
    expect(result.current.collection).toEqual([])
    expect(result.current.isFetchingNft).toBeFalsy()
  })

  it('should fetch the NFT collection from the smart contract and IPFS', async () => {
    const { result } = renderHook(() =>
      useNFT(mockContractObject, mockProviderObject, mockOwnerAddress)
    )
    expect(result.current.isFetchingNft).toBeTruthy()
    const newCollection = [...Array(mockTotalSupply)].map((_, index) => ({
      owner: mockOwnerAddress,
      path: mockTokenURI + (index + 1),
      name: mockImgName,
      createdAt: mockCreatedAt,
      description: mockDesc,
    }))
    await waitFor(() => {
      expect(result.current.collection).toEqual(newCollection)
    })
  })

  it('should set the collection and show a toast when calling mintNFT successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce(
      getMockServerSuccessResponse({
        IpfsHash: mockTokenURI,
        Timestamp: mockCreatedAt,
      })
    )
    const { result } = renderHook(() =>
      useNFT(mockContractObject, mockProviderObject, mockOwnerAddress)
    )

    act(() => {
      result.current.mintNFT(mockEvent, {
        imgName: mockImgName,
        image: base64,
        desc: mockDesc,
        setImage: mockSetImage,
      })
    })

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Minted NFT!')
      expect(result.current.collection).toEqual(
        [...Array(mockTotalSupply)].map((number, index) => ({
          owner: mockOwnerAddress,
          path: mockTokenURI + (index + 1),
          name: mockImgName,
          createdAt: mockCreatedAt,
          description: mockDesc,
        }))
      )
    })
  })
  it('should show a toast when calling mintNFT successfully but not status 200', async () => {
    mockedAxios.post.mockResolvedValueOnce(getMockServerErrorResponse())
    const { result } = renderHook(() =>
      useNFT(mockContractObject, mockProviderObject, mockOwnerAddress)
    )
    act(() => {
      result.current.mintNFT(mockEvent, {
        imgName: mockImgName,
        image: base64,
        desc: mockDesc,
        setImage: mockSetImage,
      })
    })
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Ipfs upload service is currently unavailable. Please come back later.'
      )
    })
  })

  it('should show a toast when calling mintNFT unsuccessfully', async () => {
    mockedAxios.post.mockRejectedValueOnce(getMockServerErrorResponse())
    const { result } = renderHook(() =>
      useNFT(mockContractObject, mockProviderObject, mockOwnerAddress)
    )
    act(() => {
      result.current.mintNFT(mockEvent, {
        imgName: mockImgName,
        image: base64,
        desc: mockDesc,
        setImage: mockSetImage,
      })
    })
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Oops. something is wrong now. Please come back later.'
      )
    })
  })
})
