export const mockImgName = 'My apple'
export const mockDesc = 'green apple'
export const mockTotalSupply = 2
export const mockTokenURI = 'GFVUIHJV58G'
export const mockOwnerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
export const mockCreatedAt = '2023-03-19T08:32:41.418Z'

export const mockSigner = {
  getAddress: async function () {
    return mockOwnerAddress
  },
}
export const mockProvider = function (this: any) {
  this.getSigner = async function () {
    return mockSigner
  }
}

export const MockContract = function (this: any) {
  this.index = 0
  this.connect = function () {
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
  this.totalSupply = async function () {
    return mockTotalSupply
  }

  this.tokenURI = async function () {
    this.index++
    return mockTokenURI + this.index
  }

  this.ownerOf = async function () {
    return mockOwnerAddress
  }
}

export const getMockServerErrorResponse = () => ({
  status: 500,
})

export const getMockServerSuccessResponse = (param: object) => ({
  data: param,
  status: 200,
})

export class MockContract2 {
  index: number
  constructor() {
    this.index = 0
  }
  connect = function () {
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

  totalSupply = async function () {
    return mockTotalSupply
  }

  tokenURI = async () => {
    this.index++
    return mockTokenURI + this.index
  }

  ownerOf = async function () {
    return mockOwnerAddress
  }
}

export class MockProvider2 {
  constructor() {
    this.getSigner = async function () {
      return mockSigner
    }
  }
  getSigner = async function () {
    return mockSigner
  }
}
