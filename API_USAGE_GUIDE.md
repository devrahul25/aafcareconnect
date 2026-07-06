# API Usage Guide - Course Creation & Management

## Course Module - All Content Types

### 1. Create a Course
```http
POST /api/v1/courses
Authorization: Bearer {access_token}

{
  "title": "Safeguarding Level 1",
  "description": "Introduction to safeguarding for foster carers",
  "category": "Safeguarding",
  "level": "FOUNDATION",
  "duration_minutes": 120,
  "pass_mark": 80,
  "certificate_enabled": true,
  "mandatory": true,
  "target_roles": ["foster_carer"],
  "sort_order": 1
}
```

### 2. Add a Section
```http
POST /api/v1/courses/{courseId}/sections
Authorization: Bearer {access_token}

{
  "title": "Introduction to Safeguarding",
  "type": "VIDEO",
  "sort_order": 1
}
```

### 3. Add Video Content
```http
POST /api/v1/courses/{courseId}/sections/{sectionId}/videos
Authorization: Bearer {access_token}

{
  "title": "Welcome Video",
  "s3_key": "org-id/videos/2026/07/uuid.mp4",
  "cloudfront_url": "https://d123.cloudfront.net/org-id/videos/2026/07/uuid.mp4",
  "duration_secs": 180,
  "thumbnail_url": "https://...",
  "transcript": "Welcome to the course...",
  "sort_order": 1
}
```

### 4. Add Document Content
```http
POST /api/v1/courses/{courseId}/sections/{sectionId}/documents
Authorization: Bearer {access_token}

{
  "title": "Safeguarding Policy Document",
  "s3_key": "org-id/documents/2026/07/uuid.pdf",
  "file_type": "application/pdf",
  "file_size": 2048576,
  "sort_order": 1
}
```

### 5. Add Rich Text Content
```http
POST /api/v1/courses/{courseId}/sections/{sectionId}/rich-text
Authorization: Bearer {access_token}

{
  "title": "Key Concepts",
  "content": {
    "type": "rich_text",
    "html": "<h2>Important Points</h2><p>...</p>"
  },
  "sort_order": 1
}
```

### 6. Add Quiz Content
```http
POST /api/v1/courses/{courseId}/sections/{sectionId}/quizzes
Authorization: Bearer {access_token}

{
  "title": "Module 1 Quiz",
  "pass_mark": 80,
  "time_limit": 15,
  "sort_order": 1
}
```

### 7. Add Quiz Question
```http
POST /api/v1/courses/quizzes/{quizId}/questions
Authorization: Bearer {access_token}

{
  "question": "What is the primary goal of safeguarding?",
  "explanation": "Safeguarding aims to protect children from abuse and neglect.",
  "sort_order": 1
}
```

### 8. Add Quiz Answers
```http
POST /api/v1/courses/quizzes/{quizId}/questions/{questionId}/answers
Authorization: Bearer {access_token}

{
  "text": "To protect children from harm",
  "is_correct": true,
  "sort_order": 1
}
```

### 9. Reorder Sections
```http
POST /api/v1/courses/{courseId}/sections/reorder
Authorization: Bearer {access_token}

{
  "sections": [
    { "id": "section-1-id", "sort_order": 1 },
    { "id": "section-2-id", "sort_order": 2 },
    { "id": "section-3-id", "sort_order": 3 }
  ]
}
```

### 10. Update Section
```http
PATCH /api/v1/courses/{courseId}/sections/{sectionId}
Authorization: Bearer {access_token}

{
  "title": "Updated Section Title",
  "sort_order": 2
}
```

### 11. Update Video
```http
PATCH /api/v1/courses/{courseId}/sections/{sectionId}/videos/{videoId}
Authorization: Bearer {access_token}

{
  "title": "Updated Video Title",
  "transcript": "Updated transcript..."
}
```

---

## Course Enrolment Module

### 1. Enrol User in Course
```http
POST /api/v1/course-enrolments
Authorization: Bearer {access_token}

{
  "course_id": "course-uuid",
  "user_id": "user-uuid",
  "status": "ENROLLED"
}
```

### 2. Update Progress
```http
POST /api/v1/course-enrolments/{enrolmentId}/progress
Authorization: Bearer {access_token}

{
  "progress_percent": 45
}
```
*Note: Status automatically changes from ENROLLED to IN_PROGRESS when progress > 0*

### 3. Complete Course
```http
POST /api/v1/course-enrolments/{enrolmentId}/complete
Authorization: Bearer {access_token}

{
  "score": 85
}
```
*Note: Status automatically set to COMPLETED or FAILED based on score vs pass_mark*

### 4. Get User's Enrolments
```http
GET /api/v1/course-enrolments?user_id={userId}
Authorization: Bearer {access_token}
```

### 5. Get Enrolment Statistics
```http
GET /api/v1/course-enrolments/stats
Authorization: Bearer {access_token}

# Or for specific user:
GET /api/v1/course-enrolments/stats?user_id={userId}
```

Response:
```json
{
  "success": true,
  "data": {
    "total": 25,
    "enrolled": 5,
    "in_progress": 10,
    "completed": 8,
    "failed": 2
  }
}
```

---

## Compliance Module

