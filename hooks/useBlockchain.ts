import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import MyContract from '@/public/MyContract.json'
import { CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID } from '@/utils/constants'

export const useBlockchain = () => {
  const w = global.window
  const isNotSepolia = (chainId: number) => chainId !== SEPOLIA_CHAIN_ID
  const [ownerAddress, setOwnerAddress] = useState<string>('')
  const [provider, setProvider] = useState<any>()
  const [smartContract, setSmartContract] = useState<any>()
  const providerRef = useRef<any>()
  const loadBlockchainData = async () => {
    if (w.ethereum) {
      try {
        const address = await w.ethereum.request({
          method: 'eth_requestAccounts',
        })
        const { ethers } = await import('ethers')
        const newProvider: any = new ethers.providers.Web3Provider(w.ethereum)
        const { chainId } = await newProvider.getNetwork()
        if (isNotSepolia(chainId)) {
          toast.warning('Sepolia testnet is not detected')
          return
        }
        setProvider(newProvider)
        providerRef.current = newProvider
        setOwnerAddress(address[0])
        setSmartContract(
          new ethers.Contract(CONTRACT_ADDRESS, MyContract.abi, newProvider)
        )

        toast.success('Crypto wallet is connected!')
      } catch (e) {
        toast.warning(
          'Something wrong with crypto wallet. Please log in your account properly.'
        )
      }
    } else {
      toast.warning('Crypto wallet is not detected!')
    }
  }

  useEffect(() => {
    const detectChainChange = () => {
      if (w.ethereum) {
        w.ethereum.on('chainChanged', () => {
          window.location.reload()
        })
      }
    }
    const detectAccountChanged = async () => {
      if (w.ethereum) {
        w.ethereum.on('accountsChanged', async (accounts: any) => {
          try {
            const { chainId } = await providerRef.current.getNetwork()
            if (isNotSepolia(chainId)) {
              toast.warning('Sepolia testnet is no longer detected')
              return
            }
            setOwnerAddress(accounts[0])
            toast.success(`Account changed to ${accounts[0]}`)
          } catch (error) {
            toast.warning(
              'New crypto wallet is not detected!. Please refresh the page.'
            )
          }
        })
      }
    }
    detectChainChange()
    detectAccountChanged()
    loadBlockchainData()
  }, [])

  return { ownerAddress, loadBlockchainData, provider, smartContract }
}
