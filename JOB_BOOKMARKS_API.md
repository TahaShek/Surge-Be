# Job Bookmark API Documentation

## Overview
Job bookmark endpoints allow talent seekers to save jobs for later viewing.

---

## 📌 Add Job to Bookmarks

**POST** `/api/jobs/:jobId/bookmark`

Add a job to your bookmarks.

### Authentication
🔒 **Required** - JWT token in Authorization header

### URL Parameters
- `jobId` (string, required) - The ID of the job to bookmark

### Response

#### Success (201 Created)
```json
{
  "status": 201,
  "message": "Job bookmarked successfully",
  "data": null
}
```

#### Error Responses

**400 - Already Bookmarked**
```json
{
  "status": 400,
  "message": "Job already bookmarked",
  "data": null
}
```

**404 - Profile Required**
```json
{
  "status": 404,
  "message": "Please complete your talent seeker profile before bookmarking jobs",
  "data": null
}
```

### Example Request
```javascript
fetch('/api/jobs/64f123abc456def789/bookmark', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🗑️ Remove Job from Bookmarks

**DELETE** `/api/jobs/:jobId/bookmark`

Remove a job from your bookmarks.

### Authentication
🔒 **Required** - JWT token in Authorization header

### URL Parameters
- `jobId` (string, required) - The ID of the job to remove from bookmarks

### Response

#### Success (200 OK)
```json
{
  "status": 200,
  "message": "Job removed from bookmarks successfully",
  "data": null
}
```

### Example Request
```javascript
fetch('/api/jobs/64f123abc456def789/bookmark', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📋 Get All Bookmarked Jobs

**GET** `/api/jobs/bookmarks`

Retrieve all your bookmarked jobs with pagination.

### Authentication
🔒 **Required** - JWT token in Authorization header

### Query Parameters
- `page` (string, optional) - Page number (default: 1)
- `limit` (string, optional) - Items per page (default: 10)

### Response

#### Success (200 OK)
```json
{
  "status": 200,
  "message": "Bookmarked jobs retrieved successfully",
  "data": {
    "bookmarks": [
      {
        "_id": "64f789bookmark123",
        "jobId": {
          "_id": "64f123abc456def789",
          "title": "Senior Full Stack Developer",
          "company": "Tech Corp",
          "location": "San Francisco, CA",
          "jobType": "full-time",
          "salary": {
            "min": 120000,
            "max": 180000,
            "currency": "USD"
          },
          "status": "active",
          "experienceLevel": "senior",
          "skills": ["JavaScript", "React", "Node.js"],
          "createdAt": "2025-10-15T10:00:00.000Z"
        },
        "talentSeekrId": "64f456seeker789",
        "userId": "64fabc123user456",
        "createdAt": "2025-11-01T15:30:00.000Z",
        "updatedAt": "2025-11-01T15:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

#### Error Response

**404 - Profile Required**
```json
{
  "status": 404,
  "message": "Please complete your talent seeker profile before retrieving bookmarked jobs",
  "data": null
}
```

### Example Request
```javascript
// Get first page with 10 items
fetch('/api/jobs/bookmarks?page=1&limit=10', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get second page with 20 items
fetch('/api/jobs/bookmarks?page=2&limit=20', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🎯 Features

✅ **Profile Validation** - Requires completed TalentSeeker profile
✅ **Duplicate Prevention** - Prevents bookmarking the same job twice
✅ **Pagination Support** - Retrieve bookmarks in pages
✅ **Job Details** - Returns full job information with bookmarks
✅ **Timestamp Tracking** - Tracks when job was bookmarked

---

## 🔄 Workflow

### Adding a Bookmark
1. User clicks "Bookmark" on a job
2. System validates TalentSeeker profile exists
3. System checks if job is already bookmarked
4. Creates bookmark record linking user, job, and talentSeeker profile
5. Returns success message

### Viewing Bookmarks
1. User requests bookmarked jobs
2. System validates TalentSeeker profile exists
3. Retrieves all bookmarks for user with pagination
4. Populates full job details
5. Returns bookmarks with metadata

### Removing a Bookmark
1. User clicks "Remove Bookmark"
2. System validates TalentSeeker profile exists
3. Deletes bookmark record
4. Returns success message

---

## 🎨 Frontend Example (React)

```jsx
import { useState, useEffect } from 'react';

function BookmarkedJobs() {
  const [bookmarks, setBookmarks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch bookmarked jobs
  const fetchBookmarks = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/jobs/bookmarks?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setBookmarks(data.data.bookmarks);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add bookmark
  const addBookmark = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        alert('Job bookmarked successfully!');
        fetchBookmarks(); // Refresh list
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to bookmark job');
    }
  };

  // Remove bookmark
  const removeBookmark = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/bookmark`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        alert('Bookmark removed successfully!');
        fetchBookmarks(); // Refresh list
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to remove bookmark');
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Bookmarked Jobs ({pagination.total || 0})</h2>
      
      {bookmarks.length === 0 ? (
        <p>No bookmarked jobs yet</p>
      ) : (
        <div>
          {bookmarks.map((bookmark) => (
            <div key={bookmark._id} className="job-card">
              <h3>{bookmark.jobId.title}</h3>
              <p>{bookmark.jobId.company} - {bookmark.jobId.location}</p>
              <p>Type: {bookmark.jobId.jobType}</p>
              <p>Skills: {bookmark.jobId.skills.join(', ')}</p>
              <button onClick={() => removeBookmark(bookmark.jobId._id)}>
                Remove Bookmark
              </button>
            </div>
          ))}
          
          {/* Pagination */}
          <div className="pagination">
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => fetchBookmarks(i + 1)}
                disabled={pagination.page === i + 1}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Bookmark button component
function BookmarkButton({ jobId, isBookmarked }) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const toggleBookmark = async () => {
    const method = bookmarked ? 'DELETE' : 'POST';
    
    try {
      const response = await fetch(`/api/jobs/${jobId}/bookmark`, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setBookmarked(!bookmarked);
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  return (
    <button onClick={toggleBookmark}>
      {bookmarked ? '❤️ Bookmarked' : '🤍 Bookmark'}
    </button>
  );
}
```

---

## 📊 Database Schema

The bookmark model stores:
```typescript
{
  jobId: ObjectId,          // Reference to Job
  talentSeekrId: ObjectId,  // Reference to TalentSeeker profile
  userId: ObjectId,         // Reference to User
  createdAt: Date,          // When bookmark was created
  updatedAt: Date           // Last update timestamp
}
```

**Unique Constraint:** A user can only bookmark the same job once (unique index on `jobId` + `talentSeekrId`)

---

## 🔒 Security & Validation

- ✅ JWT authentication required for all endpoints
- ✅ TalentSeeker profile must exist
- ✅ Duplicate bookmarks prevented
- ✅ Only owner can remove their bookmarks
- ✅ Pagination prevents data overload

---

## 💡 Usage Tips

1. **Profile First** - Users must create TalentSeeker profile before bookmarking
2. **Duplicate Check** - System prevents adding same job twice
3. **Pagination** - Use pagination for better performance with many bookmarks
4. **Job Details** - Bookmarks include full job information for easy display
5. **Remove Anytime** - Users can remove bookmarks without restrictions
