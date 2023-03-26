import { render, screen } from '@testing-library/react'
import { Collection } from '../Collection'
import { mockCreatedAt, mockDesc, mockImgName, mockOwnerAddress, mockTokenURI } from '@/mockData'
import '@testing-library/jest-dom'

import { CardProps } from '@/components/Card'

jest.mock('@/icons/Spinner', () => ({
    Spinner: <div>Spinner</div>
}))

jest.mock('@/components/Card', () => ({
    Card: (props: CardProps) => <div data-testid='mock-card'>{ props.path }</div>
}))

describe('Collection component ui test', () => {


    it('should render a message if ownerAddress is falsy', () => {
        render(<Collection ownerAddress="" collection={ [] } isFetchingNft={ false } />)
        expect(screen.getByText(/You need to connect to crypto wallet to view NFTs/i)).toBeInTheDocument()
    });

    it('should render a spinner if isFetchingNft is true', () => {
        render(<Collection ownerAddress={ mockOwnerAddress } collection={ [] } isFetchingNft={ true } />)
        expect(screen.getByText('Spinner')).toBeInTheDocument()
    });

    it('should render a collection of cards if ownerAddress and collection are truthy and isFetchingNft is false', () => {
        const totalCount = 3
        const mockCollection = [...Array(totalCount)].map((_, index) => ({
            description: mockDesc,
            name: mockImgName,
            path: mockTokenURI + index,
            createdAt: mockCreatedAt,
            owner: mockOwnerAddress,
        }))
        render(<Collection ownerAddress={ mockOwnerAddress } collection={ mockCollection } isFetchingNft={ false } />);
        const cards = screen.getAllByTestId('mock-card');
        expect(cards).toHaveLength(totalCount);

    });
})