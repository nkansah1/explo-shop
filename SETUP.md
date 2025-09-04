# 🚀 EliteStore Setup Guide

## Prerequisites
- Node.js (v18+)
- pnpm package manager
- Supabase account

## 🔧 Quick Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set up Supabase
1. Go to [Supabase](https://app.supabase.com)
2. Create a new project
3. Wait for the project to be ready
4. Go to Settings > API
5. Copy your Project URL and anon/public key

### 3. Configure Environment Variables
1. Open `.env.local` file
2. Replace the placeholder values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### 4. Set up Database
1. In your Supabase dashboard, go to SQL Editor
2. Run the scripts in order:
   - First: `scripts/01_create_tables.sql`
   - Second: `scripts/02_enable_rls.sql`
   - Third: `scripts/03_seed_data.sql`

### 5. Configure Authentication (Important!)
1. In Supabase dashboard, go to Authentication > Settings
2. Set these options:
   - **Enable email confirmations**: You can disable this for development
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: Add `http://localhost:3000` to allowed redirects

### 6. Start Development Server
```bash
pnpm dev
```

## 🐛 Troubleshooting Sign-up Issues

### Common Issues:

1. **"Configuration Error"**: 
   - Check that your environment variables are set correctly
   - Make sure you're not using placeholder values

2. **"Email confirmation required"**:
   - Check your email for confirmation link, OR
   - Disable email confirmations in Supabase Auth settings

3. **"Registration failed"**:
   - Check browser console for detailed error messages
   - Ensure database triggers are properly set up
   - Verify RLS policies are applied

### Debug Steps:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try signing up again
4. Look for detailed error messages

### Email Confirmation Setup:
If you want to disable email confirmation for development:
1. Go to Supabase > Authentication > Settings
2. Uncheck "Enable email confirmations"
3. Users will be automatically confirmed

## 📧 Need Help?
- Check the console for detailed error messages
- Verify all SQL scripts ran successfully
- Ensure environment variables are correctly set
- Make sure Supabase project is active and running