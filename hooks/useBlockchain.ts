import { CONTRACT_ADDRESS } from '@/utils/constants'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export const useBlockchain = () => {
  const [ownerAddress, setOwnerAddress] = useState<string>('')
  const [provider, setProvider] = useState<any>()
  const [smartContract, setSmartContract] = useState<any>()

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const loadBlockchainData = async () => {
    if ((window as any).ethereum) {
      try {
        const { ethers } = await import('ethers')
        const newProvider: any = new ethers.providers.Web3Provider(
          (window as any).ethereum
        )
        setProvider(newProvider)

        setOwnerAddress(await (await newProvider.getSigner()).getAddress())
        // const network = await provider.getNetwork()
        setSmartContract(
          new ethers.Contract(
            CONTRACT_ADDRESS, //contract address
            NFT.abi,
            newProvider
          )
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

  return { ownerAddress, loadBlockchainData, provider, smartContract }
}
