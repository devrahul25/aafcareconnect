# Quick Start Guide - Testing New Features

## Prerequisites

1. ✅ Database migration applied
2. ✅ Permissions seeded
3. ✅ Prisma client generated

## Start the Application

```bash
# From project root
npm run dev
```

This will start both frontend (Vite) and backend (Express) concurrently.

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## Test Scenarios

### 1. Course Creation with All Content Types

#### Step 1: Authenticate
```bash
# Login first to get access token
POST http://localhost:3001/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@demo.com",
  "password": "your-password"
}
```

Save the `access_token` from the response.

#### Step 2: Create a Course
```bash
POST http://localhost:3001/api/v1/courses
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "title": "Test Course - All Content Types",
  "description": "A comprehensive test course",
  "category": "Safeguarding",
  "level": "FOUNDATION",
  "duration_minutes": 60,
  "pass_mark": 80,
  "certificate_enabled": true,
  "mandatory": false,
  "target_roles": ["foster_carer"]
}
```

**Expected Result:** Course created with ID

#### Step 3: Add Video Section
```bash
POST http://localhost:3001/api/v1/courses/{course-id}/sections
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "title": "Introduction Video",
  "type": "VIDEO",
  "sort_order": 1
}
```

**Expected Result:** Section created with ID

#### Step 4: Get Upload URL for Video
```bash
POST http://localhost:3001/api/v1/storage/upload-url
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "filename": "intro.mp4",
  "contentType": "video/mp4",
  "folder": "videos"
}
```

**Expected Result:** Upload URL, S3 key, and CloudFront URL

#### Step 5: Add Video to Section
```bash
POST http://localhost:3001/api/v1/courses/{course-id}/sections/{section-id}/videos
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "title": "Introduction to Safeguarding",
  "s3_key": "{s3-key-from-step-4}",
  "cloudfront_url": "{cloudfront-url-from-step-4}",
  "duration_secs": 180,
  "sort_order": 1
}
```

**Expected Result:** Video added to section

#### Step 6: Add Document Section
```bash
POST http://localhost:3001/api/v1/courses/{course-id}/sections
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "title": "Reference Materials",
  "type": "DOCUMENT",
  "sort_order": 2
}
```

#### Step 7: Add Document
```bash
POST http://localhost:3001/api/v1/courses/{course-id}/sections/{section-id}/documents
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "title": "Safeguarding Policy",
  "s3_key": "org-id/documents/policy.pdf",
  "file_type": "application/pdf",
  "file_size": 1024000,
  "sort_order": 1
}
```

#### Step 8: Add Rich Text Section
```bash
POST http://localhost:3001/api/v1/courses/{course-id}/sections
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "title": "Key Concepts",
  "type": "RICH_TEXT",
  "sort_order": 3
}
```

#### Step 9: Add Rich Text Content
```bash
POST http://localhost:3001/api/v1/courses/{course-id}/sections/{section-id}/rich-text
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "title": "Important Definitions",
  "content": {
    "html": "<h2>Safeguarding</h2><p>Safeguarding means protecting...</p>"
  },
  "sort_order": 1
}
```

#### Step 10: Add Quiz Section
```bash
POST http://localhost:3001/api/v1/courses/{course-id}/sections
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "title": "Knowledge Check",
  "type": "QUIZ",
  "sort_order": 4
}
```

#### Step 11: Create Quiz
```bash
POST http://localhost:3001/api/v1/courses/{course-id}/sections/{section-id}/quizzes
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "title": "Module 1 Quiz",
  "pass_mark": 80,
  "time_limit": 10,
  "sort_order": 1
}
```

**Expected Result:** Quiz created with ID

#### Step 12: Add Quiz Question
```bash
POST http://localhost:3001/api/v1/courses/quizzes/{quiz-id}/questions
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "question": "What is the primary goal of safeguarding?",
  "explanation": "Safeguarding aims to protect children from harm",
  "sort_order": 1
}
```

**Expected Result:** Question created with ID

