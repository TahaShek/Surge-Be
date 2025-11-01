# 🚀 Surge - AI-Powered Job Platform Backend

Modern job matching platform with AI-powered features, real-time notifications, and intelligent candidate-recruiter matching.

## ✨ Key Features

### 🤖 AI-Powered Features
- **Smart Job Matching** - AI algorithms match candidates with relevant jobs based on skills, experience, and preferences
- **Job Description Enhancement** - AI rewrites job postings with better descriptions, skill suggestions, and salary estimates
- **Cover Letter Analysis** - Automatic scoring (0-100) with feedback on personalization, strengths, and improvement areas
- **Interview Question Generator** - Personalized questions based on candidate skills and job requirements (technical, behavioral, situational)

### 👤 User Management
- **Dual User Types** - Talent Finders (candidates) and Talent Seekers (recruiters)
- **JWT Authentication** - Secure access and refresh token system
- **Email Verification** - OTP-based email verification with BullMQ background processing
- **Role-Based Access Control** - Granular permissions system

### 💼 Job Management
- **Job CRUD Operations** - Create, read, update, delete job postings
- **Job Applications** - Apply with cover letters, automatic AI analysis
- **Application Status Tracking** - Real-time status updates (applied → shortlisted → accepted → hired)
- **Job Bookmarks** - Save interesting jobs for later

### 🔔 Real-Time Features
- **Socket.IO Integration** - Instant notifications
- **Application Notifications** - Recruiters notified when candidates apply (includes cover letter score)
- **Status Update Notifications** - Candidates notified of application status changes
- **Online Presence** - Track user online/offline status

### 🗺️ Location & Maps
- **Location Services** - Save and manage user locations
- **Maps Integration** - Location-based job searching

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js + TypeScript** | Runtime and type safety |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database and ODM |
| **Redis** | Caching and session storage |
| **BullMQ** | Background job processing |
| **Socket.IO** | Real-time bidirectional communication |
| **Google Gemini AI** | AI-powered features (job enhancement, cover letter analysis, interview questions) |
| **Zod** | Request validation |
| **Winston** | Logging |

## 📁 Project Structure

```
src/
├── app.ts                      # Express app setup
├── server.ts                   # Server entry point
├── config/                     # Configuration files
├── middlewares/                # Auth, error handling
├── models/                     # Mongoose models
├── modules/                    # Feature modules
│   ├── auth/                   # Authentication
│   ├── user/                   # User management
│   ├── job/                    # Job management with AI
│   ├── maps/                   # Location services
│   └── notifications/          # Notification system
├── services/                   # Business logic
│   ├── ai.service.ts          # AI integrations
│   ├── email.service.ts       # Email sending
│   └── otp.service.ts         # OTP management
├── socket/                     # Socket.IO implementation
├── queues/                     # BullMQ job queues
└── utils/                      # Utilities and helpers
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Redis
- Google Gemini API key

### Installation

1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd Surge-Be
   npm install
   ```

2. **Environment setup:**
   ```bash
   # Create .env file with:
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/surge
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   GEMINI_API_KEY=your-gemini-api-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

3. **Start services:**
   ```bash
   # Terminal 1: Main server
   npm run dev

   # Terminal 2: Worker process
   npm run dev:worker
   ```

4. **Access:**
   - API: `http://localhost:8080`
   - Socket.IO: `ws://localhost:8080`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout

### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create job (recruiters)
- `POST /api/jobs/:jobId/apply` - Apply to job (auto cover letter analysis)
- `POST /api/jobs/enhance-description` - AI job enhancement
- `GET /api/jobs/applications/:applicationId/interview-questions` - AI interview questions
- `PATCH /api/jobs/applications/:applicationId/status` - Update application status

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/locations` - Add location

## 🔌 Socket.IO Events

### Client → Server
- `connection` - Establish connection
- `join_room` - Join notification room
- `send_message` - Send message

### Server → Client
- `notification` - Receive notifications
- `application_received` - New application notification (with cover letter score)
- `status_updated` - Application status changed
- `user_online` / `user_offline` - Presence updates

## 🤖 AI Features Usage

### Job Enhancement
```javascript
POST /api/jobs/enhance-description
{
  "title": "Backend Developer",
  "description": "Build APIs",
  "skills": ["Node.js"],
  "jobType": "full-time",
  "experienceLevel": "mid"
}
// Returns: enhanced description, suggested skills, salary estimate, improvements
```

### Cover Letter Analysis (Automatic)
```javascript
POST /api/jobs/:jobId/apply
{
  "coverLetter": "Dear Hiring Manager..."
}
// Returns: application + coverLetterAnalysis { score, strengths, weaknesses, suggestions }
```

### Interview Questions
```javascript
GET /api/jobs/applications/:applicationId/interview-questions
// Returns: technical, behavioral, situational, skill gap, culture fit questions
```

## 📦 Scripts

- `npm run dev` - Development server (nodemon)
- `npm run dev:worker` - Worker process (nodemon)
- `npm run build` - Build TypeScript
- `npm start` - Production server
- `npm run start:worker` - Production worker

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting
- Input validation with Zod
- CORS configuration
- Helmet security headers
- XSS protection

## 📈 Background Jobs

- **OTP Email Queue** - Send verification emails asynchronously
- **Notification Queue** - Process notifications
- Configurable retry logic and error handling

## 🎯 What Makes This Unique?

1. **AI-First Approach** - Not just matching; AI enhances every step
2. **Real-Time Everything** - Instant notifications via Socket.IO
3. **Smart Analysis** - Cover letters scored and analyzed automatically
4. **Personalized Interviews** - Questions tailored to each candidate
5. **Job Optimization** - AI helps recruiters write better job posts

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use for your projects!

---

Built with ❤️ using TypeScript, AI, and modern best practices
