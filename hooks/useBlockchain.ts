import axios from 'axios'
import { ethers } from 'ethers'
import React, { useEffect, useRef, useState } from 'react'
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
      // const newProvider: any = new ethers.providers.Web3Provider((window as any).ethereum)
      const newProvider: any = new ethers.providers.Web3Provider(
        (window as any).ethereum
      )
      setProvider(newProvider)

      // setProvider(newProvider)
      setOwnerAddress(await (await newProvider.getSigner()).getAddress())
      // const network = await provider.getNetwork()
      setSmartContract(
        new ethers.Contract(
          '0x5fbdb2315678afecb367f032d93f642f64180aa3', //contract address
          NFT.abi,
          newProvider
        )
      )
      toast.success('Crypto wallet is connected!')
      //   fetchNftCollection()
    } else {
      toast.warning('Crypto wallet is not detected!')
    }
  }

  return { ownerAddress, loadBlockchainData, provider, smartContract }
}
