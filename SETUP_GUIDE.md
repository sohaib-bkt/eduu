# Edubloom Platform - Setup & Test Guide

## Overview
Edubloom is a comprehensive educational platform designed for university students (17-25 years old) to master courses through interactive learning, animated videos, quizzes, and AI-powered assessments.

## Project Structure

### Pages
- **Home** (`src/pages/Home.tsx`) - Landing page with features overview
- **Login** (`src/pages/Login.tsx`) - User authentication
- **Register** (`src/pages/Register.tsx`) - New user registration
- **Dashboard** (`src/pages/Dashboard.tsx`) - User learning dashboard with stats and enrolled courses
- **Courses** (`src/pages/Courses.tsx`) - Course catalog with filtering and search
- **CourseDetail** (`src/pages/CourseDetail.tsx`) - Individual course view with curriculum

### Components
- **Layout** (`src/components/Layout.tsx`) - Main layout with navbar and footer
- **Navbar** (`src/components/Navbar.tsx`) - Navigation header with auth controls

### Libraries
- **api.ts** (`src/lib/api.ts`) - Complete API utility functions for all data operations
- **supabase.ts** (`src/lib/supabase.ts`) - Supabase client initialization
- **utils.ts** (`src/lib/utils.ts`) - Utility functions

## Database Schema

### Tables Created
1. **profiles** - User profiles with email, full name, avatar
2. **courses** - Course listings with metadata
3. **modules** - Course modules (organizational units)
4. **lessons** - Individual video lessons within modules
5. **enrollments** - User course enrollments
6. **quizzes** - Assessments for lessons
7. **quiz_questions** - Quiz questions (multiple choice, short answer, true/false)
8. **quiz_options** - Answer options for quiz questions
9. **quiz_submissions** - User quiz attempt records
10. **subscriptions** - User subscription plans (free, starter, pro, premium)
11. **messages** - User support messages
12. **notifications** - User notifications

## Test Data

A comprehensive seed.sql file has been created with test data including:

### Test Users (Profiles)
- John Doe (john.doe@example.com)
- Jane Smith (jane.smith@example.com)
- Professor Teacher (prof.teacher@example.com) - Instructor

### Test Courses
- Mathematics: Calculus I (beginner)
- Physics: Mechanics (intermediate)
- Chemistry: Organic Chemistry (advanced)
- Biology: Human Anatomy (intermediate)
- History: World War II (beginner)
- Literature: Shakespeare (beginner)

### Test Modules & Lessons
- Each course has 2 modules
- Each module has 1-2 lessons
- Sample lesson durations: 20-30 minutes
- Mix of free and premium content

### Test Quizzes
- Quizzes for key lessons
- Multiple choice, true/false questions
- Sample passing scores: 70%

### Test Data Loading

To load test data into your Supabase instance:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/seed.sql`
4. Execute the SQL

## Features Implemented

### User Space
✅ User registration and login with Supabase Auth
✅ Profile management (via API utilities)
✅ Personal dashboard with learning statistics
✅ Personalized dashboard displaying:
  - Enrolled courses count
  - Quizzes passed
  - Average score
  - Current subscription plan
  - Recent notifications

### Course Catalog
✅ Browse all courses
✅ Filter by category (Mathematics, Physics, Chemistry, Biology, History, Literature)
✅ Filter by difficulty level (beginner, intermediate, advanced)
✅ Search courses by title/description
✅ Course cards with thumbnail, description, difficulty badge
✅ Enrollment functionality

### Course Learning
✅ Detailed course view with full curriculum
✅ Module organization with lesson listings
✅ Video lessons with duration info
✅ Free vs. premium content indicators
✅ Course statistics (total hours, lessons, modules)
✅ Interactive curriculum display

### Evaluation System
✅ Quiz system database structure
✅ Multiple question types support
✅ Quiz submission tracking
✅ Score and pass/fail recording

### Support & Communication
✅ Notifications system
✅ Messages/support tickets
✅ Admin support structure

### Payment System
✅ Subscription management
✅ Plan types (free, starter, pro, premium)
✅ Subscription status tracking

## API Functions Available

```typescript
// Courses
getCourses(filters?: { category?, difficulty?, search? })
getCourseById(id: string)

