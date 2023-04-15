import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('NFT contract', function () {
  const NAME = 'AiGeneratedNFT'
  const SYMBOL = 'AINFT'
  const COST = ethers.utils.parseUnits('0.01', 'ether') // 0.01 ETH
  const getCost = (cost = '0.01') => ethers.utils.parseUnits(cost, 'ether')
  const TOKEN_URI = 'randomHash'

  async function deployNftFixture() {
    const NFT = await ethers.getContractFactory('NFT')
    const [owner, addr1, addr2] = await ethers.getSigners()
    const hardhatNFT = await NFT.deploy(NAME, SYMBOL, COST)
    await hardhatNFT.deployed()
    return { NFT, hardhatNFT, owner, addr1, addr2 }
  }

  it('should set the right owner and cost', async () => {
    const { hardhatNFT, owner } = await loadFixture(deployNftFixture)
    expect(await hardhatNFT.cost()).to.equal(COST)
    expect(await hardhatNFT.owner()).to.equal(owner.address)
  })

  it('should mint NFT and return correct total supply', async () => {
    const { hardhatNFT } = await loadFixture(deployNftFixture)
    expect(await hardhatNFT.totalSupply()).to.equal(0)
    await hardhatNFT.mint(TOKEN_URI, {
      value: getCost(),
    })
    expect(await hardhatNFT.totalSupply()).to.equal(1)
  })

  it('should not mint NFT if ether is not enough', async () => {
    const { hardhatNFT } = await loadFixture(deployNftFixture)
    expect(await hardhatNFT.totalSupply()).to.equal(0)
    await expect(
      hardhatNFT.mint(TOKEN_URI, {
        value: getCost('0.0001'),
      })
    ).to.be.revertedWith('Ether is not enough')
    expect(await hardhatNFT.totalSupply()).to.equal(0)
  })

  it('should withdraw ether when the owner calls the withdraw functipn', async () => {
    const { hardhatNFT, owner } = await loadFixture(deployNftFixture)
    const initialBalance = await hardhatNFT.balanceOf(owner.address)

    await await hardhatNFT.mint(TOKEN_URI, {
      value: getCost(),
    })
    await hardhatNFT.withdraw()
    const finalBalance = await hardhatNFT.balanceOf(owner.address)
    expect(finalBalance).not.equal(initialBalance)
  })

  it('should not allow non-owner to withdraw', async () => {
    const { hardhatNFT, addr1 } = await loadFixture(deployNftFixture)
    await expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      hardhatNFT.connect(addr1).withdraw()
    ).to.be.revertedWithoutReason()
  })
})
