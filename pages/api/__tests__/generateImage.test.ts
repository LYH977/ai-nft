import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

import { mockDesc } from '@/mockData'
import { HUGGING_FACE_API } from '@/utils/constants'

import handler from '../generateImage'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('generateImage function', () => {
  const req: jest.Mocked<NextApiRequest> = {
    body: { description: mockDesc },
  } as jest.Mocked<NextApiRequest>

  const res: jest.Mocked<NextApiResponse> = {
    status: jest.fn(() => res),
    json: jest.fn(),
  } as unknown as jest.Mocked<NextApiResponse>

  it('should return the image base64 data upon SUCCESSFUL api', async () => {
    const base64Buffer = new ArrayBuffer(8)
    const response = {
      headers: { 'content-type': 'image/png' },
      data: base64Buffer,
      status: 200,
    }
    mockedAxios.post.mockResolvedValueOnce(response)
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      HUGGING_FACE_API,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}}`,
        },
        method: 'POST',
        inputs: mockDesc,
      },
      { responseType: 'arraybuffer' }
    )
  })

  it('should return status code 503 data upon FAILED api', async () => {
    const response = {
      status: 503,
    }
    mockedAxios.post.mockResolvedValueOnce(response)
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(503)
  })

  it('should return status code 500 upon THROWN ERROR', async () => {
    mockedAxios.post.mockRejectedValueOnce({})
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
  })
})
