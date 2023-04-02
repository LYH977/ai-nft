import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'
import Home from '../pages'

describe('Homepange Ui unit test', () => {


    it('should render the navbar, form and collection components', () => {
        render(<Home />);

        const banner = screen.getByRole('banner');
        const form = screen.getByRole('region', {
            name: /generate your nft with ai!/i
        })
        const collection = screen.getByRole('region', {
            name: /nft collections/i
        })
        expect(banner).toBeInTheDocument();
        expect(form).toBeInTheDocument();
        expect(collection).toBeInTheDocument();
    });
})