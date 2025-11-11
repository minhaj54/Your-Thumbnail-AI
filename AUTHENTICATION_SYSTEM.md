# 🔐 Authentication System Documentation

This document explains the comprehensive authentication system implemented in YourThumbnailAI.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Protected Routes](#protected-routes)
4. [Components](#components)
5. [API Protection](#api-protection)
6. [Best Practices](#best-practices)

---

## 🎯 Overview

The application uses a **multi-layer authentication system** combining:
- **Server-side middleware** for route protection
- **Client-side AuthGuard** component for React-level protection
- **API route authentication** for backend security
- **Supabase Auth** for user management

### Key Features

✅ **Automatic redirects** to sign-in page for unauthenticated users  
✅ **Return URL handling** - users are redirected back after sign-in  
✅ **Loading states** - smooth UX during authentication checks  
✅ **Persistent sessions** - stays logged in across page reloads  
✅ **Secure API calls** - all API routes verify authentication  
✅ **Real-time auth state** - immediate updates on login/logout  

---

## 🔄 Authentication Flow

### 1. User Accesses Protected Route

```
User visits /dashboard
   ↓
Middleware checks auth (server-side)
   ↓
Not authenticated?
   → Redirect to /auth/signin?redirectTo=/dashboard
   ↓
Authenticated?
   → Page loads
   ↓
AuthGuard checks auth (client-side)
   ↓
Still authenticated?
   → Render page content
```

### 2. Sign In Process

```
User submits sign-in form
   ↓
AuthContext.signIn() called
   ↓
Supabase Auth API
   ↓
Success?
   → Session stored in cookies
   → Auth state updated globally
   → Redirect to returnTo URL (or /dashboard)
```

### 3. Session Management

- **Sessions stored** in HTTP-only cookies (secure)
- **Auto-refresh** tokens before expiration
- **Real-time sync** across tabs
- **Logout** clears all session data

---

## 🛡️ Protected Routes

### Public Routes (No Auth Required)

- `/` - Home page
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy
- `/demo` - Demo page
- `/auth/signin` - Sign in
- `/auth/signup` - Sign up
- `/auth/forgot-password` - Password reset

### Protected Routes (Auth Required)

All other routes require authentication:

- `/dashboard` - User dashboard
- `/generate` - Thumbnail generation
- `/gallery` - User's generated images
- `/profile` - User profile settings
- `/prompt-library` - Prompt templates
- `/pricing` - Pricing plans (shows personalized content)

---

## 🧩 Components

### 1. Middleware (`src/middleware.ts`)

**Purpose**: Server-side route protection at the edge

```typescript
// Automatically redirects unauthenticated users
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if route is public
  const publicRoutes = ['/', '/auth/*', '/terms', '/privacy', '/demo']
  
  // If not public, verify authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    // Redirect with return URL
    return NextResponse.redirect(
      `/auth/signin?redirectTo=${pathname}`
    )
  }
  
  return NextResponse.next()
}
```

**Features**:
- ✅ Runs before page renders (fast redirects)
- ✅ Handles server-side session validation
- ✅ Preserves intended destination URL
- ✅ Skips API routes and static assets

---

### 2. AuthGuard Component (`src/components/AuthGuard.tsx`)

**Purpose**: Client-side route protection in React

```typescript
export function AuthGuard({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (!user) {
    router.push(`/auth/signin?redirectTo=${pathname}`)
    return null
  }
  
  return <>{children}</>
}
```

**Usage**:
```tsx
// Wrap protected pages
export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>Protected content here</div>
    </AuthGuard>
  )
}
```

**Features**:
- ✅ Shows loading state during auth check
- ✅ Prevents flash of protected content
- ✅ Handles client-side redirects
- ✅ Reusable across all pages

---

### 3. AuthContext (`src/contexts/AuthContext.tsx`)

**Purpose**: Global authentication state management

```typescript
const { user, session, loading, signIn, signOut, signUp } = useAuth()
```

**Provides**:
- `user` - Current user object (or null)
- `session` - Current session object
- `loading` - Boolean indicating auth check in progress
- `signIn()` - Function to sign in user
- `signOut()` - Function to sign out user
- `signUp()` - Function to register new user

**Features**:
- ✅ Real-time auth state updates
- ✅ Automatic session refresh
- ✅ Cross-tab synchronization
- ✅ Persistent sessions

---

### 4. Auth Helper Functions (`src/lib/auth-helpers.ts`)

**Purpose**: Reusable authentication utilities for API routes

```typescript
// Protect API routes
export async function requireAuth(request: NextRequest) {
  const { user, error } = await getUser()
  
  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }
  
  return { user, error: null }
}
```

**Usage in API Routes**:
```typescript
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request)
  if (error) return error
  
  // Continue with authenticated logic
  // user.id is available
}
```

---

## 🔒 API Protection

### Protected API Routes

All API routes verify authentication:

```
src/app/api/
├── generate/image/route.ts           ✅ Protected
├── images/list/route.ts              ✅ Protected
├── user/profile/route.ts             ✅ Protected
├── payments/history/route.ts         ✅ Protected
├── subscriptions/history/route.ts    ✅ Protected
├── analyze-thumbnail/route.ts        ✅ Protected
└── extract-prompt/route.ts           ✅ Protected
```

### Example Implementation

```typescript
export async function GET(request: NextRequest) {
  // Check authentication
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Proceed with authenticated logic
  // Access user.id for database queries
}
```

---

## ✅ Best Practices

### 1. Always Use AuthGuard on Protected Pages

```tsx
// ✅ Good
export default function ProtectedPage() {
  return (
    <AuthGuard>
      <YourContent />
    </AuthGuard>
  )
}

// ❌ Bad - No protection
export default function ProtectedPage() {
  return <YourContent />
}
```

### 2. Check Auth in API Routes

```typescript
// ✅ Good
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request)
  if (error) return error
  
  // Safe to use user.id
}

// ❌ Bad - No auth check
export async function POST(request: NextRequest) {
  // Vulnerable - anyone can call this
}
```

### 3. Handle Loading States

```tsx
// ✅ Good
const { user, loading } = useAuth()

if (loading) return <LoadingSpinner />
if (!user) return <SignInPrompt />

// ❌ Bad - No loading state
const { user } = useAuth()
// User might be null while checking...
```

### 4. Use Redirect URLs

```tsx
// ✅ Good - Preserves destination
router.push(`/auth/signin?redirectTo=${pathname}`)

// ❌ Bad - User loses destination
router.push('/auth/signin')
```

### 5. Verify User Ownership

```typescript
// ✅ Good - Check ownership
const { data } = await supabase
  .from('images')
  .select()
  .eq('user_id', user.id)  // Only user's own data

// ❌ Bad - No ownership check
const { data } = await supabase
  .from('images')
  .select()
// Exposes all users' data
```

---

## 🔧 Testing Authentication

### Manual Testing Checklist

- [ ] Visit protected route while logged out → redirects to sign-in
- [ ] Sign in → redirects back to intended page
- [ ] Refresh page while logged in → stays logged in
- [ ] Sign out → clears session and redirects
- [ ] Try accessing API endpoint without auth → returns 401
- [ ] Open two tabs → auth syncs across both
- [ ] Close tab and reopen → session persists

### Common Issues & Solutions

**Issue**: User stuck in redirect loop  
**Solution**: Clear cookies and localStorage, check middleware config

**Issue**: Session expires unexpectedly  
**Solution**: Check Supabase session timeout settings

**Issue**: Auth state not updating  
**Solution**: Verify onAuthStateChange listener is set up

---

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [React Context API](https://react.dev/reference/react/useContext)

---

**Last Updated**: November 11, 2025  
**Maintained by**: YourThumbnailAI Development Team

