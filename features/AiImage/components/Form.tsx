import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { ImageInfoProps } from '@/types'
import React from 'react'
import { LoadingStatus } from '../enums'
import { useAiImage } from '../hooks/useAiImage'
import { Placeholder } from './Placeholder'

type FormProps = {
    mintNFT: (e: React.MouseEvent<HTMLButtonElement>, imageInfoProps: ImageInfoProps) => Promise<void>
    ownerAddress: string | undefined
}

export const Form = ({ mintNFT, ownerAddress }: FormProps) => {
    const { generateImage, setImgName, setDesc, handleMintingNFT, isGenerateBtnDisabled, isMintBtnDisabled, image, generatedImage, loading } = useAiImage(ownerAddress, mintNFT)

    return (
        <section aria-labelledby='get-nft' className='flex flex-col justify-center items-center gap-8 relative'>
            <h2 id='get-nft' className='text-4xl font-extrabold text-center'>Generate your NFT with AI!</h2>
            <div className='relative w-full flex flex-col items-center justify-center gap-16 sm:flex-row sm:items-start'>
                <form className='flex flex-col gap-7 min-w-[300px]' onSubmit={ generateImage }>
                    <label className='flex flex-col'>
                        Name
                        <input className='bg-gray-100 p-1' name='imgName' onChange={ (e) => setImgName(e.target.value) } />
                    </label>
                    <label className='flex flex-col'>
                        Description
                        <textarea className='bg-gray-100 h-32 p-1 resize-none' name='description' onChange={ (e) => setDesc(e.target.value) } />
                    </label>
                    <Button className='bg-indigo-500 w-[200px] enabled:hover:bg-indigo-700' type='submit' disabled={ isGenerateBtnDisabled } isLoading={ loading === LoadingStatus.GENERATING }>Generate Image</Button>
                </form>
                <div className='flex flex-col gap-4'>
                    { image ?
                        <>
                            <Card path={ image } name={ generatedImage.imgName } description={ generatedImage.desc } aria-label='image based on description' />
                            <div>
                                <Button className='bg-pink-500 enabled:hover:bg-pink-700 w-full' disabled={ isMintBtnDisabled } isLoading={ loading === LoadingStatus.MINTING } onClick={ handleMintingNFT }>Mint NFT</Button>
                                <strong className='text-red-600 text-xs'>You need a crypto wallet to mint!</strong>
                            </div>
                        </>
                        : Placeholder }
                </div>
            </div >
        </section>
    )
}



