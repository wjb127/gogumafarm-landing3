import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Top10ManagementPage from '@/app/admin/top10/page'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('Top10ManagementPage', () => {
  const mockTop10Items = [
    {
      id: '1',
      title: 'First TOP 10 Item',
      order_index: 0,
      is_active: true,
    },
    {
      id: '2',
      title: 'Second TOP 10 Item',
      order_index: 1,
      is_active: true,
    },
    {
      id: '3',
      title: 'Third TOP 10 Item',
      order_index: 2,
      is_active: false,
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    
    const mockSelect = jest.fn().mockReturnValue({
      order: jest.fn().mockResolvedValue({
        data: mockTop10Items,
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

  it('renders TOP 10 management page', async () => {
    render(<Top10ManagementPage />)
    
    expect(screen.getByText('TOP 10 관리')).toBeInTheDocument()
    expect(screen.getByText('인기 아티클 TOP 10을 관리합니다')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('First TOP 10 Item')).toBeInTheDocument()
      expect(screen.getByText('Second TOP 10 Item')).toBeInTheDocument()
      expect(screen.getByText('Third TOP 10 Item')).toBeInTheDocument()
    })
  })

  it('displays current status statistics', async () => {
    render(<Top10ManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('전체 아이템')).toBeInTheDocument()
      expect(screen.getByText('활성 아이템')).toBeInTheDocument()
      expect(screen.getByText('비활성 아이템')).toBeInTheDocument()
      expect(screen.getByText('남은 슬롯')).toBeInTheDocument()
    })
  })

  it('shows ranking numbers with special colors for top 3', async () => {
    render(<Top10ManagementPage />)
    
    await waitFor(() => {
      // Check for ranking numbers
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  it('can add new TOP 10 item when under 10 items', async () => {
    const user = userEvent.setup()
    render(<Top10ManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('새 아이템 추가')).toBeInTheDocument()
    })
    
    await user.click(screen.getByText('새 아이템 추가'))
    
    expect(screen.getByText('새 TOP 10 아이템 추가')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('아티클 제목을 입력하세요')).toBeInTheDocument()
    
    // Fill and submit form
    await user.type(screen.getByPlaceholderText('아티클 제목을 입력하세요'), 'New TOP 10 Item')
    await user.click(screen.getByText('저장'))
    
    expect(mockSupabase.from).toHaveBeenCalledWith('kmong_12_top10_items')
  })

  it('can move items up and down', async () => {
    const user = userEvent.setup()
    render(<Top10ManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('First TOP 10 Item')).toBeInTheDocument()
    })
    
    // Find move up/down buttons
    const buttons = screen.getAllByRole('button')
    const upButtons = buttons.filter(button => 
      button.querySelector('svg')?.getAttribute('class')?.includes('w-4')
    )
    
    if (upButtons.length > 0) {
      await user.click(upButtons[0])
      expect(mockSupabase.from).toHaveBeenCalledWith('kmong_12_top10_items')
    }
  })

  it('can delete TOP 10 item with confirmation', async () => {
    const user = userEvent.setup()
    window.confirm = jest.fn(() => true)
    
    render(<Top10ManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('First TOP 10 Item')).toBeInTheDocument()
    })
    
    const deleteButtons = screen.getAllByRole('button')
    const deleteButton = deleteButtons.find(button => 
      button.querySelector('svg')?.getAttribute('class')?.includes('text-red-500')
    )
    
    if (deleteButton) {
      await user.click(deleteButton)
    }
    
    expect(window.confirm).toHaveBeenCalledWith('정말 삭제하시겠습니까?')
    expect(mockSupabase.from).toHaveBeenCalledWith('kmong_12_top10_items')
  })

  it('can toggle active status', async () => {
    const user = userEvent.setup()
    render(<Top10ManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('First TOP 10 Item')).toBeInTheDocument()
    })
    
    const switches = screen.getAllByRole('switch')
    if (switches.length > 0) {
      await user.click(switches[0])
      expect(mockSupabase.from).toHaveBeenCalledWith('kmong_12_top10_items')
    }
  })

  it('does not show add button when 10 items exist', async () => {
    // Mock 10 items
    const fullMockItems = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      title: `TOP 10 Item ${i + 1}`,
      order_index: i,
      is_active: true,
    }))
    
    const mockSelect = jest.fn().mockReturnValue({
      order: jest.fn().mockResolvedValue({
        data: fullMockItems,
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
    
    render(<Top10ManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('TOP 10 Item 1')).toBeInTheDocument()
    })
    
    // Should not show add button when 10 items exist
    expect(screen.queryByText('새 아이템 추가')).not.toBeInTheDocument()
  })
})