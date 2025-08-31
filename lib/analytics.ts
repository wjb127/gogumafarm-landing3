import { supabase } from './supabase'

// 방문자 ID 생성/가져오기 (localStorage 사용)
export function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  
  let visitorId = localStorage.getItem('visitor_id')
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('visitor_id', visitorId)
  }
  return visitorId
}

// 세션 ID 생성/가져오기 (sessionStorage 사용)
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

// 페이지 조회 기록
export async function trackPageView(
  pageType: 'home' | 'article' | 'tag' | 'admin',
  pageId?: string
) {
  try {
    const visitorId = getVisitorId()
    const sessionId = getSessionId()
    
    // 페이지 조회 기록
    const { error } = await supabase
      .from('kmong_12_page_views')
      .insert({
        page_type: pageType,
        page_id: pageId,
        visitor_id: visitorId,
        session_id: sessionId,
        user_agent: navigator.userAgent,
        referrer: document.referrer
      })
    
    if (error) {
      console.error('Error tracking page view:', error)
    }
    
    // 활성 방문자 업데이트
    await updateActiveVisitor(pageType, pageId)
  } catch (error) {
    console.error('Error in trackPageView:', error)
  }
}

// 활성 방문자 업데이트
async function updateActiveVisitor(pageType: string, pageId?: string) {
  try {
    const visitorId = getVisitorId()
    
    const { error } = await supabase
      .from('kmong_12_active_visitors')
      .upsert({
        visitor_id: visitorId,
        page_type: pageType,
        page_id: pageId,
        last_activity: new Date().toISOString(),
        user_agent: navigator.userAgent
      }, {
        onConflict: 'visitor_id'
      })
    
    if (error) {
      console.error('Error updating active visitor:', error)
    }
  } catch (error) {
    console.error('Error in updateActiveVisitor:', error)
  }
}

// 아티클 조회수 증가
export async function incrementArticleView(articleId: string) {
  try {
    // trackPageView가 트리거를 통해 자동으로 처리하므로
    // 여기서는 페이지뷰만 기록
    await trackPageView('article', articleId)
  } catch (error) {
    console.error('Error incrementing article view:', error)
  }
}

// 태그 조회수 증가
export async function incrementTagView(tagName: string) {
  try {
    await trackPageView('tag', tagName)
    
    // 태그 통계 업데이트
    const { error } = await supabase
      .from('kmong_12_tag_stats')
      .upsert({
        tag_name: tagName,
        view_count: 1,
        last_viewed_at: new Date().toISOString()
      }, {
        onConflict: 'tag_name'
      })
    
    if (!error) {
      // 조회수 증가
      await supabase
        .from('kmong_12_tag_stats')
        .update({ 
          view_count: supabase.sql`view_count + 1`,
          last_viewed_at: new Date().toISOString()
        })
        .eq('tag_name', tagName)
    }
  } catch (error) {
    console.error('Error incrementing tag view:', error)
  }
}

// 방문자 통계 가져오기
export async function getVisitorStats() {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    // 오늘의 통계
    const { data: todayStats } = await supabase
      .from('kmong_12_daily_stats')
      .select('*')
      .eq('date', today)
      .single()
    
    // 활성 방문자 수 (최근 5분)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { count: activeVisitors } = await supabase
      .from('kmong_12_active_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('last_activity', fiveMinutesAgo)
    
    // 전체 조회수
    const { count: totalViews } = await supabase
      .from('kmong_12_page_views')
      .select('*', { count: 'exact', head: true })
    
    // 오늘 조회수
    const { count: todayViews } = await supabase
      .from('kmong_12_page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`)
    
    return {
      activeVisitors: activeVisitors || 0,
      totalViews: totalViews || 0,
      todayViews: todayViews || 0,
      todayUniqueVisitors: todayStats?.unique_visitors || 0
    }
  } catch (error) {
    console.error('Error getting visitor stats:', error)
    return {
      activeVisitors: 0,
      totalViews: 0,
      todayViews: 0,
      todayUniqueVisitors: 0
    }
  }
}

// 인기 아티클 가져오기
export async function getPopularArticles(limit = 10) {
  try {
    const { data } = await supabase
      .from('kmong_12_articles')
      .select('*, kmong_12_article_stats(view_count)')
      .eq('is_active', true)
      .order('view_count', { ascending: false })
      .limit(limit)
    
    return data || []
  } catch (error) {
    console.error('Error getting popular articles:', error)
    return []
  }
}

// 인기 태그 가져오기
export async function getPopularTags(limit = 10) {
  try {
    const { data } = await supabase
      .from('kmong_12_tag_stats')
      .select('*')
      .order('view_count', { ascending: false })
      .limit(limit)
    
    return data || []
  } catch (error) {
    console.error('Error getting popular tags:', error)
    return []
  }
}