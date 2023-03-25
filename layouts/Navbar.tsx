import { Button } from '@/components/Button'
import { formatAddress } from '@/utils/formatter'
import React from 'react'
import { toast } from 'react-toastify'

type NavbarProps = {
    ownerAddress: string
    loadBlockchainData: () => void
}

export const Navbar = ({ ownerAddress, loadBlockchainData }: NavbarProps) => {
    const hasOwnerAddress = Boolean(ownerAddress)

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(ownerAddress);
        toast.success(`Copied address "${ownerAddress}"`)
    }
    return (
        <header className='flex flex-row justify-between items-center p-2 mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
            <h1 className='text-white font-extrabold'>AiNFT</h1>
            { hasOwnerAddress
                ? <Button onClick={ copyToClipboard } >{ formatAddress(ownerAddress) }</Button>
                : <Button onClick={ loadBlockchainData } >Connect</Button>
            }


        </header>
    )
}