// Enrollments
getUserEnrollments(userId: string)
enrollCourse(userId: string, courseId: string)

// Lessons
getLessonsByModule(moduleId: string)
getLessonById(id: string)

// Quizzes
getQuizzesByLesson(lessonId: string)
submitQuiz(quizId: string, userId: string, score: number, passed: boolean)
getUserQuizSubmissions(userId: string)

// Subscriptions
getUserSubscription(userId: string)

// Notifications
getUserNotifications(userId: string)
markNotificationAsRead(notificationId: string)

// Messages
getUserMessages(userId: string)
createMessage(userId: string, title: string, content: string)

// Profile
getUserProfile(userId: string)
updateUserProfile(userId: string, updates: { full_name?, avatar_url? })

// Dashboard Stats
getDashboardStats(userId: string)
```

## UI/UX Improvements Made

### Design System
✅ Tailwind CSS + custom theme colors
✅ Dark mode support
✅ Responsive design (mobile, tablet, desktop)
✅ Smooth animations using Framer Motion

### Navigation
✅ Modern fixed navbar with logo
✅ Mobile hamburger menu
✅ Authentication state handling
✅ Quick navigation links

### Components
✅ Feature cards with hover effects
✅ Course catalog with advanced filtering
✅ Course detail pages with collapsible curriculum
✅ Dashboard with statistics grid
✅ Notification panel
✅ Action buttons with loading states

### Footer
✅ Multi-column footer with links
✅ Social media integration
✅ Contact information
✅ Legal links

## Backend Optimizations

### Security
✅ Row-level security (RLS) policies on all tables
✅ User isolation - users can only access their own data
✅ Email verification for registration

### Data Integrity
✅ Foreign key relationships between tables
✅ Cascade delete for related records
✅ Unique constraints (e.g., one subscription per user)
✅ Proper data types and nullability constraints

### Query Optimization
✅ Indexed lookup tables
✅ Efficient joins using referenced relationships
✅ Pagination-ready structure

## Future Enhancements (AI Features - Later)

- 🤖 AI-powered quiz generation
- 🤖 Personalized learning recommendations
- 🤖 Automated exam generation
- 🤖 Smart content suggestions
- 🤖 AI-powered chat support

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env.local with your Supabase keys
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_anon_key

# Run development server
npm run dev

# Build for production
npm run build
```

### Testing the Platform

1. **Create Test Users**
   - Go to Supabase Auth → Users
   - Add test users matching seed data emails
   - Or use the registration form in the app

2. **Load Test Data**
   - Run `supabase/seed.sql` in Supabase SQL Editor
   - This populates all courses, modules, lessons, quizzes

3. **Test Features**
   - Sign in with test credentials
   - View dashboard
   - Browse course catalog
   - Filter courses
   - View course details
   - Enroll in courses

## File Changes Summary

### New Files Created
- `src/pages/Dashboard.tsx` - Full dashboard implementation
- `src/pages/Courses.tsx` - Courses catalog with filters
- `src/pages/CourseDetail.tsx` - Course detail view
- `src/lib/api.ts` - Complete API layer
- `supabase/seed.sql` - Test data

### Modified Files
- `src/App.tsx` - Added new routes
- `src/pages/Home.tsx` - Fixed imports
- `src/components/Layout.tsx` - Enhanced footer
- `supabase/schema.sql` - Added quiz, subscription, messaging tables

## Notes

- All AI features have been left for later as requested
- The platform uses Supabase for authentication and database
- The UI follows a modern design system with Tailwind CSS
- All pages are fully responsive
- Test data includes diverse course categories and difficulty levels
- The seed data file can be re-run to reset test data

## Support

For questions or issues:
1. Check Supabase documentation
2. Review the API functions in `src/lib/api.ts`
3. Check component props and state management
4. Verify environment variables are set correctly
