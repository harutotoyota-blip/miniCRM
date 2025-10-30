import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ContactForm from '../src/components/ContactForm'

describe('ContactForm', () => {
  it('should render empty form in create mode', () => {
    render(<ContactForm onSubmit={() => {}} onCancel={() => {}} />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('should render form with initial values in edit mode', () => {
    const contact = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890'
    }
    
    render(<ContactForm contact={contact} onSubmit={() => {}} onCancel={() => {}} />)
    
    expect(screen.getByLabelText(/name/i)).toHaveValue(contact.name)
    expect(screen.getByLabelText(/email/i)).toHaveValue(contact.email)
    expect(screen.getByLabelText(/phone/i)).toHaveValue(contact.phone)
  })

  it('should validate required fields', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} onCancel={() => {}} />)
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})