#### Step 13: Add Quiz Answers
```bash
# Correct Answer
POST http://localhost:3001/api/v1/courses/quizzes/{quiz-id}/questions/{question-id}/answers
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "text": "To protect children from harm",
  "is_correct": true,
  "sort_order": 1
}

# Incorrect Answer
POST http://localhost:3001/api/v1/courses/quizzes/{quiz-id}/questions/{question-id}/answers
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "text": "To monitor behavior",
  "is_correct": false,
  "sort_order": 2
}
```

#### Step 14: Get Complete Course
```bash
GET http://localhost:3001/api/v1/courses/{course-id}
Authorization: Bearer {your-access-token}
```

**Expected Result:** Full course with all sections, videos, documents, rich text, quizzes, questions, and answers

---

### 2. Enrolment and Progress Tracking

#### Step 1: Enrol User in Course
```bash
POST http://localhost:3001/api/v1/course-enrolments
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "course_id": "{course-id}",
  "user_id": "{user-id}",
  "status": "ENROLLED"
}
```

**Expected Result:** Enrolment created with status ENROLLED

#### Step 2: Update Progress
```bash
POST http://localhost:3001/api/v1/course-enrolments/{enrolment-id}/progress
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "progress_percent": 25
}
```

**Expected Result:** Progress updated, status automatically changed to IN_PROGRESS

#### Step 3: Continue Progress
```bash
POST http://localhost:3001/api/v1/course-enrolments/{enrolment-id}/progress
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "progress_percent": 75
}
```

**Expected Result:** Progress at 75%, status still IN_PROGRESS

#### Step 4: Complete Course (Pass)
```bash
POST http://localhost:3001/api/v1/course-enrolments/{enrolment-id}/complete
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "score": 85
}
```

**Expected Result:** 
- Progress set to 100%
- Status changed to COMPLETED
- Score recorded
- completed_date set

#### Step 5: Get User's Enrolments
```bash
GET http://localhost:3001/api/v1/course-enrolments?user_id={user-id}
Authorization: Bearer {your-access-token}
```

**Expected Result:** List of user's enrolments with course details

#### Step 6: Get Statistics
```bash
GET http://localhost:3001/api/v1/course-enrolments/stats
Authorization: Bearer {your-access-token}
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "total": 1,
    "enrolled": 0,
    "in_progress": 0,
    "completed": 1,
    "failed": 0
  }
}
```

---

### 3. Compliance Management

#### Step 1: Create Compliance Record
```bash
POST http://localhost:3001/api/v1/compliance-records
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "type": "ALLEGATION",
  "title": "Test Allegation Record",
  "description": "This is a test compliance record",
  "priority": "HIGH",
  "status": "OPEN",
  "incident_date": "2026-07-06T10:00:00Z",
  "due_date": "2026-07-20T17:00:00Z"
}
```

**Expected Result:** Compliance record created

#### Step 2: Update Status
```bash
PATCH http://localhost:3001/api/v1/compliance-records/{record-id}
Authorization: Bearer {your-access-token}
Content-Type: application/json

{
  "status": "UNDER_REVIEW",
  "outcome": "Investigation started"
}
```

**Expected Result:** Status updated to UNDER_REVIEW

#### Step 3: Get All Records
```bash
GET http://localhost:3001/api/v1/compliance-records
Authorization: Bearer {your-access-token}
```

**Expected Result:** List of all compliance records

#### Step 4: Filter by Type and Priority
```bash
GET http://localhost:3001/api/v1/compliance-records?type=ALLEGATION&priority=HIGH
Authorization: Bearer {your-access-token}
```

**Expected Result:** Filtered list

#### Step 5: Get Statistics
```bash
GET http://localhost:3001/api/v1/compliance-records/stats
Authorization: Bearer {your-access-token}
```

**Expected Result:**
```json
{
  "success": true,
  "data": {
    "total": 1,
    "open": 0,
    "under_review": 1,
    "resolved": 0,
    "closed": 0,
    "critical": 0,
    "high": 1
  }
}
```

---

## Testing Checklist

### Course Module
- [ ] Create course
- [ ] Update course
- [ ] Delete course
- [ ] List courses
- [ ] Get course by ID

