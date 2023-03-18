// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { base64 } from '@/public/mock/base64'
import { HUGGING_FACE_API } from '@/utils/api'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { description } = req.body
  try {
    const response = await axios.post(
      HUGGING_FACE_API,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}}`,
        },
        method: 'POST',
        inputs: description,
      },
      { responseType: 'arraybuffer' }
    )

    const type = response.headers['content-type']
    const data = response.data

    const base64data = Buffer.from(data).toString('base64')
    const img = `data:${type};base64,` + base64data
    res.status(200).json({ status: 'SUCCESS', data: img })
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: 'FAIL' })
  }
}