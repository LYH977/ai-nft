// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import pinataSDK from '@pinata/sdk'
import { Readable } from 'stream'

const pinata = new pinataSDK({
  pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
})

// type KeyValues = {
//   [key: string]: string | number | null
// }
// interface PinataPinOptions {
//   pinataMetadata?: {
//     name?: string
//     keyvalues?: KeyValues
//   }
//   pinataOptions?: {
//     cidVersion?: number
//   }
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { image, name, description } = req.body
  try {
    const data = image.replace(/^data:image(.+);base64,/, '')

    const buff = Buffer.from(data, 'base64')
    const stream = Readable.from(buff)
    const options = {
      pinataMetadata: {
        name,

        keyvalues: { description },
      },
      pinataOptions: {
        cidVersion: 0,
      },
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { IpfsHash, Timestamp } = await pinata.pinFileToIPFS(stream, options)
    res.status(200).json({ IpfsHash, Timestamp })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal Server Problem' })
  }
}
