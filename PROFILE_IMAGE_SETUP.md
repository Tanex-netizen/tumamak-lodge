# Default Profile Image Setup

## 📸 Overview
All guests now have a permanent default profile image when they register or log in.

## ✅ What Was Done

### 1. **Profile Image File**
- Source: `/images/profile.jpg`
- Copied to:
  - `/frontend/public/profile.jpg` (customer-facing app)
  - `/admin/public/profile.jpg` (admin panel)

### 2. **Backend Configuration**
- **Updated User Model** (`backend/models/User.js`):
  - Changed default `profileImage` from Cloudinary URL to `/profile.jpg`
  - New users automatically get this default image

### 3. **Database Migration**
- **Created migration script** (`backend/scripts/updateProfileImages.js`):
  - Updates existing users with old default Cloudinary image
  - Migrated 2 existing users successfully
  - Can be run anytime to update user profile images

### 4. **How It Works**
- **New Registrations**: Automatically get `/profile.jpg` as their profile image
- **Existing Users**: Updated via migration script
- **Display**: Works in both frontend and admin panel
  - Navbar shows profile image
  - User management shows profile image
  - Can be changed later by uploading custom image via profile page

## 🎨 Profile Image Usage

### Frontend Display Locations:
1. **Navbar** - Top right corner when logged in
2. **Profile Page** - User's own profile
3. **Reviews** - Next to user's review comments
4. **Bookings** - Associated with booking records

### Admin Panel Display Locations:
1. **Users Management** - User list and detail view
2. **Bookings** - Associated user profile images
3. **Contact Messages** - Registered users' profile images

## 🔄 Changing Profile Image

Users can still upload their own custom profile image:
1. Go to Profile page
2. Click on profile image or upload button
3. Select new image
4. Image uploads to Cloudinary
5. Database updates with new image URL

## 📝 Technical Details

### Default Image Path
```javascript
profileImage: {
  type: String,
  default: '/profile.jpg'
}
```

### Migration Script Usage
```bash
cd backend
node scripts/updateProfileImages.js
```

### File Serving
- Vite serves files from `/public` folder directly
- `/profile.jpg` is accessible at `http://localhost:5173/profile.jpg`
- No additional configuration needed

## ✨ Benefits

1. ✅ **Consistent UX** - All users have a profile image
2. ✅ **Professional Look** - No broken image icons
3. ✅ **Local Hosting** - Faster load times than external CDN
4. ✅ **Customizable** - Users can still upload their own image
5. ✅ **Easy Management** - Single file update affects all new users

---

**Status**: ✅ COMPLETED - All guests now have the permanent default profile image from `/images/profile.jpg`
