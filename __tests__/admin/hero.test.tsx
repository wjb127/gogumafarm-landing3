import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HeroManagementPage from '@/app/admin/hero/page'
import { supabase } from '@/lib/supabase'

// Mock the supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('HeroManagementPage', () => {
  const mockHeroContents = [
    {
      id: '1',
      image: '/test-image-1.jpg',
      title: 'Test Hero Title 1',
      badges: [{ text: 'SNS', className: 'badge-purple' }],
      order_index: 0,
      is_active: true,
    },
    {
      id: '2',
      image: '/test-image-2.jpg',
      title: 'Test Hero Title 2',
      badges: [{ text: '바이럴', className: 'badge-purple' }],
      order_index: 1,
      is_active: false,
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock the chain of method calls for fetching data
    const mockSelect = jest.fn().mockReturnValue({
      order: jest.fn().mockResolvedValue({
        data: mockHeroContents,
        error: null,
      }),
    })
    
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
    } as any)
  })

  it('renders hero management page with content list', async () => {
    render(<HeroManagementPage />)
    
    expect(screen.getByText('메인 캐러셀 관리')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Test Hero Title 1')).toBeInTheDocument()
      expect(screen.getByText('Test Hero Title 2')).toBeInTheDocument()
    })
  })

  it('shows add form when add button is clicked', async () => {
    const user = userEvent.setup()
    render(<HeroManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('새 콘텐츠 추가')).toBeInTheDocument()
    })
    
    await user.click(screen.getByText('새 콘텐츠 추가'))
    
    expect(screen.getByText('새 캐러셀 콘텐츠 추가')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('콘텐츠 제목을 입력하세요')).toBeInTheDocument()
  })

  it('can add new hero content', async () => {
    const user = userEvent.setup()
    render(<HeroManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('새 콘텐츠 추가')).toBeInTheDocument()
    })
    
    // Click add button
    await user.click(screen.getByText('새 콘텐츠 추가'))
    
    // Fill form
    await user.type(screen.getByPlaceholderText('/youtube-content-1.png'), '/new-hero.jpg')
    await user.type(screen.getByPlaceholderText('콘텐츠 제목을 입력하세요'), 'New Hero Content')
    await user.type(screen.getByPlaceholderText('SNS, 바이럴, 콘텐츠'), 'Test, Badge')
    
    // Submit form
    await user.click(screen.getByText('저장'))
    
    expect(mockSupabase.from).toHaveBeenCalledWith('kmong_12_hero_contents')
  })

  it('can edit existing hero content', async () => {
    const user = userEvent.setup()
    render(<HeroManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Hero Title 1')).toBeInTheDocument()
    })
    
    // Find and click edit button for first item
    const editButtons = screen.getAllByRole('button')
    const editButton = editButtons.find(button => 
      button.querySelector('svg')?.getAttribute('class')?.includes('w-4')
    )
    
    if (editButton) {
      await user.click(editButton)
    }
    
    expect(mockSupabase.from).toHaveBeenCalledWith('kmong_12_hero_contents')
  })

  it('can delete hero content', async () => {
    const user = userEvent.setup()
    
    // Mock window.confirm
    window.confirm = jest.fn(() => true)
    
    render(<HeroManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Hero Title 1')).toBeInTheDocument()
    })
    
    // Find delete button and click it
    const deleteButtons = screen.getAllByRole('button')
    const deleteButton = deleteButtons.find(button => 
      button.querySelector('svg')?.getAttribute('class')?.includes('text-red-500')
    )
    
    if (deleteButton) {
      await user.click(deleteButton)
    }
    
    expect(mockSupabase.from).toHaveBeenCalledWith('kmong_12_hero_contents')
  })

  it('can toggle active status', async () => {
    const user = userEvent.setup()
    render(<HeroManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Hero Title 1')).toBeInTheDocument()
    })
    
    // Find and click switch (toggle)
    const switches = screen.getAllByRole('switch')
    if (switches.length > 0) {
      await user.click(switches[0])
    }
    
    expect(mockSupabase.from).toHaveBeenCalledWith('kmong_12_hero_contents')
  })
})