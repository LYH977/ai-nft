// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import pinataSDK from '@pinata/sdk'
import { Readable } from 'stream'

const pinata = new pinataSDK({
  pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { image, name } = req.body
  try {
    console.log((image as string).substring(0, 10))

    const data = image.replace(/^data:image\/jpeg;base64,/, '')
    const buff = Buffer.from(data, 'base64')
    const stream = Readable.from(buff)
    const options = {
      pinataMetadata: {
        name,
      },
      pinataOptions: {
        cidVersion: 0 as const,
      },
    }

    const result = await pinata.pinFileToIPFS(stream, options)
    console.log(result)

    res.status(200).json({ name: 'success' })
  } catch (e) {
    res.status(500).json({ name: 'fail' })
  }
}
