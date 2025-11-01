# 🧪 Testing AI Features

## Quick Test Guide

### Prerequisites
- Server running: `npm run dev`
- Valid JWT token
- At least one job created
- Talent seeker profile completed

---

## Test 1: Match Score (Without AI - Fallback)

### Setup
```bash
# Don't add GEMINI_API_KEY to .env
npm run dev
```

### Request
```bash
curl -X GET "http://localhost:8080/api/jobs/YOUR_JOB_ID/match-score" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Response
```json
{
  "status": 200,
  "data": {
    "matchPercentage": 85,
    "matchLevel": "Excellent Match",
    "aiInsights": [
      "🎉 Excellent match! This role aligns perfectly with your profile.",
      "💪 Your skills are a strong match for this position!",
      "⭐ Your experience level is ideal for this role."
    ],
    "recommendations": [ /* traditional */ ]
  }
}
```

### ✅ Check
- Response is fast (~50-100ms)
- `aiInsights` contains rule-based insights
- Logs show: `WARN: Gemini API key not configured`

---

## Test 2: Match Score (With AI)

### Setup
```bash
# Add to .env
GEMINI_API_KEY=your-actual-api-key

# Restart
npm run dev
```

### Request
```bash
curl -X GET "http://localhost:8080/api/jobs/YOUR_JOB_ID/match-score" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Response
```json
{
  "status": 200,
  "data": {
    "matchPercentage": 85,
    "matchLevel": "Excellent Match",
    "aiInsights": [
      "🎉 Your JavaScript & React skills perfectly align with this senior position",
      "📚 Consider learning Python and AWS to become an exceptional candidate",
      "💼 Your 5 years of experience matches their senior requirements ideally"
    ],
    "recommendations": [ /* traditional */ ]
  }
}
```

### ✅ Check
- Response takes ~200-400ms
- `aiInsights` contains personalized, specific advice
- Mentions actual skills from profile
- Logs show: `INFO: AI insights generated`

---

## Test 3: Recommendations (Without AI)

### Request
```bash
curl -X GET "http://localhost:8080/api/jobs/recommendations?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Response
```json
{
  "status": 200,
  "data": {
    "jobs": [ /* 5 jobs */ ],
    "aiSummary": "We found 12 jobs that could be a fit. Upskilling in JavaScript and React could improve your matches.",
    "insights": {
      "avgMatchScore": 68,
      "topSkills": ["JavaScript", "React", "Node.js"]
    }
  }
}
```

### ✅ Check
- `aiSummary` is generic but helpful
- `insights` contains analytics
- Fast response

---

## Test 4: Recommendations (With AI)

### Request
```bash
curl -X GET "http://localhost:8080/api/jobs/recommendations?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Response
```json
{
  "status": 200,
  "data": {
    "jobs": [ /* 5 jobs */ ],
    "aiSummary": "Your JavaScript and React expertise matches 45 in-demand positions. Your senior-level experience is highly sought after in the current market.",
    "insights": {
      "avgMatchScore": 78,
      "topSkills": ["JavaScript", "React", "Node.js", "TypeScript", "AWS"]
    }
  }
}
```

### ✅ Check
- `aiSummary` is personalized and encouraging
- Mentions specific skills from profile
- References job market demand
- Slightly slower but still fast

---

## Test 5: Error Handling (Invalid API Key)

### Setup
```bash
# Add invalid key to .env
GEMINI_API_KEY=invalid-key-123

npm run dev
```

### Request
```bash
curl -X GET "http://localhost:8080/api/jobs/YOUR_JOB_ID/match-score" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Behavior
- ✅ Request succeeds (200 OK)
- ✅ Returns fallback insights
- ✅ No error shown to user
- ✅ Logs show: `ERROR: AI service error` + fallback used

---

## Test 6: Performance Comparison

### Test Script
```bash
#!/bin/bash

echo "Testing WITHOUT AI..."
time curl -X GET "http://localhost:8080/api/jobs/YOUR_JOB_ID/match-score" \
  -H "Authorization: Bearer YOUR_TOKEN" -o /dev/null -s

echo "\nTesting WITH AI..."
# Add GEMINI_API_KEY and restart
time curl -X GET "http://localhost:8080/api/jobs/YOUR_JOB_ID/match-score" \
  -H "Authorization: Bearer YOUR_TOKEN" -o /dev/null -s
