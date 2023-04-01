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
  const mockMintNFT = jest.fn()
  const mockEvent: any = { preventDefault: jest.fn() }

  it('should initialize the hook with default values', () => {
    const { result } = renderHook(() =>
      useAiImage(mockOwnerAddress, mockMintNFT)
    )
    expect(result.current.image).toBe('')
    expect(result.current.loading).toBe(LoadingStatus.NONE)
    expect(result.current.generatedImage).toEqual({ imgName: '', desc: '' })
    expect(result.current.isGenerateBtnDisabled).toBe(true)
    expect(result.current.isMintBtnDisabled).toBe(true)
  })

  it('should call axios.post with the correct parameters when calling generateImage', async () => {
    const { result } = renderHook(() =>
      useAiImage(mockOwnerAddress, mockMintNFT)
    )
    act(() => {
      result.current.setImgName(mockImgName)
      result.current.setDesc(mockDesc)
    })
    result.current.generateImage(mockEvent)
    expect(mockedAxios.post).toHaveBeenCalledWith('./api/generateImage', {
      description: mockDesc,
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
        'Oops. something is wrong now. Please come back later.'
      )
    })
  })

  it('should call the mintNFT function with the correct parameters when calling handleMintingNFT', async () => {
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
    })
    result.current.handleMintingNFT(mockEvent)
    await waitFor(() => {
      expect(mockMintNFT).toHaveBeenCalledWith(mockEvent, {
        image: base64,
        imgName: mockImgName,
        desc: mockDesc,
      })
    })
  })
})
