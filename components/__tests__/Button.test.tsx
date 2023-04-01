import { render, screen } from '@testing-library/react'

import { Button } from '../Button'
import '@testing-library/jest-dom'

jest.mock('@/icons/Spinner', () => ({
    Spinner: <div>Spinner</div>
}))

describe('Button component test', () => {
    it('shoud show loading spinner when isLoading is true', () => {
        render(<Button isLoading />)
        expect(screen.getByText('Spinner')).toBeInTheDocument()
    })
    it('shoud not show loading spinner when isLoading is false', () => {
        render(<Button />)
        expect(screen.queryByText('Spinner')).not.toBeInTheDocument()
    })
})