# Edubloom - Educational Platform

A modern, interactive educational platform designed specifically for university students (17-25 years) to master university-level courses through engaging multimedia content and interactive assessments.

## 📋 Project Overview

Based on the "cahier de charge" (requirements document), Edubloom is a comprehensive platform offering:

### Core Features Implemented
- ✅ **User Management** - Registration, login, profile management
- ✅ **Course Catalog** - Browse 6+ university-level courses with advanced filtering
- ✅ **Interactive Learning** - Structured modules and lessons with video support
- ✅ **Assessment System** - Quizzes with multiple question types
- ✅ **Dashboard** - Personalized learning statistics and progress tracking
- ✅ **Subscription Management** - Free, starter, pro, and premium plans
- ✅ **Support System** - Messages and notifications
- ✅ **Modern UI** - Beautiful, responsive design with animations

### Upcoming Features (AI Implementation - Later)
- 🤖 AI-powered quiz generation
- 🤖 Personalized learning paths
- 🤖 Intelligent content recommendations
- 🤖 Automated exam generation
- 🤖 AI-powered chatbot support

## 🎯 Technology Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend & Database
- **Supabase** - PostgreSQL database + Authentication
- **Supabase Auth** - User authentication and management
- **Row-Level Security (RLS)** - Data protection policies

### Build Tools
- **Vite** - Fast development server
- **TypeScript Compiler** - Type checking
- **ESLint** - Code quality

## 📦 Project Structure

```
src/
├── components/
│   ├── Layout.tsx       # Main layout with navbar and footer
│   └── Navbar.tsx       # Navigation header
├── pages/
│   ├── Home.tsx         # Landing page
│   ├── Login.tsx        # User login
│   ├── Register.tsx     # User registration
│   ├── Dashboard.tsx    # User learning dashboard
│   ├── Courses.tsx      # Course catalog
│   └── CourseDetail.tsx # Individual course view
├── lib/
│   ├── api.ts          # Complete API utilities
│   ├── supabase.ts     # Supabase client
│   └── utils.ts        # Utility functions
├── App.tsx             # Main app component
└── main.tsx            # Entry point

supabase/
├── schema.sql          # Database schema
└── seed.sql           # Test data

public/                # Static assets
dist/                  # Production build
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier available)
- Git

### Installation

1. **Clone the repository**
```bash
cd eduu
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Go to https://supabase.com and create a free account
   - Create a new project
   - Go to Project Settings > API
   - Copy your project URL and anon public key

4. **Create environment file** (`.env.local`)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Set up database schema**
   - In Supabase dashboard, go to SQL Editor
   - Create a new query
   - Copy contents of `supabase/schema.sql`
   - Run the SQL
   - Repeat for `supabase/seed.sql` to add test data

6. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📊 Database Schema

### Tables Structure

#### Users & Profiles
- **profiles** - User profiles with metadata
  - id (UUID) - References auth.users
  - email - User email
  - full_name - User's full name
  - avatar_url - Profile picture
  - created_at - Registration timestamp

#### Learning Content
- **courses** - Educational courses
  - id, title, description, thumbnail_url
  - instructor_id, difficulty, category

- **modules** - Course organizational units
  - id, course_id, title, order_index

- **lessons** - Individual video lessons
  - id, module_id, title, video_url, content
  - duration, order_index, is_free

#### Learning Management
- **enrollments** - User course enrollments
  - user_id, course_id, enrolled_at

- **quizzes** - Assessments for lessons
  - id, lesson_id, title, description, passing_score

- **quiz_questions** - Individual quiz questions
  - id, quiz_id, question_text, question_type (multiple_choice, short_answer, true_false)

- **quiz_options** - Answer choices for questions
  - id, question_id, option_text, is_correct

- **quiz_submissions** - User quiz attempts
  - id, quiz_id, user_id, score, passed, submitted_at

#### User Management
- **subscriptions** - User subscription plans
  - id, user_id, plan_type (free, starter, pro, premium)
  - status, start_date, end_date

- **messages** - Support tickets
  - id, user_id, title, content, status (open, in_progress, resolved)

- **notifications** - User notifications
  - id, user_id, title, message, read, created_at

### Security
All tables have Row-Level Security (RLS) policies enabling:
- Users can only view their own data
- Authenticated users can access public content (courses, lessons)
- Instructors can manage their courses

## 🧪 Test Data

The `supabase/seed.sql` file includes comprehensive test data:

### Test Users
- **John Doe** (john.doe@example.com) - Student
- **Jane Smith** (jane.smith@example.com) - Student  
- **Professor Teacher** (prof.teacher@example.com) - Instructor

### Test Courses (6 total)
1. **Mathematics: Calculus I** (Beginner)
   - 2 modules, 2 lessons
   - Topics: Limits, Derivatives

2. **Physics: Mechanics** (Intermediate)
   - 2 modules, 2 lessons
   - Topics: Kinematics, Forces

3. **Chemistry: Organic Chemistry** (Advanced)
   - 1 module, 1 lesson
   - Topics: Organic Chemistry Basics

4. **Biology: Human Anatomy** (Intermediate)
   - 1 module, 1 lesson
   - Topics: Skeletal System

5. **History: World War II** (Beginner)
   - Test course without detailed content

6. **Literature: Shakespeare** (Beginner)
   - Test course without detailed content

