# Authentication Setup Guide

This admin panel uses Supabase for authentication with JWT tokens and admin-only access control.

## 🔐 Features

- **JWT Token Authentication** - Secure token-based auth
- **Admin-Only Access** - Restricted to specific email addresses
- **Magic Link Support** - Passwordless login option
- **Email/Password Login** - Traditional authentication
- **Protected Routes** - Automatic route protection
- **Session Management** - Persistent login sessions
- **Real-time Auth State** - React context integration

## 🚀 Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be set up (takes ~2 minutes)
3. Go to **Settings > API** in your Supabase dashboard
4. Copy your **Project URL** and **Anon Public Key**

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Configuration - Replace with your actual admin emails
NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS=admin@yourdomain.com,another-admin@yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configure Supabase Auth

In your Supabase dashboard:

1. Go to **Authentication > URL Configuration**
2. Add these URLs to **Redirect URLs**:
   - `http://localhost:3000/api/auth/callback` (development)
   - `https://yourdomain.com/api/auth/callback` (production)

3. Go to **Authentication > Settings**
4. Configure **Auth Settings**:
   - Enable **Email confirmations**: ON
   - **Confirm email**: ON (recommended)
   - **Double confirm email changes**: ON (recommended)

### 4. Set Up Admin Users

#### Option A: Create users manually in Supabase

1. Go to **Authentication > Users** in Supabase dashboard
2. Click **Add user**
3. Enter admin email and temporary password
4. User will receive confirmation email

#### Option B: Use magic links

1. Use the login page `/login`
2. Select "Magic Link" tab
3. Enter admin email (must be in ALLOWED_ADMIN_EMAILS)
4. Check email for login link

### 5. Configure Production

For production deployment, update your environment variables:

```bash
# Production Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS=admin@yourdomain.com,another-admin@yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Add your production domain to Supabase **Redirect URLs**.

### 6. Multi-Domain Supabase Setup (If Using Same Supabase Project)

If you're using the same Supabase project for multiple applications:

#### Configure Multiple Redirect URLs

In Supabase dashboard ➔ **Authentication > URL Configuration**:

```
# Development URLs
http://localhost:3000/api/auth/callback
http://localhost:3001/api/auth/callback

# Production URLs
https://admin.yourdomain.com/api/auth/callback
https://app.yourdomain.com/api/auth/callback
https://yourdomain.com/api/auth/callback
```

#### Admin Panel Specific Configuration

The admin panel uses specific identifiers to avoid conflicts:

- **Storage Key**: `sb-admin-auth-token` (instead of default)
- **Client Info**: `admin-panel@1.0.0` header
- **App URL**: `NEXT_PUBLIC_APP_URL` for forced redirects
- **Local Scope**: Sign out only affects admin panel, not other apps

#### Environment Variables for Multi-Domain

```bash
# Required: Specific to this admin panel
NEXT_PUBLIC_APP_URL=https://admin.yourdomain.com

# Required: Admin emails (SERVER-SIDE ONLY - KEEP SECRET)
ALLOWED_ADMIN_EMAILS=admin@yourdomain.com

# Supabase (shared across apps)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### Preventing Cross-Domain Redirects

The admin panel automatically:

