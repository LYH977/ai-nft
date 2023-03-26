import { render, screen } from '@testing-library/react'
import { Form } from '../Form'
import { useAiImage } from '../../hooks/useAiImage'
import { base64 } from '@/public/mock/base64'
import { mockDesc, mockImgName, mockOwnerAddress } from '@/mockData'
import '@testing-library/jest-dom'

import userEvent from '@testing-library/user-event'
import { LoadingStatus } from '../../enums'

jest.mock('../../hooks/useAiImage')
jest.mock('../Placeholder', () => ({ Placeholder: <div>placeholder</div> }))

describe('Form', () => {

    let mockUseAiImage: any
    const mockMintNFT = jest.fn()
    const getTextbox = (name: 'name' | 'description') => screen.getByRole('textbox', {
        name: new RegExp(name, 'i')
    })
    const getButton = (name: 'generate image' | 'mint nft') => screen.getByRole('button', {
        name: new RegExp(name, 'i')
    })
    beforeEach(() => {
        mockUseAiImage = {
            generateImage: jest.fn(),
            setImgName: jest.fn(),
            setDesc: jest.fn(),
            handleMintingNFT: jest.fn(),
            isGenerateBtnDisabled: false,
            isMintBtnDisabled: false,
            image: '',
            generatedImage: { imgName: '', desc: '' },
            loading: LoadingStatus.NONE
        }
            ; (useAiImage as jest.Mock).mockReturnValue(mockUseAiImage)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should render the title and the form elements in initial setup', () => {
        render(<Form mintNFT={ mockMintNFT } ownerAddress={ mockOwnerAddress } />)
        expect(screen.getByText(/generate your nft with ai!/i)).toBeInTheDocument()
        expect(getTextbox('name')).toBeInTheDocument()
        expect(getTextbox('description')).toBeInTheDocument()
        expect(getButton('generate image')).toBeInTheDocument()
        expect(screen.getByText('placeholder')).toBeInTheDocument()
    })

    it('should call the setImgName and setDesc functions when typing in the inputs', async () => {
        const user = userEvent.setup()
        render(<Form mintNFT={ mockMintNFT } ownerAddress={ mockOwnerAddress } />)
        await user.type(getTextbox('name'), mockImgName)
        await user.type(getTextbox('description'), mockDesc)
        expect(mockUseAiImage.setImgName).toHaveBeenCalledWith(mockImgName)
        expect(mockUseAiImage.setDesc).toHaveBeenCalledWith(mockDesc)
    })

    it('should call the generateImage function when submitting the form', async () => {
        const user = userEvent.setup()
        render(<Form mintNFT={ mockMintNFT } ownerAddress={ mockOwnerAddress } />)
        await user.type(getTextbox('name'), mockImgName)
        await user.type(getTextbox('description'), mockDesc)
        await user.click(getButton('generate image'))
        expect(mockUseAiImage.generateImage).toHaveBeenCalled()
    })

    it('should render the card and the mint button when image is not empty', () => {
        mockUseAiImage.image = base64
        mockUseAiImage.generatedImage = {
            imgName: mockImgName,
            desc: mockDesc
        }
        render(<Form mintNFT={ mockMintNFT } ownerAddress={ mockOwnerAddress } />)
        expect(screen.getByRole('img', { name: /image based on description/i })).toBeInTheDocument()
        expect(screen.getByText(mockImgName)).toBeInTheDocument()
        expect(screen.getByText(mockDesc)).toBeInTheDocument()
        expect(getButton('mint nft')).toBeInTheDocument()
        expect(screen.queryByText('placeholder')).not.toBeInTheDocument()
    })

    it('should call the handleMintingNFT function when clicking the mint button', async () => {
        mockUseAiImage.image = base64
        mockUseAiImage.generatedImage = {
            imgName: mockImgName,
            desc: mockDesc
        }
        const user = userEvent.setup()
        render(<Form mintNFT={ mockMintNFT } ownerAddress={ mockOwnerAddress } />)
        await user.click(getButton('mint nft'))
        expect(mockUseAiImage.handleMintingNFT).toHaveBeenCalled()
    })
})
