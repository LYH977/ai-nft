import { PINATA_PIN_LIST_API } from '@/utils/constants'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { hash } = req.query

  try {
    const response = await axios.get(
      `${PINATA_PIN_LIST_API}?hashContains=${hash}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
      }
    )
    if (response.status === 200) {
      const {
        rows: [data],
      } = response.data
      const metadata = {
        createdAt: data.date_pinned,
        name: data.metadata.name,
        description: data.metadata.keyvalues.description,
      }
      res.status(200).json(metadata)
    } else {
      res.status(503).json({ error: 'Service Unavailable' })
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Internal Server Problem' })
  }
}
