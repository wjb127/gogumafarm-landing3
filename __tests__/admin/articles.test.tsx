import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ArticlesManagementPage from '@/app/admin/articles/page'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('ArticlesManagementPage', () => {
  const mockArticles = [
    {
      id: '1',
      title: 'Test Article 1',
      description: 'Test description 1',
      image: '/test-article-1.jpg',
      badges: [{ text: 'SNS', className: 'badge-purple' }],
      published_date: '2025-01-01',
      is_featured: true,
      category: 'Marketing',
    },
    {
      id: '2',
      title: 'Test Article 2',
      description: 'Test description 2',
      image: '/test-article-2.jpg',
      badges: [{ text: '바이럴', className: 'badge-purple' }],
      published_date: '2025-01-02',
      is_featured: false,
      category: 'Content',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    
    const mockSelect = jest.fn().mockReturnValue({
      order: jest.fn().mockResolvedValue({
        data: mockArticles,
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

  it('renders articles management page', async () => {
    render(<ArticlesManagementPage />)
    
    expect(screen.getByText('아티클 관리')).toBeInTheDocument()
    expect(screen.getByText('최신 아티클과 인사이트를 관리합니다')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument()
      expect(screen.getByText('Test Article 2')).toBeInTheDocument()
    })
  })

  it('shows add form when add button is clicked', async () => {
    const user = userEvent.setup()
    render(<ArticlesManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('새 아티클 추가')).toBeInTheDocument()
    })
    
    await user.click(screen.getByText('새 아티클 추가'))
    
    expect(screen.getByText('새 아티클 추가')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('아티클 제목을 입력하세요')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('아티클 설명을 입력하세요')).toBeInTheDocument()
  })

  it('can add new article', async () => {
    const user = userEvent.setup()
    render(<ArticlesManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('새 아티클 추가')).toBeInTheDocument()
    })
    
    await user.click(screen.getByText('새 아티클 추가'))
    
    // Fill form
    await user.type(screen.getByPlaceholderText('아티클 제목을 입력하세요'), 'New Test Article')
    await user.type(screen.getByPlaceholderText('아티클 설명을 입력하세요'), 'New test description')
    await user.type(screen.getByPlaceholderText('/article-image.jpg'), '/new-article.jpg')
    await user.type(screen.getByPlaceholderText('마케팅, SNS, 콘텐츠 등'), 'Test Category')
    await user.type(screen.getByPlaceholderText('SNS, 바이럴, 콘텐츠'), 'Test, Badge')
    
    // Submit
    await user.click(screen.getByText('저장'))
    
    expect(mockSupabase.from).toHaveBeenCalledWith('kmong_12_articles')
  })

  it('displays featured articles with badge', async () => {
    render(<ArticlesManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Featured')).toBeInTheDocument()
    })
  })

  it('can delete article with confirmation', async () => {
    const user = userEvent.setup()
    window.confirm = jest.fn(() => true)
    
    render(<ArticlesManagementPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument()
    })
    
    const deleteButtons = screen.getAllByRole('button')
    const deleteButton = deleteButtons.find(button => 
      button.querySelector('svg')?.getAttribute('class')?.includes('text-red-500')
    )
    
    if (deleteButton) {
      await user.click(deleteButton)
    }
    
    expect(window.confirm).toHaveBeenCalledWith('정말 삭제하시겠습니까?')
    expect(mockSupabase.from).toHaveBeenCalledWith('kmong_12_articles')
  })
})