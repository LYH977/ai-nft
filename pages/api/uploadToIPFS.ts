/* eslint-disable @typescript-eslint/ban-ts-comment */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import pinataSDK from '@pinata/sdk'

import { Readable } from 'stream'
import axios from 'axios'
import FormData from 'form-data'

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: 'John Doe' })
// }

const pinata = new pinataSDK({
  pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { image } = req.body
  // console.log(image)
  try {
    console.log((image as string).substring(0, 10))
    //@ts-ignore
    // const readStream = fs.createReadStream(null, {
    //   fd: Buffer.from(image, 'base64'),
    // })

    // const readableStream = new PassThrough()
    // readableStream.end(buffer)
    // const dummy = './image.png'
    // const writeStream = fs.createWriteStream(dummy)
    // // pipe the readable stream to the write stream to write the data
    // readableStream.pipe(writeStream)
    // // once the data has been written, create a new read stream to read the file
    // const readableStreamForFile = fs.createReadStream(dummy)

    const data = image.replace(/^data:image\/jpeg;base64,/, '')
    const buff = Buffer.from(data, 'base64')
    const stream = Readable.from(buff)
    const options = {
      pinataMetadata: {
        name: 'fxk',
      },
      pinataOptions: {
        cidVersion: 0 as const,
      },
    }
    // //@ts-ignore
    // stream.path = 'some_filename.png'

    const result = await pinata.pinFileToIPFS(stream, options)
    console.log(result)
    // console.log({ ipfs })

    res.status(200).json({ name: 'success' })
  } catch (e) {
    res.status(200).json({ name: 'fail' })
  }
}

const uploadFromBuffer = async (buffer: Buffer) => {
  try {
    const stream = Readable.from(buffer)
    const data = new FormData()
    //@ts-ignore
    data.append('file', stream)
    const metadata = JSON.stringify({
      name: 'ggfxk',
      author: 'LYH',
    })
    data.append('pinataMetadata', metadata)
    const options = JSON.stringify({
      cidVersion: 0,
    })
    data.append('pinataOptions', options)

    // data.append('file', stream, {
    //   filepath: 'FILENAME.png',
    // })

    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data,
      {
        //@ts-ignore
        maxBodyLength: 'Infinity',
        headers: {
          //@ts-ignore
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
      }
    )

    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}