```

### Expected Results
```
Without AI: ~50-100ms
With AI:    ~200-400ms
Difference: ~150-300ms (acceptable!)
```

---

## Test 7: Rate Limit Handling

### Test Script
```bash
#!/bin/bash

# Make 20 rapid requests
for i in {1..20}; do
  echo "Request $i"
  curl -X GET "http://localhost:8080/api/jobs/YOUR_JOB_ID/match-score" \
    -H "Authorization: Bearer YOUR_TOKEN" -s | jq '.data.aiInsights'
done
```

### Expected Behavior
- First 15 requests: AI-powered insights
- After rate limit: Automatic fallback
- All requests succeed (200 OK)
- No errors shown to user

---

## Test 8: Concurrent Requests

### Test Script (using Apache Bench)
```bash
# 100 requests, 10 concurrent
ab -n 100 -c 10 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/jobs/YOUR_JOB_ID/match-score
```

### Expected Results
- All 100 requests succeed
- Average response time: 200-400ms
- No timeouts
- Some may use fallback (rate limits)

---

## Test 9: Different Profile Scenarios

### Scenario A: Entry Level with Few Skills
```json
Profile: {
  skills: ["JavaScript"],
  experience: 1,
  preferredJobTypes: ["full-time"]
}

Job: Senior Developer (5+ years, many skills)
```

**Expected AI Insight:**
- Low match percentage (~40-50%)
- AI suggests specific skills to learn
- Encourages gaining experience

### Scenario B: Senior with Perfect Match
```json
Profile: {
  skills: ["JavaScript", "React", "Node.js", "TypeScript"],
  experience: 6,
  preferredJobTypes: ["full-time"]
}

Job: Senior Full Stack (5+ years, same skills)
```

**Expected AI Insight:**
- High match percentage (85%+)
- AI celebrates the match
- Encourages applying immediately

### Scenario C: Career Changer
```json
Profile: {
  skills: ["Python", "Data Analysis"],
  experience: 5
}

Job: Backend Developer (Node.js, JavaScript)
```

**Expected AI Insight:**
- Medium match (~55-65%)
- AI highlights transferable skills
- Suggests learning path

---

## Test 10: Logs Verification

### Check Logs
```bash
# Watch logs in real-time
npm run dev | grep -i "ai"
```

### Expected Log Entries

**With API Key (Success):**
```
INFO: AI insights generated { responseTime: 250, tokensUsed: 150 }
```

**Without API Key:**
```
WARN: Gemini API key not configured. AI features will be disabled.
```

**With Error:**
```
ERROR: AI service error: [error details]
WARN: Using fallback insights
```

---

## ✅ Test Checklist

- [ ] Test match score without API key (fallback)
- [ ] Test match score with valid API key (AI)
- [ ] Test recommendations without API key
- [ ] Test recommendations with valid API key
- [ ] Test with invalid API key (error handling)
- [ ] Compare performance (with/without AI)
- [ ] Test rate limiting behavior
- [ ] Test concurrent requests
- [ ] Test different profile scenarios
- [ ] Verify logs for all scenarios

---

## 🐛 Troubleshooting

### Issue: No AI insights returned
**Check:**
- Is GEMINI_API_KEY in .env?
- Did you restart the server?
- Check logs for errors

### Issue: Slow responses
**Check:**
- Network connectivity to Google API
- Rate limits not exceeded
- Server resources sufficient

### Issue: Generic insights (not personalized)
**Check:**
- Is fallback being used? (check logs)
- Profile data complete?
- API key valid?

---

## 📊 Success Metrics

After testing, you should see:

✅ **Reliability**: 100% success rate (with fallbacks)  
✅ **Performance**: <500ms average response time  
✅ **Personalization**: AI insights mention specific skills  
✅ **Error Handling**: No user-facing errors  
✅ **Logging**: Clear logs for debugging  

---

## 🎉 When Tests Pass

Your AI-powered job matching is ready for production! 🚀

Next steps:
1. Deploy with GEMINI_API_KEY configured
2. Monitor logs for AI usage
3. Update frontend to display AI insights
4. Gather user feedback

---

**Need help?** Check `AI_JOB_MATCHING.md` for detailed docs.
