# Course Builder Guide

## Overview
The Course Builder has been completely rebuilt with full database integration and all content creation capabilities working.

## What's Fixed

### ✅ Course Management
- **Create & Save Courses**: Courses are now saved to PostgreSQL database via API
- **Update Courses**: Edit course metadata (title, description, category, level, settings)
- **Publish Courses**: Change status from DRAFT to PUBLISHED
- **Real-time Data**: Fetches actual courses from the database

### ✅ Section Management
- **Add Sections**: Create VIDEO, DOCUMENT, RICH_TEXT, or QUIZ sections
- **Edit Sections**: Full editing interface for each section type
- **Delete Sections**: Remove sections with confirmation
- **Reorder Sections**: Drag handles for section ordering (UI ready, API supported)

### ✅ Video Upload
- **File Upload**: Select video files from your computer
- **S3 Integration**: Uploads to AWS S3 using pre-signed URLs
- **CloudFront Delivery**: Videos delivered via CDN
- **Metadata Saved**: Video title, duration, and URLs saved to database

### ✅ Document Upload  
- **PDF/Doc Upload**: Upload documents (PDF, DOCX)
- **S3 Storage**: Documents stored in S3
- **Metadata Tracking**: File type, size, and keys saved

### ✅ Rich Text Editor
- **Full WYSIWYG Editor**: Uses ReactQuill for rich text editing
- **Formatting**: Headers, bold, italic, underline, lists, links
- **Content Saved**: HTML content saved to database

### ✅ Quiz Builder
- **Create Quizzes**: Add multiple-choice questions
- **MCQ Answers**: 4 answers per question with correct answer marking
- **Pass Mark**: Set pass percentage for the quiz
- **Explanations**: Optional explanation for correct answers

## How to Use

### Creating a New Course

1. **Navigate to Course Builder** in the admin panel
2. **Click "+ New Course" tile** at the bottom of the course grid
3. **Fill in Course Details**:
   - Course Title (required)
   - Description
   - Category
   - Level (Foundation/Intermediate/Advanced)
4. **Click "Save"** to create the course in the database

### Adding Course Settings

1. **Click "Settings" tab** in the editor
2. **Configure**:
   - Pass Mark (default 75%)
   - Duration in minutes
   - Enable/disable certificates
   - Mark as mandatory for learners
3. **Click "Save"** to update settings

### Adding a Video Section

1. **Click "+ Add Section"**
2. **Select "Video Lesson"**
3. **Click "Edit"** on the new section
4. **Upload Video**:
   - Click "Choose File" under Video File
   - Select your video file
   - Enter video title
5. **Click "Save Section"** - video uploads to S3 and metadata saves to database

### Adding a Document Section

1. **Click "+ Add Section"**
2. **Select "Document"**
3. **Click "Edit"** on the new section
4. **Upload Document**:
   - Click "Choose File" under Document File
   - Select your PDF/DOCX
   - Enter document title
5. **Click "Save Section"** - document uploads to S3

### Adding a Rich Text Section

1. **Click "+ Add Section"**
2. **Select "Rich Text"**
3. **Click "Edit"** on the new section
4. **Write Content**:
   - Use the editor toolbar for formatting
   - Add headers, lists, links, etc.
5. **Click "Save Section"**

### Adding a Quiz Section

1. **Click "+ Add Section"**
2. **Select "Quiz"**
3. **Click "Edit"** on the new section
4. **Configure Quiz**:
   - Enter quiz title
   - Set pass mark percentage
5. **Add Questions**:
   - Click "+ Add Question"
   - Enter question text
   - Fill in 4 answers
   - Select the correct answer (radio button)
   - Optionally add an explanation
   - Click "Add Question"
6. **Repeat** for all questions
7. **Click "Save Section"**

### Publishing a Course

1. **Ensure course has**:
   - Title and description
   - At least one section
   - All sections properly configured
2. **Click "Publish" button** in top-right
3. Course status changes to PUBLISHED
4. Course becomes visible to learners

## Technical Details

### API Endpoints Used
- `GET /api/v1/courses` - Fetch all courses
- `POST /api/v1/courses` - Create course
- `PATCH /api/v1/courses/:id` - Update course
- `GET /api/v1/courses/:id` - Get course with sections
- `POST /api/v1/courses/:id/sections` - Add section
- `DELETE /api/v1/courses/:id/sections/:sectionId` - Delete section
- `POST /storage/upload-url` - Get S3 pre-signed URL
- `POST /api/v1/courses/:courseId/sections/:sectionId/videos` - Save video
- `POST /api/v1/courses/:courseId/sections/:sectionId/documents` - Save document
- `POST /api/v1/courses/:courseId/sections/:sectionId/rich-text` - Save rich text
- `POST /api/v1/courses/:courseId/sections/:sectionId/quizzes` - Create quiz
- `POST /api/v1/courses/quizzes/:quizId/questions` - Add question
- `POST /api/v1/courses/quizzes/:quizId/questions/:questionId/answers` - Add answer

### File Upload Flow
1. Frontend requests pre-signed URL from `/storage/upload-url`
2. Server generates S3 pre-signed URL with unique key
3. Frontend uploads file directly to S3 using pre-signed URL
4. Frontend calls content API (video/document) with S3 key and CloudFront URL
5. Backend saves metadata to database

### Database Schema
- **Course**: Main course record with metadata
- **CourseSection**: Section within a course (type: VIDEO/DOCUMENT/RICH_TEXT/QUIZ)
- **Video**: Video content linked to section
- **Document**: Document content linked to section
- **RichTextLesson**: HTML content linked to section
- **Quiz**: Quiz linked to section
- **QuizQuestion**: Question within quiz
- **QuizAnswer**: Answer option for question

## Files Modified

### Frontend
- `/src/pages/CourseBuilder.jsx` - Complete rewrite with API integration
  - Course list with real data
  - Full Editor component with save functionality
  - SectionEditor component with upload and content editing
  - ReactQuill integration for rich text
  - Quiz builder with MCQ interface

### No Backend Changes Needed
All backend APIs were already implemented in previous work:
- Course CRUD operations
- Section management
- Content type APIs (videos, documents, rich text, quizzes)
- Storage service with S3 pre-signed URLs

## Testing Checklist

- [x] Create new course and save to database
- [x] Edit course details and update
- [x] Add video section with file upload
- [x] Add document section with file upload
- [x] Add rich text section with formatted content
- [x] Add quiz with multiple questions and MCQ answers
- [x] Delete section
- [x] Publish course
- [x] Course appears in list with correct status
- [x] Sections load when editing existing course

## Known Limitations

1. **Section Reordering**: Drag-and-drop UI is present but not yet wired to API call
2. **Video Progress**: Video duration not auto-detected, needs manual entry
3. **Quiz Updates**: Editing existing questions requires deleting and re-adding
4. **Document Preview**: No preview available in editor (learners will see it)

## Future Enhancements

1. **Rich Preview Mode**: Show how course looks to learners
2. **Bulk Upload**: Upload multiple documents/videos at once
3. **Video Transcoding**: Auto-convert videos to streaming format
4. **Quiz Import**: Import questions from CSV/JSON
5. **Content Library**: Reuse videos/documents across courses
6. **Analytics**: Track which sections learners struggle with

## Support

For issues or questions:
1. Check server logs: Terminal running `npm run dev:server`
2. Check browser console: F12 → Console tab
3. Verify backend is running on http://localhost:3001
4. Verify frontend is running on http://localhost:5173

## Quick Start Commands

```powershell
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
npm run dev:client
```

Then navigate to http://localhost:5173 and log in as admin to access Course Builder.
