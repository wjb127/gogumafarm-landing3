# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Korean marketing content website called "고구마팜" (Goguma Farm) built with Next.js 15, featuring a public-facing landing page and a comprehensive admin panel for content management.

## Development Commands

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture & Structure

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)

### Database Schema
All tables use `kmong_12_` prefix:
- `kmong_12_hero_contents`: Main carousel content
- `kmong_12_articles`: Blog articles
- `kmong_12_news_clippings`: News carousel images
- `kmong_12_top10_items`: Top 10 popular articles
- `kmong_12_site_settings`: Global site configuration
- `kmong_12_admin_sessions`: Admin session management (deprecated)
- `kmong_12_activity_logs`: Admin activity tracking

### Key Application Routes

**Public Pages:**
- `/` - Landing page with hero carousel, news slider, articles grid, TOP 10 list

**Admin Pages:**
- `/admin` - Password-protected admin entry (password: `gogumafarm_2025!`)
- `/admin/hero` - Hero carousel CRUD
- `/admin/articles` - Articles management
- `/admin/news` - News clipping management  
- `/admin/top10` - TOP 10 items management
- `/admin/settings` - Site settings configuration

### Authentication
Simple password-based authentication without cookies/sessions. Admin state persists only during the current browser session. Refreshing the page logs out the admin.

### Core Components Structure
- `app/page.tsx` - Main landing page with all public sections
- `app/admin/page.tsx` - Admin authentication and dashboard
- `app/admin/layout.tsx` - Admin panel layout with sidebar navigation
- `lib/supabase.ts` - Supabase client initialization
- `components/ui/*` - shadcn/ui component library

### Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<supabase_service_key>
ADMIN_PASSWORD=gogumafarm_2025!
```

### Key Features
1. **Hero Carousel**: Auto-rotating main content with badges
2. **News Slider**: Horizontal scrolling news images with navigation
3. **Articles Grid**: 6 featured articles with images and badges
4. **TOP 10 List**: Paginated popular articles (1-5, 6-10)
5. **Admin CRUD**: Full create/read/update/delete for all content types
6. **Order Management**: Drag-and-drop ordering for sequential content
7. **Active/Inactive Toggle**: Enable/disable content without deletion

### Database Operations
All admin pages interact directly with Supabase using the client-side SDK. RLS policies allow public read access and authenticated write access to content tables.

### Image Assets
Static images are stored in `/public/` directory. Dynamic images use URL strings stored in the database (can be external URLs or local paths).

### Deployment Notes
- Configured for Vercel deployment (`vercel.json` present)
- Uses Next.js Image optimization
- Responsive design for mobile/tablet/desktop