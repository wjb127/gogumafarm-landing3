import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // /admin 경로 보호
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')
    
    // 로그인 페이지는 제외
    if (request.nextUrl.pathname === '/admin/login') {
      // 이미 로그인한 경우 대시보드로 리다이렉트
      if (token) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      return NextResponse.next()
    }
    
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}