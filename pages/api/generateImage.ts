// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { HUGGING_FACE_API } from '@/utils/constants'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { description } = req.body
  console.log({ description })
  try {
    const response = await axios.post(
      HUGGING_FACE_API,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}}`,
        },
        method: 'POST',
        inputs: description,
      },
      { responseType: 'arraybuffer' }
    )
    if (response.status === 200) {
      const type = response.headers['content-type']
      const data = response.data

      const base64data = Buffer.from(data).toString('base64')
      const img = `data:${type};base64,` + base64data
      res.status(200).json({ base64: img })
    } else {
      res.status(503).json({ error: 'Service Unavailable' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Problem' })
  }
}
