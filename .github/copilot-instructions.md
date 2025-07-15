# CircleUp - Social Media Platform

CircleUp is a full-stack social media platform built with Next.js 15, featuring real-time messaging, posts, stories, and social interactions. The app uses Clerk for authentication, Prisma with MySQL for data persistence, and Socket.IO for real-time features.

## Architecture Overview

- **Frontend**: Next.js 15 with App Router, TailwindCSS, TypeScript
- **Backend**: Next.js API routes with server actions
- **Database**: MySQL with Prisma ORM (custom output: `src/generated/prisma`)
- **Auth**: Clerk with middleware protection
- **Real-time**: Socket.IO for live messaging
- **Media**: Next-Cloudinary for image handling

## Key Patterns & Conventions

### Authentication & Authorization
- Use Clerk's `auth()` in server actions/components
- Protected routes defined in `middleware.ts` with `createRouteMatcher`
- Public routes: `/`, `/sign-in/*`, `/sign-up/*`, `/api/webhooks/clerk`
- Use `@clerk/nextjs/server` for server-side auth, `@clerk/nextjs` for client components

### Database & Server Actions
- Server actions in `src/lib/actions.ts` use `"use server"` directive
- Prisma client singleton in `src/lib/client.ts` with custom path: `@/generated/prisma`
- Always validate with Zod before database operations
- Use `revalidatePath()` after mutations to update cached data
- Handle auth checks: return `{success: false, error: true}` on failure

### Component Structure
- Components organized by feature: `account/`, `feed/`, `leftMenu/`, `rightMenu/`
- Use `"use client"` for interactive components
- Follow responsive patterns: `md:hidden lg:block` for layout switching
- Image handling via Next.js `<Image>` with remote patterns in `next.config.ts`

### Data Model Relationships
Key entities and their relationships:
- **Users**: Central entity with social graph (followers, blocks, relationships)
- **Posts**: User-generated content with likes/comments
- **Stories**: Temporary content with expiration
- **Relationships**: Bidirectional with status enum (NONE, REQUESTED, FOLLOWING, BLOCKED)
- **Likes**: Polymorphic - can target posts or comments

### Development Workflow
```bash
# Development with Turbopack
npm run dev

# Database migrations
npx prisma db push              # Schema changes
npm run backfill               # Sync Clerk users to DB

# Build & deploy
npm run build
npm start
```

### Socket.IO Integration
- Client setup in `src/lib/socket.ts` with SSR guard
- Socket path configured to `/socket`
- Use for real-time features like messaging, notifications

### File Organization
- **Actions**: `src/lib/actions.ts` - all server actions
- **Components**: Feature-based folders under `src/components/`
- **API Routes**: `src/app/api/` following Next.js 15 conventions
- **Auth Routes**: `src/app/(auth)/` route groups
- **Scripts**: User sync tools in `scripts/`

### Common Patterns
- Form handling with `FormData` and server actions
- Image uploads via Cloudinary integration
- Responsive design with mobile-first approach
- Error boundaries with `{success: boolean, error: boolean}` pattern
- Use `revalidatePath()` after mutations for cache invalidation

### Styling & UI
- TailwindCSS with custom CSS variables
- Google Fonts: Inter (sans) & Playfair Display (headings)
- Responsive breakpoints: `md:` `lg:` `xl:` `2xl:`
- Custom icons from `/public/` directory
- Mobile-responsive navigation with `MobileMenu` component