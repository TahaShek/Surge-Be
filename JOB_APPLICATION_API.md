# Job Application Endpoint

## ✅ Endpoint Complete

**POST** `/api/jobs/:jobId/apply`

Apply to a job posting with optional resume upload.

## 🔐 Authentication Required

This endpoint requires authentication (JWT token in headers).

## 📋 Request

### Headers
```
Authorization: Bearer {your_jwt_token}
Content-Type: multipart/form-data
```

### URL Parameters
- `jobId` (string, required) - The ID of the job to apply to

### Body (multipart/form-data)
- `resume` (file, optional) - Resume file (PDF, DOC, DOCX, max 5MB)
  - If not provided, uses resume from your TalentSeeker profile
- `coverLetter` (string, optional) - Cover letter (10-2000 characters)

## 📤 Example Request

### Using JavaScript Fetch
```javascript
const formData = new FormData();
formData.append('coverLetter', 'I am excited to apply for this position...');
formData.append('resume', resumeFile); // Optional - File object from input

fetch('/api/jobs/64f123abc456def789/apply', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Using Axios
```javascript
const formData = new FormData();
formData.append('coverLetter', 'I am excited to apply for this position...');
formData.append('resume', resumeFile); // Optional

axios.post('/api/jobs/64f123abc456def789/apply', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});
```

### Using cURL
```bash
curl -X POST http://localhost:8081/api/jobs/64f123abc456def789/apply \
  -H "Authorization: Bearer your_jwt_token" \
  -F "coverLetter=I am excited to apply for this position..." \
  -F "resume=@/path/to/resume.pdf"
```

## 📥 Response

### Success Response (201 Created)
```json
{
  "status": 201,
  "message": "Application submitted successfully",
  "data": {
    "_id": "64f456def789abc123",
    "jobId": {
      "_id": "64f123abc456def789",
      "title": "Senior Full Stack Developer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "jobType": "full-time"
    },
    "talentSeekerId": {
      "_id": "64f789ghi012jkl345",
      "userId": "64fabc123def456",
      "title": "Full Stack Developer",
      "skills": ["JavaScript", "React", "Node.js"]
    },
    "coverLetter": "I am excited to apply for this position...",
    "resumeUrl": "https://res.cloudinary.com/your-cloud/resumes/userId_jobId/resume.pdf",
    "status": "applied",
    "appliedAt": "2025-11-01T19:45:00.000Z",
    "createdAt": "2025-11-01T19:45:00.000Z",
    "updatedAt": "2025-11-01T19:45:00.000Z"
  }
}
```

### Error Responses

#### 400 - Already Applied
```json
{
  "status": 400,
  "message": "You have already applied to this job",
  "data": null
}
```

#### 400 - Job Not Accepting Applications
```json
{
  "status": 400,
  "message": "This job is not accepting applications",
  "data": null
}
```

#### 404 - Job Not Found
```json
{
  "status": 404,
  "message": "Job not found",
  "data": null
}
```

#### 404 - Profile Required
```json
{
  "status": 404,
  "message": "Please complete your talent seeker profile before applying to jobs",
  "data": null
}
```

#### 401 - Unauthorized
```json
{
  "status": 401,
  "message": "Unauthorized",
  "data": null
}
```

## 🎯 Features

✅ **Automatic Profile Validation** - Checks if user has completed TalentSeeker profile
✅ **Duplicate Prevention** - Prevents applying to the same job twice
✅ **Resume Upload** - Optional resume specific to this application
✅ **Fallback Resume** - Uses profile resume if not provided
✅ **Cloudinary Storage** - Resumes stored securely in cloud
✅ **Applicant Counter** - Automatically increments job applicant count
✅ **Status Tracking** - Application status set to "applied"
✅ **Populated Response** - Returns job and seeker details

## 🔄 Application Flow

1. **User submits application** with optional resume
2. **System validates:**
   - Job exists and is active
   - User has TalentSeeker profile
   - User hasn't already applied
3. **If resume provided:**
   - Uploads to Cloudinary at `resumes/{userId}_{jobId}/{filename}`
   - Returns secure URL
4. **If no resume:**
   - Uses resume from TalentSeeker profile
5. **Creates application record** in database
6. **Increments applicant count** on job
7. **Returns populated application** with job and seeker details

## 📊 Application Statuses

The application can have the following statuses:
- `applied` - Initial status when application is submitted
- `shortlisted` - Recruiter has shortlisted the candidate
- `accepted` - Candidate accepted for interview/next round
- `rejected` - Application rejected
- `withdrawn` - Candidate withdrew application
- `hired` - Candidate was hired

## 🎨 Frontend Example (React)

```jsx
import { useState } from 'react';

function JobApplicationForm({ jobId }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('coverLetter', coverLetter);
    if (resume) {
      formData.append('resume', resume);
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Application submitted successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Cover Letter (optional)"
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        maxLength={2000}
      />
      
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setResume(e.target.files[0])}
      />
      <small>
        Optional - If not provided, your profile resume will be used
      </small>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Apply Now'}
      </button>
    </form>
  );
}
```

## 🔒 Security & Validation

- **File Type Validation** - Only PDF, DOC, DOCX accepted
- **File Size Limit** - Maximum 5MB per file
- **Cover Letter Length** - 10-2000 characters
- **Authentication Required** - Must be logged in
- **Profile Required** - Must have TalentSeeker profile
- **Unique Constraint** - Database prevents duplicate applications
- **Job Status Check** - Only active jobs accept applications

## 💡 Notes

- Resume upload is **optional** - if not provided, the system uses the resume from your TalentSeeker profile
- You can upload a different resume for each job application
- Cover letter is optional but recommended
- Applications cannot be edited after submission (future feature)
- The uploaded resume is stored at: `resumes/{userId}_{jobId}/{filename}.pdf`
