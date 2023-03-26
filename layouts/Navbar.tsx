import { Button } from '@/components/Button'
import { formatAddress } from '@/utils/formatter'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

type NavbarProps = {
    ownerAddress: string
    loadBlockchainData: () => Promise<void>
}

export const Navbar = ({ ownerAddress, loadBlockchainData }: NavbarProps) => {
    const hasOwnerAddress = Boolean(ownerAddress)
    const [isLoading, setIsLoading] = useState(false)

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(ownerAddress);
        toast.success(`Copied address "${ownerAddress}"`)
    }

    const connectCryptoWallet = async () => {
        setIsLoading(true)
        await loadBlockchainData()
        setIsLoading(false)
    }


    return (
        <header className='flex flex-row justify-between items-center p-2 mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
            <h1 className='text-white font-extrabold'>AiNFT</h1>
            { hasOwnerAddress
                ? <Button onClick={ copyToClipboard } >{ formatAddress(ownerAddress) }</Button>
                : <Button onClick={ connectCryptoWallet } isLoading={ isLoading } disabled={ isLoading }>Connect</Button>
            }
        </header>
    )
}
