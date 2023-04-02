import { SEPOLIA_CHAIN_ID } from './utils/constants'

export const mockImgName = 'My apple'
export const mockDesc = 'green apple'
export const mockTotalSupply = 2
export const mockTokenURI = 'GFVUIHJV58G'
export const mockOwnerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
export const mockCreatedAt = '2023-03-19T08:32:41.418Z'

const mockSigner = {
  getAddress: jest.fn().mockResolvedValue(mockOwnerAddress),
}

let currentChainId = SEPOLIA_CHAIN_ID
export const setCurrentChainId = (chainId: number) => (currentChainId = chainId)

export class MockProvider {
  private static mockProviderInstance: MockProvider | null = null

  constructor() {
    if (MockProvider.mockProviderInstance) {
      return MockProvider.mockProviderInstance
    }
    MockProvider.mockProviderInstance = this
  }
  async getSigner() {
    return mockSigner
  }

  async getNetwork() {
    return { chainId: currentChainId }
  }
}

export class MockContract {
  private static mockContractInstance: MockContract | null = null
  private index = 0
  constructor() {
    if (MockContract.mockContractInstance) {
      return MockContract.mockContractInstance
    }

    MockContract.mockContractInstance = this
  }
  connect() {
    return {
      mint() {
        return {
          async wait() {
            return 'nothing'
          },
        }
      },
    }
  }

  async totalSupply() {
    return mockTotalSupply
  }

  async tokenURI() {
    this.index++
    return mockTokenURI + this.index
  }

  async ownerOf() {
    return mockOwnerAddress
  }

  clearIndex() {
    this.index = 0
  }
}

export const getMockServerErrorResponse = () => ({
  status: 500,
})

export const getMockServerSuccessResponse = (param: object) => ({
  data: param,
  status: 200,
})
