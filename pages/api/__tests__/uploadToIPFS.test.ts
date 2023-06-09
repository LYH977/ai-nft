import { NextApiRequest, NextApiResponse } from 'next'

import { mockCreatedAt, mockDesc, mockImgName, mockTokenURI } from '@/mockData'
import { base64 } from '@/public/mock/base64'

import handler from '../uploadToIPFS'

let mockPinFileToIPFS = () => ({
  IpfsHash: mockTokenURI,
  Timestamp: mockCreatedAt,
})

jest.mock(
  '@pinata/sdk',
  () =>
    class {
      async pinFileToIPFS() {
        return mockPinFileToIPFS()
      }
    }
)

describe('uploadIpfs function', () => {
  const req: jest.Mocked<NextApiRequest> = {
    body: { name: mockImgName, image: base64, description: mockDesc },
  } as jest.Mocked<NextApiRequest>

  const res: jest.Mocked<NextApiResponse> = {
    status: jest.fn(() => res),
    json: jest.fn(),
  } as unknown as jest.Mocked<NextApiResponse>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return hash upon SUCCESSFUL api', async () => {
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('should return hash upon FAILED api', async () => {
    mockPinFileToIPFS = () => {
      throw new Error()
    }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
  })
})
