/* eslint-disable @typescript-eslint/ban-ts-comment */
import { render, screen } from '@testing-library/react'
import Home from '..'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { base64 } from '@/public/mock/base64'
import { ethers } from 'ethers'
import { formatAddress } from '@/utils/formatter'
import { mockCreatedAt, mockDesc, mockImgName, mockOwnerOf, mockTokenURI, mockTotalSupply } from '@/mockData'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Homepage Testing', () => {


    const getTextbox = (name: 'name' | 'description') => screen.getByRole('textbox', {
        name: new RegExp(name, 'i')
    })

    const getButton = (name: 'generate image' | 'mint nft') => screen.getByRole('button', {
        name: new RegExp(name, 'i')
    })

    const getServerErrorResponse = () => ({
        status: 500
    })

    const getServerSuccessResponse = (param: object) => ({
        data: param,
        status: 200
    })
    beforeAll(() => {
        Object.defineProperty(window, 'ethereum', {
            value: {},
        })
        const mockSigner = {
            // getAddress: jest.fn(() => Promise.resolve(mockOwnerOf)),
            getAddress: async function () {
                return mockOwnerOf
            },

        };
        //@ts-ignore
        jest.spyOn(ethers.providers, 'Web3Provider').mockImplementation(function (this) {
            this.getSigner = async function () {
                return mockSigner
            }
        });
        //@ts-ignore
        jest.spyOn(ethers, 'Contract').mockImplementation(function (this) {
            this.index = 0
            this.connect = function () {
                return { mint() { return { async wait() { return 'nothing' } } } }
            }
            this.totalSupply = async function () {
                return mockTotalSupply
            }

            this.tokenURI = async function () {
                this.index++
                return mockTokenURI + this.index
            }

            this.ownerOf = async function () {
                return mockOwnerOf
            }
        }
        );
    })
    describe('Form Part', () => {


        // beforeEach(() => {
        //     jest.clearAllMocks();
        // });
        // afterEach(() => {
        //     jest.restoreAllMocks();
        // });



        describe('Generate Image Button', () => {

            it('should enable Generate button only when imgName and description inputs are filled', async () => {
                const user = userEvent.setup()
                render(<Home />)
                const generateBtn = getButton('generate image')
                expect(generateBtn).toBeDisabled()
                await user.type(getTextbox('name'), mockImgName)
                await user.type(getTextbox('description'), mockDesc)
                expect(generateBtn).not.toBeDisabled()
            })

            it('should update image upon SUCCESSFUL image generation API', async () => {
                mockedAxios.post.mockResolvedValueOnce(getServerSuccessResponse({ base64 }))
                const user = userEvent.setup()
                render(<Home />)
                await user.type(getTextbox('name'), mockImgName)
                await user.type(getTextbox('description'), mockDesc)
                await user.click(getButton('generate image'))
                expect(screen.getByRole('img')).toBeInTheDocument()
                expect(screen.getByText(`Generated image "${mockImgName}"`)).toBeInTheDocument()
            })

            it('should show error message upon FAILED image generation API', async () => {

                mockedAxios.post.mockResolvedValueOnce(getServerErrorResponse())
                const user = userEvent.setup()
                render(<Home />)
                await user.type(getTextbox('name'), mockImgName)
                await user.type(getTextbox('description'), mockDesc)
                await user.click(getButton('generate image'))
                expect(screen.getByText('Image generation service is currently unavailable. Please come back later.')).toBeInTheDocument()
            })

            it('should show error message upon THROWN ERROR', async () => {

                mockedAxios.post.mockRejectedValueOnce(getServerErrorResponse())
                const user = userEvent.setup()
                render(<Home />)
                await user.type(getTextbox('name'), mockImgName)
                await user.type(getTextbox('description'), mockDesc)
                await user.click(getButton('generate image'))
                expect(screen.getByText('Oops. something is wrong now. Please come back later.')).toBeInTheDocument()
            })
        })

        describe('Mint NFT Button', () => {
            it('should enable Mint NFT button only when image is shown in the document', async () => {

                mockedAxios.post.mockResolvedValueOnce(getServerSuccessResponse({ base64 }))
                const user = userEvent.setup()
                render(<Home />)
                const mintBtn = getButton('mint nft')
                expect(mintBtn).toBeDisabled()

                await user.type(getTextbox('name'), mockImgName)
                await user.type(getTextbox('description'), mockDesc)
                await user.click(getButton('generate image'))
                expect(mintBtn).not.toBeDisabled()
            })

            it('should show success message upon SUCCESSFUL minting', async () => {
                mockedAxios.post.mockResolvedValueOnce(getServerSuccessResponse({ base64 }))
                const user = userEvent.setup()
                render(<Home />)
                await user.type(getTextbox('name'), mockImgName)
                await user.type(getTextbox('description'), mockDesc)
                await user.click(getButton('generate image'))
                mockedAxios.post.mockResolvedValueOnce(getServerSuccessResponse({ IpfsHash: mockTokenURI, Timestamp: mockCreatedAt }))
                await user.click(getButton('mint nft'))
                expect(screen.getByText('Minted NFT!')).toBeInTheDocument()
            })

            it('should show error message upon FAILED minting', async () => {
                mockedAxios.post.mockResolvedValueOnce(getServerSuccessResponse({ base64 }))
                const user = userEvent.setup()
                render(<Home />)
                await user.type(getTextbox('name'), mockImgName)
                await user.type(getTextbox('description'), mockDesc)
                await user.click(getButton('generate image'))
                mockedAxios.post.mockResolvedValueOnce(getServerErrorResponse())
                await user.click(getButton('mint nft'))
                expect(screen.getByText('Ipfs upload service is currently unavailable. Please come back later.')).toBeInTheDocument()
            })
            it('should show error message upon THROWN ERROR', async () => {
                mockedAxios.post.mockResolvedValueOnce(getServerSuccessResponse({ base64 }))
                const user = userEvent.setup()
                render(<Home />)
                await user.type(getTextbox('name'), mockImgName)
                await user.type(getTextbox('description'), mockDesc)
                await user.click(getButton('generate image'))
                mockedAxios.post.mockRejectedValueOnce(getServerErrorResponse())
                await user.click(getButton('mint nft'))
                expect(screen.getByText('Oops. something is wrong now. Please come back later.')).toBeInTheDocument()
            })
        })


    })

    describe('Collection Part', () => {
        it('should show collection of NFTs', async () => {
            const user = userEvent.setup()
            mockedAxios.get.mockResolvedValue(getServerSuccessResponse({ name: mockImgName, createdAt: mockCreatedAt, description: mockDesc }))

            render(<Home />)
            await user.click(screen.getByRole('button', {
                name: /check nft/i
            }))
            expect(screen.getAllByText(`Owner: ${formatAddress(mockOwnerOf)}`)).toHaveLength(mockTotalSupply)
            expect(screen.getAllByRole('img', { name: mockImgName })).toHaveLength(mockTotalSupply)
            expect(screen.getAllByText(`Description: ${mockDesc}`)).toHaveLength(mockTotalSupply)
            expect(screen.getAllByText(`Created At ${mockCreatedAt}`)).toHaveLength(mockTotalSupply)

        })


        it('should add newly minted into collection upon SUCCESSFUL minting', async () => {
            mockedAxios.post.mockResolvedValueOnce(getServerSuccessResponse({ base64 }))
            const user = userEvent.setup()
            render(<Home />)
            await user.type(getTextbox('name'), mockImgName)
            await user.type(getTextbox('description'), mockDesc)
            await user.click(getButton('generate image'))
            mockedAxios.post.mockResolvedValueOnce(getServerSuccessResponse({ IpfsHash: mockTokenURI, Timestamp: mockCreatedAt }))
            await user.click(getButton('mint nft'))
            expect(screen.getByText('Minted NFT!')).toBeInTheDocument()
            expect(screen.getByText(`Owner: ${formatAddress(mockOwnerOf)}`)).toBeInTheDocument()
            expect(screen.getByRole('img', { name: mockImgName })).toBeInTheDocument()
            expect(screen.getByText(`Description: ${mockDesc}`)).toBeInTheDocument()
            expect(screen.getByText(`Created At ${mockCreatedAt}`)).toBeInTheDocument()
        })
    })
})

