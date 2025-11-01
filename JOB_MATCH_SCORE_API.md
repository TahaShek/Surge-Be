# Job Match Score & Recommendations API

## Overview
These endpoints provide intelligent job matching and personalized recommendations for talent seekers based on their profile.

---

## 🎯 Get Match Score for a Job

**GET** `/api/jobs/:jobId/match-score`

Calculate how well a talent seeker's profile matches a specific job posting.

### Authentication
🔒 **Required** - JWT token in Authorization header

### URL Parameters
- `jobId` (string, required) - The ID of the job to calculate match score for

### Response

#### Success (200 OK)
```json
{
  "status": 200,
  "message": "Match score calculated successfully",
  "data": {
    "matchPercentage": 85,
    "matchLevel": "Excellent Match",
    "matchDetails": {
      "skillsMatch": 90,
      "experienceMatch": 85,
      "locationMatch": 80,
      "jobTypeMatch": 100,
      "salaryMatch": 75,
      "workingTypeMatch": 100,
      "matchingSkills": ["JavaScript", "React", "Node.js", "TypeScript"],
      "missingSkills": ["Python", "AWS"]
    },
    "job": {
      "_id": "64f123abc456def789",
      "title": "Senior Full Stack Developer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "jobType": "full-time",
      "experienceLevel": "senior",
      "skills": ["JavaScript", "React", "Node.js", "TypeScript", "Python", "AWS"],
      "salary": {
        "min": 120000,
        "max": 180000,
        "currency": "USD"
      }
    },
    "recommendations": [
      "🎉 This is an excellent match! You should definitely apply.",
      "✅ Your skills are a great match for this position!",
      "📚 Consider learning these skills to improve your match: Python, AWS"
    ]
  }
}
```

#### Error Responses

**404 - Profile Not Found**
```json
{
  "status": 404,
  "message": "Please complete your talent seeker profile to see match scores",
  "data": null
}
```

**404 - Job Not Found**
```json
{
  "status": 404,
  "message": "Job not found",
  "data": null
}
```

### Match Score Algorithm

The match score is calculated based on **6 weighted criteria**:

1. **Skills Match (40%)** - Most Important
   - Compares job required skills with seeker's skills
   - Partial matching supported (e.g., "JavaScript" matches "Javascript", "JS")
   - Shows matching and missing skills

2. **Experience Level (20%)**
   - Entry level: 0-2 years
   - Mid level: 2-5 years
   - Senior level: 5-10 years
   - Lead level: 8+ years

3. **Location Match (15%)**
   - Exact location match: 100%
   - Partial location match: 70%
   - Remote job + open to remote: 80%
   - Different location: 30%

4. **Job Type Match (10%)**
   - Matches preferred job types (full-time, part-time, contract, freelance)
   - 100% if matches preference, 50% otherwise

5. **Salary Match (10%)**
   - Compares job salary range with expected salary
   - 100% if job salary meets or exceeds expectations
   - Scales down based on difference

6. **Working Type Match (5%)**
   - Remote + open to remote: 100%
   - Hybrid: 80%
   - On-site: 60%

### Match Levels
- **Excellent Match**: 80%+
- **Good Match**: 65-79%
- **Fair Match**: 50-64%
- **Poor Match**: Below 50%

### Example Request
```javascript
fetch('/api/jobs/64f123abc456def789/match-score', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => {
    console.log(`You match ${data.data.matchPercentage}% of this opportunity`);
    console.log(`Match Level: ${data.data.matchLevel}`);
    console.log('Recommendations:', data.data.recommendations);
  });
```

---

## 🔍 Get Recommended Jobs

**GET** `/api/jobs/recommendations`

