import { NextApiRequest, NextApiResponse } from 'next'
import handler from '../uploadToIPFS'
// import { mock } from 'jest-mock-extended'
import pinataSDK from '@pinata/sdk'
import { Readable } from 'stream'

jest.mock('@pinata/sdk')

describe('handler', () => {
  const req: jest.Mocked<NextApiRequest> = {
    body: { name: 'dfdf', image: 'dfdfdf' },
  } as jest.Mocked<NextApiRequest>

  const res: jest.Mocked<NextApiResponse> = {
    status: jest.fn(() => res),
    json: jest.fn(),
  } as unknown as jest.Mocked<NextApiResponse>
  const mockPinata = pinataSDK as jest.Mocked<typeof pinataSDK>
  const mockStream = Readable.from('')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('df', () => {
    expect(true).toBeTruthy()
  })
  //   it('should handle the request', async () => {
  //     // Set up the request and response mocks
  //     mockReq.body = { image: 'base64-encoded-data', name: 'test-image' }
  //     mockRes.status.mockReturnThis()

  //     // Set up the pinataSDK mock
  //     mockPinata.pinFileToIPFS.mockResolvedValueOnce({ IpfsHash: 'QmHash' })

  //     // Call the handler with the mock request and response
  //     await handler(req, res)

  //     // Check that the response status was set to 200
  //     expect(mockRes.status).toHaveBeenCalledWith(200)

  //     // Check that the response JSON was sent with the expected data
  //     expect(mockRes.json).toHaveBeenCalledWith({ name: 'success' })

  //     // Check that the pinataSDK function was called with the expected arguments
  //     expect(mockPinata.pinFileToIPFS).toHaveBeenCalledWith(
  //       mockStream,
  //       expect.objectContaining({
  //         pinataMetadata: {
  //           name: 'test-image',
  //         },
  //         pinataOptions: {
  //           cidVersion: 0,
  //         },
  //       })
  //     )
  //   })

  //   it('should handle errors', async () => {
  //     // Set up the request and response mocks
  //     mockReq.body = { image: 'base64-encoded-data', name: 'test-image' }
  //     mockRes.status.mockReturnThis()

  //     // Set up the pinataSDK mock to throw an error
  //     const mockError = new Error('Pinata error')
  //     mockPinata.pinFileToIPFS.mockRejectedValueOnce(mockError)

  //     // Call the handler with the mock request and response
  //     await handler(mockReq, mockRes)

  //     // Check that the response status was set to 500
  //     expect(mockRes.status).toHaveBeenCalledWith(500)

  //     // Check that the response JSON was sent with the expected data
  //     expect(mockRes.json).toHaveBeenCalledWith({ name: 'fail' })
  //   })
})
