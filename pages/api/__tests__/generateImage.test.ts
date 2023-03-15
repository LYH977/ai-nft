import axios from 'axios'
import handler from '../generateImage'
import { NextApiRequest, NextApiResponse } from 'next'
import { HUGGING_FACE_API } from '@/utils/api'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
const mockInputs = 'green apple'

describe('handler', () => {
  const req: jest.Mocked<NextApiRequest> = {
    body: { description: mockInputs },
  } as jest.Mocked<NextApiRequest>

  const res: jest.Mocked<NextApiResponse> = {
    status: jest.fn(() => res),
    json: jest.fn(),
  } as unknown as jest.Mocked<NextApiResponse>

  it('should return the image data', async () => {
    const data = new ArrayBuffer(8)
    const response = {
      headers: { 'content-type': 'image/png' },
      data,
    }
    mockedAxios.post.mockResolvedValueOnce(response)
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      HUGGING_FACE_API,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}}`,
        },
        method: 'POST',
        inputs: mockInputs,
      },
      { responseType: 'arraybuffer' }
    )
  })

  it('should handle errors', async () => {
    mockedAxios.post.mockRejectedValueOnce({})
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ status: 'FAIL' })
  })
})