### Sections
- [ ] Create section
- [ ] Update section
- [ ] Delete section
- [ ] Reorder sections

### Video Content
- [ ] Get upload URL
- [ ] Add video to section
- [ ] Update video
- [ ] Delete video

### Document Content
- [ ] Add document to section
- [ ] Update document
- [ ] Delete document

### Rich Text Content
- [ ] Add rich text to section
- [ ] Update rich text
- [ ] Delete rich text

### Quiz Content
- [ ] Create quiz
- [ ] Update quiz
- [ ] Delete quiz
- [ ] Add question
- [ ] Update question
- [ ] Delete question
- [ ] Add answer
- [ ] Update answer
- [ ] Delete answer
- [ ] Get quiz with all questions and answers

### Enrolments
- [ ] Enrol user
- [ ] Update enrolment
- [ ] Delete enrolment
- [ ] Update progress
- [ ] Complete course (pass)
- [ ] Complete course (fail)
- [ ] Get user's enrolments
- [ ] Get enrolment statistics
- [ ] Filter by status

### Compliance
- [ ] Create record
- [ ] Update record
- [ ] Delete record
- [ ] List all records
- [ ] Filter by type
- [ ] Filter by status
- [ ] Filter by priority
- [ ] Get statistics

---

## Common Issues & Solutions

### Issue: 403 Forbidden
**Solution:** Check that the user has the required permissions:
- `courses:create`, `courses:read`, `courses:update`, `courses:delete`
- `compliance:create`, `compliance:read`, `compliance:update`, `compliance:delete`
- `storage:upload`

### Issue: 401 Unauthorized
**Solution:** Check that:
1. Token is valid and not expired
2. Authorization header is properly formatted: `Bearer {token}`

### Issue: Course not found
**Solution:** Verify the organization_id matches the user's organization

### Issue: Already enrolled
**Solution:** This is expected behavior - users can only enrol once per course

---

## Performance Testing

### Load Test Course Creation
```bash
# Create 10 courses
for i in {1..10}
do
  curl -X POST http://localhost:3001/api/v1/courses \
    -H "Authorization: Bearer {token}" \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"Test Course $i\",\"category\":\"Test\",\"level\":\"FOUNDATION\"}"
done
```

### Load Test Enrolments
```bash
# Create 100 enrolments
for i in {1..100}
do
  curl -X POST http://localhost:3001/api/v1/course-enrolments \
    -H "Authorization: Bearer {token}" \
    -H "Content-Type: application/json" \
    -d "{\"course_id\":\"{course-id}\",\"user_id\":\"{user-id-$i}\"}"
done
```

---

## Database Verification

### Check Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'course_enrolments',
    'compliance_records',
    'cpd_certificates',
    'foster_carers',
    'workforce_members',
    'placements'
  );
```

**Expected:** All 6 tables should exist

### Check Permissions
```sql
SELECT * FROM permissions 
WHERE resource IN ('courses', 'compliance', 'storage');
```

**Expected:** All permissions seeded

### Check Sample Data
```sql
-- Check courses
SELECT id, title, status FROM courses LIMIT 5;

-- Check enrolments
SELECT * FROM course_enrolments LIMIT 5;

-- Check compliance
SELECT * FROM compliance_records LIMIT 5;
```

---

## Success Criteria

✅ **All endpoints return 200/201 responses for valid requests**  
✅ **Course with all 4 content types can be created**  
✅ **Enrolment flow works from enrol to completion**  
✅ **Compliance records can be created and updated**  
✅ **Progress tracking updates status automatically**  
✅ **Statistics endpoints return correct counts**  
✅ **File upload flow works end-to-end**  
✅ **Authorization is enforced on all routes**  
✅ **Multi-tenancy isolation works correctly**

---

## Next Steps After Testing

1. Fix any bugs found during testing
2. Update frontend to use new APIs
3. Add unit and integration tests
4. Implement remaining modules (CPD, Foster Carer, Workforce, Placement)
5. Add certificate generation
6. Deploy to staging environment

---

**Ready to Test!** 🚀

Start with the course creation flow, then test enrolments, and finally compliance management.
