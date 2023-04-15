/* eslint-disable @typescript-eslint/ban-ts-comment */
import { act, renderHook, waitFor } from '@testing-library/react'
import axios from 'axios'
import { toast } from 'react-toastify'

import {
  getMockServerErrorResponse,
  getMockServerSuccessResponse,
  mockDesc,
  mockImgName,
  mockOwnerAddress,
} from '@/mockData'
import { base64 } from '@/public/mock/base64'

import { LoadingStatus } from '../../enums'
import { useAiImage } from '../useAiImage'

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('useAiImage unit test', () => {
  let myResolve: any
  const mockMintNFT: () => Promise<void> = jest.fn(
    () => new Promise((resolve) => (myResolve = resolve))
  )

  const mockEvent: any = { preventDefault: jest.fn() }

  it('should initialize the hook with default values', async () => {
    let myResult: any
    await waitFor(() => {
      const { result } = renderHook(() =>
        useAiImage(mockOwnerAddress, mockMintNFT)
      )
      myResult = result
    })
    expect(myResult.current.image).toBe('')
    expect(myResult.current.loading).toBe(LoadingStatus.NONE)
    expect(myResult.current.generatedImage).toEqual({ imgName: '', desc: '' })
    expect(myResult.current.isGenerateBtnDisabled).toBeTruthy()
    expect(myResult.current.isMintBtnDisabled).toBeTruthy()
  })

  it('should call axios.post with the correct parameters when calling generateImage', async () => {
    let myResult: any
    await waitFor(() => {
      const { result } = renderHook(() =>
        useAiImage(mockOwnerAddress, mockMintNFT)
      )
      myResult = result
    })
    act(() => {
      myResult.current.setImgName(mockImgName)
      myResult.current.setDesc(mockDesc)
    })
    act(() => {
      myResult.current.generateImage(mockEvent)
    })
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('./api/generateImage', {
        description: mockDesc,
      })
    })
  })

  it('should set the image and generatedImage state and show a toast when calling generateImage successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce(
      getMockServerSuccessResponse({ base64 })
    )
    const { result } = renderHook(() =>
      useAiImage(mockOwnerAddress, mockMintNFT)
    )
    act(() => {
      result.current.setImgName(mockImgName)
      result.current.setDesc(mockDesc)
    })
    result.current.generateImage(mockEvent)
    await waitFor(() => {
      expect(result.current.image).toBe(base64)
      expect(result.current.generatedImage).toEqual({
        imgName: mockImgName,
        desc: mockDesc,
      })
      expect(toast.success).toHaveBeenCalledWith(
        `Generated image "${mockImgName}"`
      )
    })
  })

  it('should show a toast when calling generateImage successfully but not status 200', async () => {
    mockedAxios.post.mockResolvedValueOnce(getMockServerErrorResponse())
    const { result } = renderHook(() =>
      useAiImage(mockOwnerAddress, mockMintNFT)
    )
    act(() => {
      result.current.setImgName(mockImgName)
      result.current.setDesc(mockDesc)
    })
    result.current.generateImage(mockEvent)
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Image generation service is currently unavailable. Please come back later.'
      )
    })
  })

  it('should show a toast when calling generateImage unsuccessfully', async () => {
    mockedAxios.post.mockRejectedValueOnce(getMockServerErrorResponse())
    const { result } = renderHook(() =>
      useAiImage(mockOwnerAddress, mockMintNFT)
    )
    act(() => {
      result.current.setImgName(mockImgName)
      result.current.setDesc(mockDesc)
    })
    result.current.generateImage(mockEvent)
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Sorry, something went wrong. Please try again.'
      )
    })
  })

  it('should call the mintNFT function and set loading states correctly when calling handleMintingNFT', async () => {
    mockedAxios.post.mockResolvedValueOnce(
      getMockServerSuccessResponse({ base64 })
    )
    let myResult: any
    await waitFor(() => {
      const { result } = renderHook(() =>
        useAiImage(mockOwnerAddress, mockMintNFT)
      )
      myResult = result
    })
    act(() => {
      myResult.current.setImgName(mockImgName)
      myResult.current.setDesc(mockDesc)
    })
    act(() => {
      myResult.current.generateImage(mockEvent)
    })
    await waitFor(() => {
      expect(myResult.current.image).toBe(base64)
      expect(myResult.current.generatedImage).toEqual({
        imgName: mockImgName,
        desc: mockDesc,
      })
    })
    act(() => {
      myResult.current.handleMintingNFT(mockEvent)
    })
    expect(myResult.current.loading).toEqual(LoadingStatus.MINTING)
    myResolve()
    act(() => {
      myResolve()
    })
    await waitFor(() => {
      expect(myResult.current.loading).toEqual(LoadingStatus.NONE)
    })
  })
})
