import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { ImageInfoProps } from '@/types'

import { NftProps } from '../types'

export const useNFT = (
  smartContract: any,
  provider: any,
  ownerAddress: string
) => {
  const [collection, setCollection] = useState<NftProps[]>([])
  const [isFetchingNft, setIsFetchingNft] = useState(false)

  useEffect(() => {
    const fetchNftCollection = async () => {
      setIsFetchingNft(true)
      const total = await smartContract.totalSupply()
      const newCollection: NftProps[] = []
      const lastIndex = Number(total)
      for (let i = lastIndex; i > 0; i--) {
        const path = await smartContract.tokenURI(i)
        const hash = path.split('/').pop()
        const {
          data: { name, createdAt, description },
        } = await axios.get('./api/getMetadata?hash=' + hash)
        newCollection.push({
          owner: await smartContract.ownerOf(i),
          path,
          name,
          createdAt,
          description,
        })
      }
      setIsFetchingNft(false)
      setCollection(newCollection)
    }
    if (smartContract) fetchNftCollection()
  }, [smartContract])

  const mintNFT = async (
    e: React.MouseEvent<HTMLButtonElement>,
    { imgName, image, desc, setImage }: ImageInfoProps
  ) => {
    e.preventDefault()
    try {
      const response = await axios.post(`./api/uploadToIPFS`, {
        name: imgName,
        image,
        description: desc,
      })

      if (response.status === 200) {
        // const gg = true
        // if (gg) {
        const { IpfsHash, Timestamp } = response.data
        //   const IpfsHash = mockTokenURI
        //   const Timestamp = mockCreatedAt

        const { ethers } = await import('ethers')
        const signer = await provider.getSigner()
        const transaction = await smartContract
          .connect(signer)
          .mint(`https://gateway.pinata.cloud/ipfs/${IpfsHash}`, {
            value: ethers.utils.parseUnits('0.01', 'ether'),
          })
        await transaction.wait()
        toast.success('Minted NFT!')
        setImage('')
        setCollection((collection: NftProps[]) => [
          {
            owner: ownerAddress,
            path: image,
            name: imgName,
            createdAt: Timestamp,
            description: desc,
          },
          ...collection,
        ])
      } else {
        toast.error(
          'Ipfs upload service is currently unavailable. Please come back later.'
        )
      }
    } catch (e) {
      console.error(e)
      toast.error(
        'Something wrong with crypto wallet. Maybe clear tab data and try again.'
      )
    }
  }
  return { mintNFT, collection, isFetchingNft }
}
