import axios from 'axios'
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { bigbase64 } from '@/public/mock/bigBase64'
import { ImageInfoProps } from '@/types'

import { LoadingStatus } from '../enums'

export const useAiImage = (
  ownerAddress: string | undefined,
  mintNFT: (
    e: React.MouseEvent<HTMLButtonElement>,
    imageInfoProps: ImageInfoProps
  ) => Promise<void>
) => {
  const [imgName, setImgName] = useState('')
  const [desc, setDesc] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState<LoadingStatus>(LoadingStatus.NONE)

  const generatedImage = useRef<any>({ imgName: '', desc: '' })

  const isGenerateBtnDisabled =
    !(imgName && desc) || loading !== LoadingStatus.NONE
  const isMintBtnDisabled =
    !image || !ownerAddress || loading === LoadingStatus.MINTING

  const generateImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(LoadingStatus.GENERATING)
    try {
      const response = await axios.post(`./api/generateImage`, {
        description: desc,
      })
      // const gg = true
      // if (gg) {
      if (response.status === 200) {
        generatedImage.current = { imgName, desc }

        setImage(response.data.base64)
        // setImage(bigbase64)
        setImgName('')
        setDesc('')
        toast.success(`Generated image "${imgName}"`)
      } else {
        toast.error(
          'Image generation service is currently unavailable. Please come back later.'
        )
      }
    } catch (err) {
      console.error(err)
      toast.error('Oops. something is wrong now. Please come back later.')
    } finally {
      setLoading(LoadingStatus.NONE)
    }
  }

  const handleMintingNFT = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(LoadingStatus.MINTING)
    await mintNFT(e, {
      image,
      imgName: generatedImage.current.imgName,
      desc: generatedImage.current.desc,
      setImage,
    })
    setLoading(LoadingStatus.NONE)
  }

  return {
    generateImage,
    handleMintingNFT,
    setImgName,
    setDesc,
    isGenerateBtnDisabled,
    isMintBtnDisabled,
    image,
    generatedImage: generatedImage.current,
    loading,
    imgName,
    desc,
  }
}
