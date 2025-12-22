# Quick Start Guide - Edubloom Platform

## ⚡ 5-Minute Setup

### Step 1: Supabase Setup (2 minutes)
1. Go to [supabase.com](https://supabase.com)
2. Sign up for free account
3. Create a new project
4. Go to **Settings > API** and copy:
   - Project URL
   - `anon` public key

### Step 2: Environment Configuration (1 minute)
Create `.env.local` in project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 3: Database Setup (1 minute)
1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy all content from `supabase/schema.sql`
4. Run the query
5. Repeat steps 2-4 with `supabase/seed.sql` (for test data)

### Step 4: Start Development (1 minute)
```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser! 🎉

## 🧪 Test Account Credentials

After running `seed.sql`, use these to login:

| Email | Password | Role |
|-------|----------|------|
| john.doe@example.com | password | Student |
| jane.smith@example.com | password | Student |
| prof.teacher@example.com | password | Instructor |

**Note:** You need to set these passwords in Supabase Auth manually, OR sign up with the Register form to create new test accounts.

## 📚 Test Data Included

After running seed.sql, you'll have:
- **6 courses** across different subjects
- **12+ lessons** with video URLs and descriptions  
- **4 quizzes** with multiple choice and true/false questions
- **User enrollments** and subscription data
- **Notifications** and support messages

## 🗺️ Application Map

```
Landing Page (Home)
├── Features showcase
├── Call-to-action
└── Navigation to other pages

Authentication
├── Login (/login)
└── Register (/register)

Main App (Requires Login)
├── Dashboard (/dashboard)
│   ├── Learning statistics
│   ├── Enrolled courses
│   └── Notifications
├── Courses Catalog (/courses)
│   ├── Filter by category
│   ├── Filter by difficulty
│   └── Search
└── Course Detail (/course/:id)
    ├── Full curriculum
    ├── Module expansion
    ├── Lesson listings
    └── Enrollment options
```

## 🎯 What You Can Do

### Users Can:
- ✅ Sign up with email
- ✅ Browse all 6 test courses
- ✅ Filter courses by category and difficulty
- ✅ Search for courses
- ✅ View detailed course content
- ✅ See module and lesson structure
- ✅ Enroll in courses
- ✅ View personalized dashboard
- ✅ See learning statistics
- ✅ Read notifications
- ✅ Update profile

### Admin/Backend Can:
- ✅ Manage courses in database
- ✅ Create quizzes and questions
- ✅ Track user progress
- ✅ Manage subscriptions
- ✅ Send notifications

## 📁 Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/api.ts` | All data fetching functions |
| `src/pages/Dashboard.tsx` | User learning dashboard |
| `src/pages/Courses.tsx` | Course catalog with filters |
| `src/pages/CourseDetail.tsx` | Individual course view |
| `supabase/schema.sql` | Database structure |
| `supabase/seed.sql` | Test data (6 courses, quizzes, etc.) |

## 🔧 Common Tasks

### Add New Course (via Supabase)
```sql
INSERT INTO courses (title, description, difficulty, category) 
VALUES ('New Course', 'Description', 'beginner', 'Mathematics');
```

### Create Test User Manually
1. In Supabase Dashboard → Authentication
2. Click **Add User**
3. Enter email and password
4. User's profile auto-creates from trigger

### Enable User Enrollment
Users can enroll by clicking "Enroll Now" on course pages. Data saves to `enrollments` table.

### View Quiz Submissions
Check `quiz_submissions` table to see which users passed which quizzes.

## 🐛 Troubleshooting

### "Cannot find module" Error
```bash
npm install
npm run build
```

### Supabase Connection Failed
- Check `.env.local` has correct URL and key
- Verify Supabase project is running
- Check browser console (F12) for detailed errors

### Blank Page After Login
- Ensure Dashboard.tsx file exists
- Check browser console for errors
- Verify database connection works

### Quiz Data Not Showing
- Run `supabase/seed.sql` to populate test quizzes
- Check that quizzes are linked to lessons

## 📊 Database Tables Quick Reference

**User Management:**
- `profiles` - User info
- `subscriptions` - User plans

**Learning Content:**
- `courses` - Course listings
- `modules` - Course sections
- `lessons` - Individual videos

**Progress Tracking:**
- `enrollments` - Who took what
- `quiz_submissions` - Quiz results

**Communication:**
- `notifications` - User notifications
- `messages` - Support tickets

## 🎨 Customization Tips

### Change Colors
Edit Tailwind config or use `bg-primary`, `text-primary` classes throughout.

### Add Logos/Images
Replace image URLs in components or supabase seed data.

### Modify Course Categories
Update the `CATEGORIES` array in `src/pages/Courses.tsx`

### Change Subscription Plans
Update plan types in `supabase/schema.sql` and database INSERT statements.

## 📈 Next Steps

1. **Explore the code** - Review page components and API functions
2. **Customize test data** - Modify courses in `supabase/seed.sql`
3. **Add features** - Use the existing API patterns to add new functionality
4. **Implement AI features** - When ready, integrate AI quiz generation, etc.
5. **Deploy** - Push to Vercel, Netlify, or your preferred platform

## 🆘 Getting Help

1. Check the comprehensive **README_FULL.md** for detailed documentation
2. Review **SETUP_GUIDE.md** for architecture details
3. Examine `src/lib/api.ts` for available data functions
4. Check Supabase documentation for database queries
5. Review React/TypeScript docs for component patterns

## 🎓 Learning Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**You're all set!** 🚀 The platform is ready for testing and development. Start with login, explore courses, and enjoy the platform!