- Forces redirects to `NEXT_PUBLIC_APP_URL`
- Uses local-scope signout (doesn't affect other apps)
- Validates admin permissions on every auth callback
- Stores admin-specific session data separately

## 🔒 Security Features

### Admin Email Validation

- Only emails listed in `ALLOWED_ADMIN_EMAILS` (server-side) can access the admin panel
- Email validation happens exclusively on the server for security
- Admin emails are never exposed to the client-side code
- Non-admin users are automatically signed out

### Protected Routes

- `/dashboard`, `/users`, `/settings` require admin authentication
- Unauthenticated users are redirected to `/login`
- Authenticated non-admins are blocked and signed out

### JWT Token Security

- Automatic token refresh
- Secure cookie storage
- Session persistence across browser restarts
- CSRF protection via Supabase

### Route Protection Middleware

- Server-side route protection
- Automatic redirects for unauthorized access
- Session validation on every request

## 🔧 Usage

### In Components

```tsx
import { useAuth } from '@/lib/auth-context'

function MyComponent() {
  const { user, isAuthenticated, isAdmin, signOut } = useAuth()

  if (!isAuthenticated) {
    return <div>Please log in</div>
  }

  return (
    <div>
      <p>Welcome {user?.email}</p>
      {isAdmin && <p>Admin access granted</p>}
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Direct Auth Functions

```tsx
import { signInWithEmail, signInWithMagicLink, signOut } from '@/lib/auth'

// Email/password login (admin panel specific)
const { data, error } = await signInWithEmail('admin@domain.com', 'password')

// Magic link login (admin panel specific)
const { data, error } = await signInWithMagicLink('admin@domain.com')

// Local sign out (only affects admin panel)
await signOut()
```

### API Routes

```tsx
# Server-side user validation
GET /api/auth/user

# Server-side logout
POST /api/auth/logout

# Admin email validation (server-side only)
POST /api/auth/validate-admin

# Auth callback (automatic)
GET /api/auth/callback?code=...
```

## 📝 File Structure

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client config
│   ├── auth.ts              # Authentication utilities
│   └── auth-context.tsx     # React auth context
├── app/
│   ├── login/page.tsx       # Login page
│   └── api/
│       └── auth/
│           ├── callback/route.ts     # Auth callback API
│           ├── logout/route.ts       # Logout API
│           ├── user/route.ts         # Get user API
│           └── validate-admin/route.ts # Admin validation API
└── middleware.ts            # Route protection middleware
```

## 🐛 Troubleshooting

### "Access denied. Admin privileges required."

- Check that your email is in `ALLOWED_ADMIN_EMAILS` (server-side environment variable)
- Ensure no extra spaces in the environment variable
- Verify the email matches exactly (case-sensitive)
- Make sure you're using `ALLOWED_ADMIN_EMAILS` not `NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS`

### "Missing env.NEXT_PUBLIC_SUPABASE_URL"

- Ensure `.env.local` exists and has correct variables
- Restart the development server after adding environment variables
- Check for typos in variable names

### Magic links not working

- Verify redirect URLs are configured in Supabase
- Check spam folder for magic link emails
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly

### Session not persisting

- Check browser cookies are enabled
- Verify Supabase URL and anon key are correct
- Clear browser storage and try again

### Redirecting to wrong domain/app

- Set `NEXT_PUBLIC_APP_URL` to your admin panel domain
- Verify redirect URLs in Supabase include your admin panel domain
- Check that other apps using same Supabase don't conflict
- Clear browser cache and cookies for all domains

### "Access denied" after successful login

- Verify email is in `ALLOWED_ADMIN_EMAILS` (server-side only)
- Check for extra spaces or case mismatches in admin emails
- Ensure the email exists in your Supabase auth users
- Confirm you're not accidentally using `NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS`

## 🚀 Deployment Checklist

- [ ] Set up production Supabase project (or configure existing one)
- [ ] Configure production environment variables
- [ ] Add admin panel domain to Supabase redirect URLs (`https://admin.yourdomain.com/api/auth/callback`)
- [ ] Set `NEXT_PUBLIC_APP_URL` to admin panel domain
- [ ] Update `ALLOWED_ADMIN_EMAILS` with real admin emails (server-side only)
- [ ] Test login flow in production
- [ ] Verify protected routes are working
- [ ] Test magic link emails in production
- [ ] Verify no conflicts with other apps using same Supabase project
- [ ] Test cross-domain isolation (signout from one app shouldn't affect others)

## 📚 Resources

- [Supabase Authentication Docs](https://supabase.com/docs/guides/auth)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [JWT Token Security](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
