# 🚨 Production Deployment Troubleshooting Guide

## Issue: Sign up and Login Not Working on Vercel

### Quick Diagnosis Steps:

1. **Visit your deployed site**: https://explo-shop.vercel.app/
2. **Look for the debug panel** in the bottom-right corner
3. **Check what the debug panel shows** about your configuration

---

## 🔧 Most Common Fixes:

### **Fix 1: Add Environment Variables to Vercel**

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/dashboard
   → Select "explo-shop" project
   → Settings → Environment Variables
   ```

2. **Add these variables:**
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://your-project-ref.supabase.co
   
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY  
   Value: your-actual-anon-key-here
   ```

3. **Important:** Make sure to add them for **ALL environments** (Production, Preview, Development)

4. **Redeploy:** Go to Deployments tab and click "Redeploy" on the latest deployment

### **Fix 2: Configure Supabase for Production Domain**

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   → Select your project
   → Authentication → URL Configuration
   ```

2. **Update Site URL:**
   ```
   Site URL: https://explo-shop.vercel.app
   ```

3. **Add Redirect URLs:**
   ```
   https://explo-shop.vercel.app/**
   https://explo-shop.vercel.app/auth/callback
   ```

### **Fix 3: Disable Email Confirmation (Temporary)**

For testing purposes, you can temporarily disable email confirmation:

1. **In Supabase Dashboard:**
   ```
   Authentication → Settings → User Signups
   → Uncheck "Enable email confirmations"
   ```

2. **This allows immediate login** without email verification

---

## 🧪 Testing Steps:

### **After applying fixes:**

1. **Wait 2-3 minutes** for Vercel deployment to complete
2. **Clear browser cache** or use incognito mode
3. **Visit the registration page**: https://explo-shop.vercel.app/register
4. **Try creating a new account**
5. **Check the debug panel** - should show green checkmarks

### **If still not working:**

1. **Open browser developer tools** (F12)
2. **Go to Console tab**
3. **Try to register/login** and look for error messages
4. **Check Network tab** for failed requests

---

## 🔍 Debug Information:

The debug panel on your site will show:
- ✅ **Green**: Configuration is correct
- ⚠️ **Yellow**: Configuration issues detected  
- ❌ **Red**: Missing or invalid configuration

### **Common Error Messages:**

| Error | Solution |
|-------|----------|
| "Configuration Error" | Environment variables not set in Vercel |
| "Invalid email" | Supabase project URL is wrong |
| "Network Error" | Supabase anon key is incorrect |
| "Email confirmation required" | Need to verify email or disable confirmation |

---

## 📝 Checklist:

- [ ] Environment variables added to Vercel
- [ ] Vercel project redeployed after adding variables
- [ ] Supabase Site URL updated to production domain
- [ ] Supabase redirect URLs include production domain  
- [ ] Email confirmation settings configured
- [ ] Browser cache cleared for testing
- [ ] Debug panel shows green checkmarks

---

## 🆘 Still Not Working?

1. **Share the debug panel screenshot** - what does it show?
2. **Check browser console errors** - any red error messages?
3. **Verify Supabase project is active** - not paused or deleted
4. **Double-check environment variable values** - copy-paste correctly

### **Quick Test Command:**

Open browser console on your site and run:
```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Has Supabase Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

This will help confirm if environment variables are loading correctly.

---

## 📞 Get Help:

If none of these steps work:
1. Take a screenshot of the debug panel
2. Share any console error messages  
3. Confirm which steps you've completed

The debug panel I added will help identify exactly what's misconfigured!