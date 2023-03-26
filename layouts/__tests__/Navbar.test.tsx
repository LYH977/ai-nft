import { mockOwnerAddress } from '@/mockData'
import { formatAddress } from '@/utils/formatter'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { Navbar } from '../Navbar'
import { toast } from 'react-toastify'

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
    }
}))

describe('Navbar', () => {
    const mockLoadBlockchainData = jest.fn()

    it('should render the title and the connect button when no owner address is provided', () => {
        render(<Navbar ownerAddress='' loadBlockchainData={ mockLoadBlockchainData } />)
        expect(screen.getByText(/AiNFT/i)).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: formatAddress(mockOwnerAddress) })).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: /connect/i })).toBeInTheDocument()
    })

    it('should render the title and the formatted owner address when an owner address is provided', () => {
        render(<Navbar ownerAddress={ mockOwnerAddress } loadBlockchainData={ mockLoadBlockchainData } />)
        expect(screen.getByText(/AiNFT/i)).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /connect/i })).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: formatAddress(mockOwnerAddress) })).toBeInTheDocument()
    })

    it('should call the loadBlockchainData function when the connect button is clicked', async () => {
        const user = userEvent.setup()
        render(<Navbar ownerAddress="" loadBlockchainData={ mockLoadBlockchainData } />)
        const connectButton = screen.getByRole('button', { name: /connect/i })
        await user.click(connectButton)
        expect(mockLoadBlockchainData).toHaveBeenCalled()
    })

    it('should copy the owner address to clipboard and show a toast when the address button is clicked', async () => {
        const mockClipboard = jest.fn()
        jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(mockClipboard)
        const user = userEvent.setup()
        render(<Navbar ownerAddress={ mockOwnerAddress } loadBlockchainData={ mockLoadBlockchainData } />)
        const addressButton = screen.getByRole('button', { name: formatAddress(mockOwnerAddress) })
        await user.click(addressButton)
        expect(mockClipboard).toHaveBeenCalledWith(mockOwnerAddress)
        expect(toast.success).toHaveBeenCalledWith(`Copied address "${mockOwnerAddress}"`)
    })
})