### 1. Create Compliance Record
```http
POST /api/v1/compliance-records
Authorization: Bearer {access_token}

{
  "type": "ALLEGATION",
  "title": "Allegation regarding placement",
  "description": "Details of the allegation...",
  "assigned_to_id": "user-uuid",
  "carer_id": "carer-uuid",
  "child_name": "Child Name",
  "incident_date": "2026-07-05T10:00:00Z",
  "due_date": "2026-07-15T17:00:00Z",
  "status": "OPEN",
  "priority": "HIGH",
  "documents": ["s3-key-1", "s3-key-2"]
}
```

### 2. Update Compliance Record
```http
PATCH /api/v1/compliance-records/{recordId}
Authorization: Bearer {access_token}

{
  "status": "UNDER_REVIEW",
  "outcome": "Investigation ongoing..."
}
```

### 3. Get Compliance Statistics
```http
GET /api/v1/compliance-records/stats
Authorization: Bearer {access_token}
```

Response:
```json
{
  "success": true,
  "data": {
    "total": 45,
    "open": 12,
    "under_review": 8,
    "resolved": 15,
    "closed": 10,
    "critical": 2,
    "high": 7
  }
}
```

### 4. Filter Compliance Records
```http
GET /api/v1/compliance-records?type=ALLEGATION&status=OPEN&priority=HIGH
Authorization: Bearer {access_token}
```

---

## Storage Module (For File Uploads)

### 1. Get Upload URL for Video
```http
POST /api/v1/storage/upload-url
Authorization: Bearer {access_token}

{
  "filename": "intro-video.mp4",
  "contentType": "video/mp4",
  "folder": "videos"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/...",
    "key": "org-id/videos/uuid.mp4",
    "cloudfrontUrl": "https://d123.cloudfront.net/org-id/videos/uuid.mp4"
  }
}
```

### 2. Upload File to S3
```http
PUT {uploadUrl}
Content-Type: video/mp4

[Binary file data]
```

### 3. Use CloudFront URL in Course Content
After upload, use the `cloudfrontUrl` in your course content creation request.

---

## Multipart Upload (Large Videos)

### 1. Initialize Multipart Upload
```http
POST /api/v1/storage/multipart/init
Authorization: Bearer {access_token}

{
  "filename": "large-training-video.mp4",
  "contentType": "video/mp4"
}
```

### 2. Get Pre-signed URL for Each Part
```http
POST /api/v1/storage/multipart/sign
Authorization: Bearer {access_token}

{
  "key": "org-id/videos/2026/07/uuid.mp4",
  "uploadId": "upload-id-from-init",
  "partNumber": 1
}
```

### 3. Complete Multipart Upload
```http
POST /api/v1/storage/multipart/complete
Authorization: Bearer {access_token}

{
  "key": "org-id/videos/2026/07/uuid.mp4",
  "uploadId": "upload-id-from-init",
  "parts": [
    { "ETag": "etag-1", "PartNumber": 1 },
    { "ETag": "etag-2", "PartNumber": 2 }
  ]
}
```

---

## Complete Course Creation Flow

1. **Create Course** → Get `course_id`
2. **Create Section** → Get `section_id`
3. **Upload Media** (if video/document):
   - Get upload URL from `/storage/upload-url`
   - Upload file to S3
   - Get CloudFront URL
4. **Add Content to Section**:
   - Video: Use S3 key and CloudFront URL
   - Document: Use S3 key
   - Rich Text: Provide JSON/HTML content
   - Quiz: Create quiz, then add questions and answers
5. **Publish Course**: Update course status to "PUBLISHED"
6. **Enrol Users**: Create enrolments for users
7. **Track Progress**: Update enrolment progress as users complete lessons
8. **Complete Course**: Mark enrolment as complete with score

---

## Permissions Required

### Course Management
- `courses:create` - Create courses, sections, content
- `courses:read` - View courses
- `courses:update` - Update courses, sections, content
- `courses:delete` - Delete courses, sections, content

### Enrolment Management
- `courses:create` - Enrol users (reuses course permission)
- `courses:read` - View enrolments
- `courses:update` - Update enrolments, progress
- `courses:delete` - Delete enrolments

### Compliance Management
- `compliance:create` - Create compliance records
- `compliance:read` - View compliance records
- `compliance:update` - Update compliance records
- `compliance:delete` - Delete compliance records

### Storage
- `storage:upload` - Upload files to S3

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "type": "NOT_FOUND",
    "message": "Course not found"
  }
}
```

Common error types:
- `NOT_FOUND` (404)
- `VALIDATION_ERROR` (400)
- `ALREADY_ENROLLED` (409)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `INVALID_FILE_TYPE` (400)

---

## Testing Checklist

- [ ] Create course with all fields
- [ ] Add video section and upload video
- [ ] Add document section and upload PDF
- [ ] Add rich text section with HTML content
- [ ] Add quiz section with questions and answers
- [ ] Reorder sections
- [ ] Update all content types
- [ ] Delete content
- [ ] Enrol user in course
- [ ] Update enrolment progress
- [ ] Complete course with passing score
- [ ] Complete course with failing score
- [ ] Create compliance record
- [ ] Update compliance status
- [ ] Filter compliance records
- [ ] Get statistics for enrolments and compliance
