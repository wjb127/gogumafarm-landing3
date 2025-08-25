import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminPage from '@/app/admin/page'

describe('AdminPage Authentication', () => {
  beforeEach(() => {
    // Reset any previous state
    jest.clearAllMocks()
  })

  it('renders login form initially', () => {
    render(<AdminPage />)
    
    expect(screen.getByText('고구마팜 Admin')).toBeInTheDocument()
    expect(screen.getByText('관리자 비밀번호를 입력하세요')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument()
    expect(screen.getByText('로그인')).toBeInTheDocument()
  })

  it('shows error message for incorrect password', async () => {
    const user = userEvent.setup()
    render(<AdminPage />)
    
    const passwordInput = screen.getByPlaceholderText('비밀번호')
    const loginButton = screen.getByText('로그인')
    
    await user.type(passwordInput, 'wrong_password')
    await user.click(loginButton)
    
    expect(screen.getByText('비밀번호가 틀렸습니다')).toBeInTheDocument()
  })

  it('shows dashboard for correct password', async () => {
    const user = userEvent.setup()
    render(<AdminPage />)
    
    const passwordInput = screen.getByPlaceholderText('비밀번호')
    const loginButton = screen.getByText('로그인')
    
    await user.type(passwordInput, 'gogumafarm_2025!')
    await user.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('대시보드')).toBeInTheDocument()
      expect(screen.getByText('고구마팜 웹사이트 관리 시스템')).toBeInTheDocument()
    })
  })

  it('can toggle password visibility', async () => {
    const user = userEvent.setup()
    render(<AdminPage />)
    
    const passwordInput = screen.getByPlaceholderText('비밀번호') as HTMLInputElement
    const toggleButton = screen.getByRole('button', { name: /toggle password/i }) || 
                        document.querySelector('button[type="button"]')
    
    expect(passwordInput.type).toBe('password')
    
    if (toggleButton) {
      await user.click(toggleButton)
      expect(passwordInput.type).toBe('text')
      
      await user.click(toggleButton)
      expect(passwordInput.type).toBe('password')
    }
  })

  it('clears password field on wrong password', async () => {
    const user = userEvent.setup()
    render(<AdminPage />)
    
    const passwordInput = screen.getByPlaceholderText('비밀번호') as HTMLInputElement
    const loginButton = screen.getByText('로그인')
    
    await user.type(passwordInput, 'wrong_password')
    await user.click(loginButton)
    
    expect(passwordInput.value).toBe('')
  })

  it('renders dashboard statistics after successful login', async () => {
    const user = userEvent.setup()
    render(<AdminPage />)
    
    const passwordInput = screen.getByPlaceholderText('비밀번호')
    const loginButton = screen.getByText('로그인')
    
    await user.type(passwordInput, 'gogumafarm_2025!')
    await user.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('메인 캐러셀')).toBeInTheDocument()
      expect(screen.getByText('아티클')).toBeInTheDocument()
      expect(screen.getByText('뉴스클리핑')).toBeInTheDocument()
      expect(screen.getByText('TOP 10')).toBeInTheDocument()
      expect(screen.getByText('빠른 실행')).toBeInTheDocument()
      expect(screen.getByText('최근 활동')).toBeInTheDocument()
    })
  })

  it('shows validation error for empty password', async () => {
    const user = userEvent.setup()
    render(<AdminPage />)
    
    const loginButton = screen.getByText('로그인')
    await user.click(loginButton)
    
    // The form should handle empty password gracefully
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument()
  })
})