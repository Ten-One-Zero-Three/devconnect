import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

beforeEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('Login page', () => {
  it('renders login form by default', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()
  })

  it('switches to Sign Up tab', () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
  })

  it('toggles password visibility', () => {
    renderLogin()
    const passwordInput = screen.getByPlaceholderText('password')
    expect(passwordInput).toHaveAttribute('type', 'password')

    fireEvent.click(screen.getByText('👁️'))
    expect(passwordInput).toHaveAttribute('type', 'text')

    fireEvent.click(screen.getByText('🙈'))
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('shows error on failed login', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid email or password' })
    })

    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'bad@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

    await waitFor(() =>
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    )
  })

  it('saves token to localStorage on successful login', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'abc123', user: { id: 1, email: 'an@test.com' } })
    })

    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'an@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

    await waitFor(() =>
      expect(localStorage.getItem('token')).toBe('abc123')
    )
  })

  it('switches to login tab after successful signup', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Account created. Please log in.' })
    })

    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'new@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()
    )
  })

  it('shows error when server is unreachable', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))

    renderLogin()
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'an@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

    await waitFor(() =>
      expect(screen.getByText('Could not connect to server')).toBeInTheDocument()
    )
  })
})