Get personalized job recommendations based on talent seeker's profile with match scores.

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
  "message": "Recommended jobs retrieved successfully",
  "data": {
    "jobs": [
      {
        "_id": "64f123abc456def789",
        "title": "Senior Full Stack Developer",
        "description": "We are looking for...",
        "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
        "jobType": "full-time",
        "experienceLevel": "senior",
        "location": "San Francisco, CA",
        "jobWorkingType": "remote",
        "salary": {
          "min": 120000,
          "max": 180000,
          "currency": "USD"
        },
        "status": "active",
        "talentFinderId": {
          "company": "Tech Corp",
          "location": "San Francisco",
          "industry": "Technology"
        },
        "matchScore": 92,
        "publishedAt": "2025-10-25T10:00:00.000Z"
      },
      {
        "_id": "64f456def789ghi012",
        "title": "Full Stack Developer",
        "skills": ["JavaScript", "React", "Node.js"],
        "jobType": "full-time",
        "experienceLevel": "mid",
        "location": "Remote",
        "jobWorkingType": "remote",
        "matchScore": 85,
        "talentFinderId": {
          "company": "Startup Inc"
        }
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    },
    "profileSummary": {
      "skills": ["JavaScript", "React", "Node.js", "TypeScript", "MongoDB"],
      "experience": 5,
      "preferredJobTypes": ["full-time", "contract"],
      "location": "San Francisco, CA",
      "isOpenToRemote": true
    }
  }
}
```

#### Error Response

**404 - Profile Not Found**
```json
{
  "status": 404,
  "message": "Please complete your talent seeker profile to see recommendations",
  "data": null
}
```

### Recommendation Algorithm

The system recommends jobs based on:

1. **Skills Matching**
   - Jobs that require skills in seeker's profile
   - Uses regex matching for flexibility

2. **Preferred Job Types**
   - Filters by preferred job types (if specified)

3. **Location Preference**
   - Matches location OR shows remote opportunities
   - If open to remote, includes all remote jobs

4. **Recency**
   - Sorted by most recently published first

5. **Match Score Ranking**
   - Each job gets a quick match score
   - Jobs sorted by match score (highest first)

### Example Request
```javascript
// Get first page of recommendations
fetch('/api/jobs/recommendations?page=1&limit=10', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => {
    console.log(`Found ${data.data.pagination.total} recommended jobs`);
    data.data.jobs.forEach(job => {
      console.log(`${job.title} - ${job.matchScore}% match`);
    });
  });
```

---

## 🎨 Frontend Implementation Examples

### React - Match Score Badge
```jsx
import { useState, useEffect } from 'react';

