// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import pinataSDK from '@pinata/sdk'
type Data = {
  name: any
}

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   res.status(200).json({ name: 'John Doe' })
// }

const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
})

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  pinata
    .testAuthentication()
    .then((result) => {
      //handle successful authentication here
      console.log(result)
      res.status(200).json({ name: 'success' })
    })
    .catch((err) => {
      //handle error here
      res.status(200).json({ name: 'fail' })
    })
  // res.status(200).json({ name: process.env.PINATA_API_KEY })
}
