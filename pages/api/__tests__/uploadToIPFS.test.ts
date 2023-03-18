import { NextApiRequest, NextApiResponse } from 'next'
import handler from '../uploadToIPFS'
import { base64 } from '@/public/mock/base64'

const mockIpfsHash = 'dfdfdfdf'
let mockPinFileToIPFS = () => ({ IpfsHash: mockIpfsHash })
jest.mock('@pinata/sdk', () => {
  return function (this: any) {
    this.pinFileToIPFS = async function () {
      return mockPinFileToIPFS()
    }
  }
})

describe('uploadIpfs function', () => {
  const req: jest.Mocked<NextApiRequest> = {
    body: { name: 'mock name', image: base64 },
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
