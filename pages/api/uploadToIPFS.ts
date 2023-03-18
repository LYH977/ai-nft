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
    const data = image.replace(/^data:image(.+);base64,/, '')

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

    const { IpfsHash } = await pinata.pinFileToIPFS(stream, options)

    res.status(200).json({ IpfsHash })
  } catch (e) {
    console.error(e)
    res.status(500)
  }
}
