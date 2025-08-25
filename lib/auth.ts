import { supabase } from './supabase'
import Cookies from 'js-cookie'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gogumafarm_2025!'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24시간

// 간단한 토큰 생성 (crypto 모듈 대신 브라우저 호환 방식)
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const auth = {
  // 로그인
  async login(password: string): Promise<boolean> {
    if (password !== ADMIN_PASSWORD) return false
    
    // 세션 토큰 생성
    const token = generateToken()
    const expiresAt = new Date(Date.now() + SESSION_DURATION)
    
    // Supabase에 세션 저장
    const { error } = await supabase
      .from('kmong_12_admin_sessions')
      .insert({
        token,
        expires_at: expiresAt.toISOString()
      })
    
    if (error) {
      console.error('Session save error:', error)
      return false
    }
    
    // 쿠키에 토큰 저장
    Cookies.set('admin_token', token, { expires: 1 })
    return true
  },
  
  // 세션 확인
  async checkSession(): Promise<boolean> {
    const token = Cookies.get('admin_token')
    if (!token) return false
    
    const { data, error } = await supabase
      .from('kmong_12_admin_sessions')
      .select('*')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single()
    
    return !error && !!data
  },
  
  // 로그아웃
  async logout() {
    const token = Cookies.get('admin_token')
    if (token) {
      await supabase
        .from('kmong_12_admin_sessions')
        .delete()
        .eq('token', token)
    }
    Cookies.remove('admin_token')
  },
  
  // 오래된 세션 정리
  async cleanupSessions() {
    await supabase
      .from('kmong_12_admin_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString())
  }
}