### Test Quizzes
- 4 quizzes with multiple question types
- Sample questions on limits, derivatives, kinematics
- Mix of multiple choice, true/false questions
- Correct answers configured for validation

## 🔑 API Functions

The `src/lib/api.ts` file provides complete data access:

```typescript
// Courses
getCourses(filters?: { category?, difficulty?, search? })
getCourseById(id: string)

// Learning
getUserEnrollments(userId: string)
enrollCourse(userId: string, courseId: string)
getLessonsByModule(moduleId: string)
getLessonById(id: string)

// Assessments
getQuizzesByLesson(lessonId: string)
submitQuiz(quizId: string, userId: string, score: number, passed: boolean)
getUserQuizSubmissions(userId: string)

// User Management
getUserSubscription(userId: string)
getUserNotifications(userId: string)
markNotificationAsRead(notificationId: string)
getUserMessages(userId: string)
createMessage(userId: string, title: string, content: string)
getUserProfile(userId: string)
updateUserProfile(userId: string, updates: { full_name?, avatar_url? })

// Analytics
getDashboardStats(userId: string)
```

## 🎨 UI/UX Features

### Design System
- Modern gradient backgrounds
- Smooth animations with Framer Motion
- Responsive grid layouts
- Dark mode support
- Consistent color scheme with primary/secondary/accent colors

### Components
- **Navigation** - Fixed header with mobile hamburger menu
- **Hero Section** - Eye-catching landing page
- **Feature Cards** - Hover effects and animations
- **Course Cards** - Image previews, difficulty badges, action buttons
- **Dashboard** - Statistics grid, enrolled courses, notifications
- **Curriculum** - Collapsible modules with lesson details
- **Footer** - Multi-column layout with contact info and links

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly buttons and spacing
- Proper viewport scaling

## 🔄 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Check code quality
npm run lint
```

## 📝 Pages Overview

### Home Page
- Hero section with value proposition
- Feature highlights
- Call-to-action buttons
- Responsive layout

### Authentication
- **Login** - Email + password authentication
- **Register** - New user registration with profile setup
- Error handling and validation

### Dashboard
- Welcome greeting
- Statistics grid (enrolled courses, quizzes passed, average score, subscription)
- Currently enrolled courses carousel
- Recent notifications panel
- Quick action buttons

### Courses Catalog
- Full course listing
- Advanced filtering:
  - By category (6 categories)
  - By difficulty level (3 levels)
  - By search keywords
- Course cards with:
  - Thumbnail images
  - Difficulty badges
  - Category tags
  - Enrollment button
  - Details link

### Course Detail
- Hero section with course thumbnail
- Course title, description, and metadata
- Statistics (lessons, hours, modules)
- Collapsible curriculum
- Module expansion to show lessons
- Lesson details (duration, free/premium indicator)
- Watch/Sign In buttons
- Sidebar with enrollment benefits
- Certificate and support information

## 🔐 Authentication

The platform uses Supabase Auth with:
- Email + password authentication
- Automatic profile creation on signup
- Session management
- Protected routes (dashboard requires login)

## 📱 Responsive Breakpoints

- **Mobile** - < 768px (full width layouts)
- **Tablet** - 768px - 1024px (2-column grids)
- **Desktop** - > 1024px (3+ column grids)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The `dist/` folder contains the production-ready files.

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🐛 Troubleshooting

### Supabase Connection Issues
1. Verify environment variables are set correctly
2. Check Supabase project URL and keys
3. Ensure database is running
4. Check browser console for errors

### Build Errors
```bash
# Clear build artifacts
rm -rf dist/ node_modules/.vite

# Rebuild
npm run build
```

### Type Errors
```bash
# Ensure TypeScript is properly configured
npm run lint
```

## 📖 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [React Router](https://reactrouter.com)

## 🎓 Learning Path

### Getting Started with the Codebase
1. Understand the project structure
2. Review the database schema in `supabase/schema.sql`
3. Study the API functions in `src/lib/api.ts`
4. Explore page components in `src/pages/`
5. Review styling patterns in components

### Common Development Tasks
- **Add a new course** - Use API functions to insert into database
- **Create a quiz** - Use Quiz table + questions + options
- **Style a component** - Use Tailwind classes + Framer Motion
- **Add authentication** - Use Supabase Auth utilities

## 📋 Testing Checklist

- [ ] User can register and login
- [ ] Dashboard shows correct statistics
- [ ] Course catalog loads and filters work
- [ ] Search functionality finds courses
- [ ] Course detail page shows full curriculum
- [ ] Users can enroll in courses
- [ ] Notifications appear correctly
- [ ] Responsive design works on mobile

## 🌟 Future Enhancements

### Short Term
- Video lesson player component
- Quiz answering interface
- Progress tracking
- Certificate generation

### Medium Term
- Live chat support
- Discussion forums
- Mobile app (React Native)
- Email notifications

### Long Term
- 🤖 AI-powered features (as per requirements)
- Video generation and processing
- Payment system integration
- Analytics dashboard

## 📄 License

This project is proprietary and developed for Edubloom Inc.

## 👥 Contact & Support

- **Project Lead**: Development Team
- **Issues**: Report via project management system
- **Questions**: Check documentation first, then contact team

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Status**: Active Development
