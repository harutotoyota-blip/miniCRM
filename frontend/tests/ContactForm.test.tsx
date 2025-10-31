import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ContactForm from '../src/components/ContactForm'

describe('ContactForm', () => {
  it('should render empty form in create mode', () => {
    render(<ContactForm onSubmit={async () => {}} />)
    
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Phone (optional)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('should render form with initial values in edit mode', () => {
    const contact = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890'
    }
    
    render(<ContactForm 
      onSubmit={async () => {}} 
      initial={contact}
      mode="edit"
      onCancel={() => {}}
    />)
    
    expect(screen.getByPlaceholderText('Name')).toHaveValue(contact.name)
    expect(screen.getByPlaceholderText('Email')).toHaveValue(contact.email)
    expect(screen.getByPlaceholderText('Phone (optional)')).toHaveValue(contact.phone)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  describe('ContactForm', () => {
  it('should validate required fields', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)
    
    // Form has required fields, try submitting empty
    fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    
    // Both fields should show native browser validation
    const nameInput = screen.getByPlaceholderText('Name')
    const emailInput = screen.getByPlaceholderText('Email')
    expect(nameInput).toBeRequired()
    expect(emailInput).toBeRequired()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

  it('should validate email format', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Name'), { 
        target: { value: 'Test User' } 
      })
      fireEvent.change(screen.getByPlaceholderText('Email'), { 
        target: { value: 'invalid-email' } 
      })
      fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    })
    
    const error = await screen.findByText('Enter a valid email address')
    expect(error).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should submit form with valid data', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ContactForm onSubmit={onSubmit} />)
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Name'), { 
        target: { value: 'Test User' } 
      })
      fireEvent.change(screen.getByPlaceholderText('Email'), { 
        target: { value: 'test@example.com' } 
      })
      fireEvent.change(screen.getByPlaceholderText('Phone (optional)'), { 
        target: { value: '1234567890' } 
      })
      fireEvent.click(screen.getByRole('button', { name: 'Add' }))
    })
    
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890'
    })
  })
})