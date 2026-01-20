# Support System Testing Guide

## Overview
The support system has been fully implemented with:
- User contact form ("Get Help" button)
- Admin dashboard to manage support requests
- Real-time notifications for admin responses
- Support messages history page

## Test Scenarios

### Scenario 1: User Submits Support Request
1. **Login as regular user**
   - Navigate to any page with the navbar
   
2. **Click "Get Help" button**
   - Button is in the bottom-right corner (ContactAdminForm component)
   - Modal should appear with semi-transparent dark background (bg-black/40)
   - Modal should be centered and white
   
3. **Fill out the form**
   - Enter Subject (e.g., "Course Navigation Issue")
   - Enter Message (e.g., "I can't find the lesson details page")
   - Click "Send" button
   
4. **Verify success**
   - Success message should appear: "Message Sent!"
   - Message should be saved to database (messages table)
   - User ID should be automatically attached

### Scenario 2: Admin Views Support Requests
1. **Login as admin user**
   - Navigate to admin dashboard (/admin)
   
2. **Scroll to Support Messages section**
   - AdminSupport component displays all messages
   - Messages are grouped by status: open, in_progress, resolved
   
3. **Select a message**
   - Click on a message card to view details
   - Full message content should display in the detail pane
   - Previous admin replies should appear in a scrollable section

### Scenario 3: Admin Sends Reply to User
1. **From the message detail pane (after selecting a message)**
   - Scroll to "Reply Form" at bottom
   - Type response in textarea (e.g., "Go to Courses tab and select the course...")
   - Click "Send Reply" button
   
2. **Verify immediate update**
   - Form should clear
   - Message list should refresh
   - The selected message should show the new reply immediately
   - Reply text should display in "Admin Replies" section with timestamp
   
3. **Automatic processes triggered**
   - Notification created in notifications table
   - Message status updated to "in_progress"
   - Admin ID recorded in message

### Scenario 4: User Receives Notification
1. **From user's perspective (after admin sends reply)**
   - Notification bell icon in navbar should show red badge with count
   - Badge number increases (e.g., "1" if first notification)
   
2. **Click notification bell**
   - Dropdown opens showing notifications
   - Notification should display:
     - Title: "Admin Response to Your Support Request"
     - Message: The admin's reply text
     - Date/time: When the reply was created
   - Unread notifications have blue background
   - Blue dot indicator next to unread items
   
3. **Mark as read**
   - Click notification → marked as read (gray background)
   - Badge count decreases
   - Or click "Mark all as read" → all notifications marked

### Scenario 5: User Views Support History
1. **Click on notification**
   - Should navigate to /support-messages page
   - Or use "View all support messages →" link in notification dropdown
   
2. **Support messages page (MySupportMessages)**
   - Shows all user's support requests
   - Each request card shows:
     - Subject
     - Message preview
     - Creation date
     - Status badge (open/in_progress/resolved)
   
3. **Expand message to see replies**
   - Click on a message card to expand
   - Shows full message content
   - Shows all admin replies below
   - Each reply includes admin name and timestamp

### Scenario 6: Admin Updates Message Status
1. **In AdminSupport component**
   - Next to each message, there are status buttons
   - Buttons: "Open", "In Progress", "Resolved"
   
2. **Click status button**
   - Message status updates in database
   - Button highlighting changes
   - List is refreshed to show new status

## Database Schema

### messages table (new columns added)
- `id` - UUID, primary key
- `user_id` - UUID, foreign key to auth.users
- `title` - Text, subject of the message
- `content` - Text, message body
- `status` - Enum: open, in_progress, resolved
- `admin_id` - UUID, foreign key to auth.users (admin handling it)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### support_replies table (new)
- `id` - UUID, primary key
- `message_id` - UUID, foreign key to messages
- `admin_id` - UUID, foreign key to auth.users
- `reply_text` - Text, admin's response
- `created_at` - Timestamp
- `updated_at` - Timestamp

### notifications table (new)
- `id` - UUID, primary key
- `user_id` - UUID, foreign key to auth.users
- `title` - Text, notification title
- `message` - Text, notification content
- `read` - Boolean, read status
- `created_at` - Timestamp
- `updated_at` - Timestamp

## API Functions

### User-facing functions
- `createSupportMessage(userId, title, content)` - Submit support request
- `getUserSupportMessages(userId)` - Get user's own messages
- `getNotifications(userId)` - Get user's notifications
- `markNotificationAsRead(notificationId)` - Mark notification as read

### Admin functions
- `getSupportMessages()` - Get all support messages (admin only)
- `getSupportMessageById(messageId)` - Get single message with replies
- `createSupportReply(messageId, adminId, replyText)` - Admin sends reply
- `updateMessageStatus(messageId, status)` - Update message status

## Known Issues & Solutions

### Modal shows pure black instead of semi-transparent overlay
**Solution**: Using `bg-black/40` for semi-transparent dark background.
- If still too dark, adjust the opacity value (e.g., `bg-black/30` for more transparency)
- Ensure Tailwind CSS is properly compiled

### Notifications not showing real admin responses
**Solution**: 
- `createSupportReply()` automatically creates a notification with the reply text
- Notifications table stores the admin response in the `message` field
- NotificationCenter component displays `notif.title` and `notif.message`
- Check browser console for any fetch errors

### Admin responses not displaying immediately after submission
**Solution**:
- `handleSendReply` now calls `getSupportMessageById` after sending
- This refetches the message with all support_replies
- `setSelectedMessage` updates the UI with new reply visible

## Deployment Checklist

Before deploying to production:
- [ ] Database migration `add_support_replies.sql` has been applied
- [ ] RLS policies are enabled on:
  - messages table
  - support_replies table
  - notifications table
- [ ] Test creating a message as user
- [ ] Test sending reply as admin
- [ ] Verify notification appears for user
- [ ] Test clicking notification → shows reply in message detail
- [ ] Test marking notification as read → badge updates
- [ ] Run `npm run build` → no errors

## Environment Variables
No new environment variables needed - uses existing Supabase configuration.

## File Structure
```
src/
├── components/
│   ├── ContactAdminForm.tsx       # User contact form modal
│   ├── AdminSupport.tsx           # Admin dashboard section
│   ├── NotificationCenter.tsx     # Notification bell & dropdown
│   └── Navbar.tsx                 # "Get Help" button added
├── pages/
│   ├── AdminDashboard.tsx         # Added AdminSupport component
│   └── MySupportMessages.tsx      # User support messages page
├── lib/
│   └── api.ts                     # 8 new support functions
└── App.tsx                        # Route for /support-messages
```

## Troubleshooting

### Build fails with TypeScript errors
```bash
npm run build
# Should show "✓ built in X.XXs"
# Check for unused imports or type mismatches
```

### Database migration not applied
```sql
-- In Supabase, run the SQL from supabase/migrations/add_support_replies.sql
-- Verify new tables exist:
SELECT * FROM information_schema.tables 
WHERE table_name IN ('messages', 'support_replies', 'notifications');
```

### Notifications not appearing
1. Check database: `SELECT * FROM notifications WHERE user_id = 'YOUR_USER_ID'`
2. Check browser console for fetch errors
3. Verify admin ID is correct when creating reply
4. Ensure auto-refresh interval is running (10 seconds)

### Modal appearance issues
- Clear browser cache: Ctrl+Shift+Delete
- Check if Tailwind CSS is loaded: Open DevTools → check CSS files
- Verify `tailwind.config.js` includes the `src/` directory

