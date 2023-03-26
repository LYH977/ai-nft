import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Card } from '../Card'
import { mockCreatedAt, mockDesc, mockImgName, mockOwnerAddress } from '@/mockData'
import { base64 } from '@/public/mock/base64'
import { formatAddress } from '@/utils/formatter'


describe('Card component test', () => {
    it('shoud show image with name and description', () => {
        render(<Card name={ mockImgName } description={ mockDesc } path={ base64 } />)
        expect(screen.getByRole('img', { name: mockDesc })).toBeInTheDocument()
        expect(screen.getByText(mockImgName)).toBeInTheDocument()
        expect(screen.getByText(mockDesc)).toBeInTheDocument()
    })

    it('shoud show image with name, description, woner and cration date', () => {
        const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' })
        render(<Card name={ mockImgName } description={ mockDesc } path={ base64 } owner={ mockOwnerAddress } createdAt={ mockCreatedAt } />)
        expect(screen.getByRole('img', { name: mockDesc })).toBeInTheDocument()
        expect(screen.getByText(mockImgName)).toBeInTheDocument()
        expect(screen.getByText(mockDesc)).toBeInTheDocument()
        expect(screen.getByText(formatAddress(mockOwnerAddress))).toBeInTheDocument()
        expect(screen.getByText(formatter.format(new Date(mockCreatedAt)))).toBeInTheDocument()

    })

})