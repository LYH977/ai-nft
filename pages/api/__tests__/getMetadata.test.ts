import { mockCreatedAt, mockDesc, mockImgName, mockTokenURI } from '@/mockData'
import { PINATA_PIN_LIST_API } from '@/utils/constants'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import handler from '../getMetadata'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('getMetadata', () => {
  const req: jest.Mocked<NextApiRequest> = {
    query: { hash: mockTokenURI },
  } as unknown as jest.Mocked<NextApiRequest>

  const res: jest.Mocked<NextApiResponse> = {
    status: jest.fn(() => res),
    json: jest.fn(),
  } as unknown as jest.Mocked<NextApiResponse>
  it('should return metadata on SUCCESSFUL api', async () => {
    const mockResponse = {
      date_pinned: mockCreatedAt,
      metadata: {
        name: mockImgName,
        keyvalues: {
          description: mockDesc,
        },
      },
    }
    const response = {
      data: { rows: [mockResponse] },
      status: 200,
    }
    mockedAxios.get.mockResolvedValueOnce(response)
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${PINATA_PIN_LIST_API}?hashContains=${mockTokenURI}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      }
    )
  })
  it('should return status code 503 on FAILED api', async () => {
    const response = {
      status: 503,
    }
    mockedAxios.get.mockResolvedValueOnce(response)
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(503)
  })

  it('should return status code 500 upon THROWN ERROR', async () => {
    mockedAxios.get.mockRejectedValueOnce({})
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
  })
})