function JobMatchScore({ jobId }) {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchScore = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}/match-score`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setMatchData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch match score:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchScore();
  }, [jobId]);

  if (loading) return <div>Calculating match...</div>;
  if (!matchData) return null;

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'green';
    if (percentage >= 65) return 'blue';
    if (percentage >= 50) return 'orange';
    return 'red';
  };

  return (
    <div className="match-score-badge">
      <div 
        className="score-circle" 
        style={{ borderColor: getMatchColor(matchData.matchPercentage) }}
      >
        <span className="percentage">{matchData.matchPercentage}%</span>
        <span className="label">Match</span>
      </div>
      
      <div className="match-details">
        <h4>{matchData.matchLevel}</h4>
        
        <div className="criteria">
          <div>Skills: {matchData.matchDetails.skillsMatch}%</div>
          <div>Experience: {matchData.matchDetails.experienceMatch}%</div>
          <div>Location: {matchData.matchDetails.locationMatch}%</div>
          <div>Job Type: {matchData.matchDetails.jobTypeMatch}%</div>
        </div>

        <div className="matching-skills">
          <h5>Your Matching Skills:</h5>
          {matchData.matchDetails.matchingSkills?.map(skill => (
            <span key={skill} className="skill-badge">{skill}</span>
          ))}
        </div>

        {matchData.matchDetails.missingSkills?.length > 0 && (
          <div className="missing-skills">
            <h5>Skills to Learn:</h5>
            {matchData.matchDetails.missingSkills.map(skill => (
              <span key={skill} className="skill-badge missing">{skill}</span>
            ))}
          </div>
        )}

        <div className="recommendations">
          {matchData.recommendations.map((rec, idx) => (
            <p key={idx}>{rec}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### React - Recommended Jobs Feed
```jsx
function RecommendedJobsFeed() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/jobs/recommendations?page=${page}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      
      if (response.ok) {
        setJobs(data.data.jobs);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) return <div>Loading recommendations...</div>;

  return (
    <div className="recommended-jobs">
      <h2>Recommended For You ({pagination.total} jobs)</h2>

      <div className="jobs-grid">
        {jobs.map(job => (
          <div key={job._id} className="job-card">
            <div className="match-badge">
              {job.matchScore}% Match
            </div>
            
            <h3>{job.title}</h3>
            <p className="company">{job.talentFinderId.company}</p>
            <p className="location">
              {job.location} • {job.jobWorkingType}
            </p>

            <div className="skills">
              {job.skills.map(skill => (
                <span key={skill} className="skill">{skill}</span>
              ))}
            </div>

            {job.salary && (
              <p className="salary">
                ${job.salary.min.toLocaleString()} - 
                ${job.salary.max.toLocaleString()} {job.salary.currency}
              </p>
            )}

            <button onClick={() => window.location.href = `/jobs/${job._id}`}>
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: pagination.totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => fetchRecommendations(i + 1)}
            disabled={pagination.page === i + 1}
            className={pagination.page === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### CSS for Match Score Badge
```css
.match-score-badge {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.score-circle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 4px solid;
  border-radius: 50%;
  margin-bottom: 15px;
}

.score-circle .percentage {
  font-size: 24px;
  font-weight: bold;
}

.score-circle .label {
  font-size: 12px;
  color: #666;
}

.match-details h4 {
  color: #333;
  margin-bottom: 10px;
}

.criteria {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 15px 0;
}

.skill-badge {
  display: inline-block;
  padding: 5px 12px;
  margin: 5px;
  background: #e3f2fd;
  border-radius: 15px;
  font-size: 12px;
}

.skill-badge.missing {
  background: #ffebee;
  color: #c62828;
}

.recommendations p {
  margin: 8px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
}
```

---

## 🎯 Use Cases

### 1. Job Listing Page
Show match score on each job card to help seekers identify best opportunities.

### 2. Job Detail Page
Display detailed match breakdown with recommendations on what skills to learn.

### 3. Personalized Feed
Create a "Recommended For You" section with jobs sorted by match score.

### 4. Email Notifications
Send weekly emails with top matching jobs based on profile.

### 5. Profile Optimization
Show seekers how adding skills would improve match scores.

---

## 💡 Tips for Best Results

### For Talent Seekers:
1. **Complete Your Profile** - More complete profile = better matches
2. **Add All Skills** - Include all relevant technologies and tools
3. **Be Specific** - Use standard skill names (e.g., "React" not "React.js library")
4. **Update Experience** - Keep experience level current
5. **Set Preferences** - Specify job types, location, and salary expectations

### For Recruiters:
1. **Use Standard Skill Names** - Match industry-standard terms
2. **Be Specific** - Clear requirements = better matching
3. **Update Job Status** - Keep jobs current for accurate recommendations

---

## 🔧 Technical Details

### Match Score Calculation Time
- Average: 50-100ms per job
- Recommendation query: 200-500ms (for 10 jobs)

### Caching Recommendations
Consider caching recommendations for 1-6 hours to improve performance:
```javascript
// Example: Cache in localStorage
const CACHE_DURATION = 3600000; // 1 hour

function getCachedRecommendations() {
  const cached = localStorage.getItem('jobRecommendations');
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  return null;
}

function cacheRecommendations(data) {
  localStorage.setItem('jobRecommendations', JSON.stringify({
    data,
    timestamp: Date.now()
  }));
}
```

---

## 🚀 Future Enhancements

- [ ] Machine learning-based matching
- [ ] Collaborative filtering (jobs similar users applied to)
- [ ] Match score trends over time
- [ ] A/B testing different match algorithms
- [ ] Personalized skill learning paths
- [ ] Match score notifications when new high-match jobs are posted
