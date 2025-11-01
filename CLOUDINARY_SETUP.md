# Cloudinary Resume Upload Setup

## ✅ Installation Complete

The following packages have been installed:
- `multer` - File upload middleware
- `cloudinary` - Cloud storage service
- `streamifier` - Stream utility for buffer uploads
- `@types/multer` & `@types/streamifier` - TypeScript types

## 📝 Environment Variables Required

Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get your credentials from: https://cloudinary.com/console

## 🎯 What Was Added

### 1. Configuration Files
- **`src/config/cloudinary.ts`** - Cloudinary SDK configuration
- **`src/@types/config.ts`** - Added CloudinaryConfig type
- **`src/config/env.ts`** - Added CLOUDINARY config section

### 2. Middleware
- **`src/middlewares/upload.middleware.ts`**
  - `uploadResume` - For PDF, DOC, DOCX files (5MB limit)
  - `uploadImage` - For JPEG, PNG, WebP images (2MB limit)

### 3. Service Layer
- **`src/services/cloudinary.service.ts`**
  - `uploadResume()` - Upload resume to `resumes/{userId}` folder
  - `uploadImage()` - Upload images to specified folder
  - `deleteFile()` - Delete files from Cloudinary
  - `uploadFile()` - Generic file upload method

### 4. Updated Files
- **`src/modules/talentSeeker/talentSeeker.service.ts`**
  - Updated `createOrUpdateProfile()` to accept resume file
  - Automatically uploads to Cloudinary
  - Deletes old resume when updating

- **`src/modules/talentSeeker/talentSeeker.controller.ts`**
  - Passes `req.file` to service

- **`src/modules/talentSeeker/talentSeeker.route.ts`**
  - Added `uploadResume.single("resume")` middleware to POST and PUT routes

## 🚀 Usage

### Frontend - Upload Resume

Send a `multipart/form-data` request with the resume file:

```javascript
const formData = new FormData();
formData.append('resume', resumeFile); // The file from input
formData.append('title', 'Software Engineer');
formData.append('bio', 'Experienced developer...');
formData.append('skills', JSON.stringify(['JavaScript', 'TypeScript']));
// ... other fields

fetch('/api/talent-seeker/profile', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### API Endpoints

#### Create/Update Profile with Resume
```
POST /api/talent-seeker/profile
PUT /api/talent-seeker/profile

Headers:
  Authorization: Bearer {token}
  Content-Type: multipart/form-data

Body (form-data):
  resume: [file] (optional)
  title: string
  bio: string
  skills: array
  ... other profile fields
```

### File Constraints

**Resume Upload:**
- Accepted formats: PDF, DOC, DOCX
- Max size: 5MB
- Storage: `resumes/{userId}/{filename}`

**Image Upload:**
- Accepted formats: JPEG, JPG, PNG, WebP
- Max size: 2MB

## 🔧 How It Works

1. **Client** sends multipart/form-data with resume file
2. **Multer** middleware intercepts and validates file (type, size)
3. **File** is stored in memory as buffer (`req.file.buffer`)
4. **Service** receives the file and uploads to Cloudinary
5. **Cloudinary** returns secure URL
6. **Database** stores the URL in `resume` field
7. **Old resume** is deleted from Cloudinary (if updating)

## 📦 File Structure

```
src/
├── config/
│   ├── cloudinary.ts          # Cloudinary SDK config
│   └── env.ts                 # Added CLOUDINARY env vars
├── middlewares/
│   └── upload.middleware.ts   # Multer config (uploadResume, uploadImage)
├── services/
│   └── cloudinary.service.ts  # Upload/delete utilities
└── modules/
    └── talentSeeker/
        ├── talentSeeker.service.ts    # Updated with file handling
        ├── talentSeeker.controller.ts # Passes req.file
        └── talentSeeker.route.ts      # Added multer middleware
```

## 🎨 Example: Upload Avatar Image

You can use the same pattern for avatar uploads:

```typescript
// In routes
import { uploadImage } from "middlewares/upload.middleware";

router.post(
  "/avatar",
  verifyJWT,
  uploadImage.single("avatar"),
  UserController.uploadAvatar
);

// In service
const avatarUrl = await CloudinaryService.uploadImage(
  file.buffer,
  "avatars",
  userId
);
```

## 🔐 Security Notes

- Files are validated before upload (type, size)
- Cloudinary credentials are stored in environment variables
- Old files are automatically cleaned up when updating
- Memory storage is used (no temp files on disk)

## ✨ Features

✅ Automatic file validation
✅ Cloud storage with Cloudinary
✅ Secure URL generation
✅ Old file cleanup
✅ TypeScript support
✅ Error handling
✅ Multiple file type support (resumes, images)
