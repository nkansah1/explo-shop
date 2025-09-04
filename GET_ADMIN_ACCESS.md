# How to Get Admin Access

## Quick Method (Recommended)

### 🚀 **One-Click Admin Promotion**

1. **Navigate to Admin Promotion Page**
   - Go to: `http://localhost:3000/promote-admin`
   - OR click "Get Admin Access" in your account page
   - OR use the mobile menu link "Get Admin Access"

2. **Log In (if not already)**
   - If you're not logged in, you'll see login/register options
   - Create an account or log in with existing credentials

3. **Click "Make Me Admin"**
   - Simple one-click promotion to admin status
   - You'll be automatically redirected to the admin panel

### 🎯 **Access Points**
- **Direct URL**: `/promote-admin`
- **Account Page**: Button in Quick Actions section
- **Mobile Menu**: "Get Admin Access" link (for non-admin users)

## What You Get

### 🔑 **Admin Features**
After promotion, you'll have access to:
- **Dashboard**: `/admin` - Overview and analytics
- **Product Management**: Add, edit, delete products
- **Order Management**: Process and track orders
- **Customer Management**: View and manage users
- **Settings**: Store configuration
- **Analytics**: Detailed reports and metrics

### 🌟 **Navigation Changes**
- Admin icon appears in header (desktop)
- "Admin Dashboard" link in mobile menu
- "Admin Panel" button in account page
- Direct access to `/admin` routes

## Alternative Methods

### 📧 **By Email Search**
1. Go to `/admin/user-roles` (after becoming admin)
2. Search for users by email
3. Promote other users to admin

### 🛠 **Manual Database Update**
If needed, you can manually update the role in your database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Security Notes

- In production, implement proper role verification
- Consider adding approval workflows for admin promotion
- Monitor admin access and activities
- Regular audit of admin users

## Troubleshooting

### ❌ **"Please Log In" Message**
- Make sure you're logged in first
- Create an account if you don't have one

### ❌ **Admin Panel Not Accessible**
- Clear browser cache
- Refresh the page after promotion
- Check that role was updated in user profile

### ❌ **Admin Features Not Showing**
- Logout and login again
- Hard refresh the page (Ctrl+F5)
- Check browser developer tools for errors

## Contact

For technical support or issues with admin access, please contact the development team.