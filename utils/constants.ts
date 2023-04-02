export const HUGGING_FACE_API2 =
  'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5'

export const HUGGING_FACE_API =
  'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2'

export const PINATA_PIN_LIST_API = 'https://api.pinata.cloud/data/pinList'

const HARDHAT_CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

const SEPOLIA_CONTRACT_ADDRESS = '0xDCa2A3eE1Af422106694D1bB729891384904DabD'

export const SEPOLIA_CHAIN_ID = 11155111

export const CONTRACT_ADDRESS =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
    ? SEPOLIA_CONTRACT_ADDRESS
    : HARDHAT_CONTRACT_ADDRESS
