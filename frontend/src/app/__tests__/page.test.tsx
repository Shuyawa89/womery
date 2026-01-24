import { render, screen } from '@testing-library/react'
import HomePage from '../page'

describe('HomePage', () => {
  it('renders home page', () => {
    render(<HomePage />)
    // TODO: Add assertions when the page has content
    expect(screen.getByText(/womery/i)).toBeInTheDocument()
  })
})
