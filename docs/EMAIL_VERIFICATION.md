# Email Verification Setup Guide

This guide explains how to configure email verification in your Supabase project for the ecommerce website.

## Supabase Configuration

### 1. Enable Email Confirmation

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Settings**
3. Under **User Signups**, ensure "Enable email confirmations" is **enabled**
4. Set the **Site URL** to your domain (e.g., `http://localhost:3000` for development)

### 2. Configure Email Templates (Optional)

1. Navigate to **Authentication** > **Email Templates**
2. Customize the "Confirm signup" email template if desired
3. The verification link will redirect to `/auth/callback` in your application

### 3. URL Configuration

Ensure your redirect URLs are configured:
- **Site URL**: `http://localhost:3000` (development) or your production domain
- **Redirect URLs**: Add `http://localhost:3000/auth/callback` for development

## Application Flow

### Registration Process
1. User fills out registration form
2. System calls Supabase `signUp()` with email verification enabled
3. If verification is required:
   - User is redirected to `/verify-email?email={email}`
   - Verification email is sent to user's inbox
4. If no verification needed, user is redirected to login

### Email Verification Process
1. User clicks verification link in email
2. Link redirects to `/auth/callback` with verification code
3. Application exchanges code for session
4. User is redirected to login with success message

### Key Features
- ✅ Email verification required for new signups
- ✅ Resend verification email functionality
- ✅ Clear user feedback and instructions
- ✅ Proper error handling for failed verifications
- ✅ Success messaging after verification

## Environment Variables

Ensure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Testing

1. Register a new account with a valid email
2. Check that you're redirected to the verification page
3. Check your email for the verification link
4. Click the verification link and confirm you're redirected back with success message
5. Test the resend email functionality
6. Verify that unverified users cannot log in

## Troubleshooting

- **No verification email received**: Check spam folder, verify SMTP settings in Supabase
- **Verification link broken**: Ensure redirect URLs are properly configured
- **"Invalid verification code"**: Check that the email link hasn't expired (default: 1 hour)

## Related Files

- `/app/register/page.tsx` - Registration form with email verification flow
- `/app/verify-email/page.tsx` - Email verification instruction page
- `/app/auth/callback/page.tsx` - Handles email verification callback
- `/hooks/use-auth.ts` - Authentication logic with email verification support
- `/app/login/page.tsx` - Login form with verification success message