// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { base64 } from '@/public/mock/base64'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
type Data = {
  name: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { test } = req.body
  // try {
  //   const response = await axios.post(
  //     `https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}}`,
  //       },
  //       method: 'POST',
  //       inputs: 'green apple',
  //     },
  //     { responseType: 'arraybuffer' }
  //   )
  //   const type = response.headers['content-type']
  //   const data = response.data

  //   const base64data = Buffer.from(data).toString('base64')
  //   const img = `data:${type};base64,` + base64data
  //   res.status(200).json({ status: 'SUCCESS', data: img })
  // } catch (err) {
  //   console.log(err)
  //   res.status(200).json({ status: 'FAIL' })
  // }
  // console.log(test)
  res.status(200).json(test)
}
