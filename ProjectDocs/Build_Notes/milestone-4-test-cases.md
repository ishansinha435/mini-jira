# Milestone 4 Test Cases — Task Detail + Comments

**Objective:** Verify task detail page displays correctly with editable fields and comments functionality.

**Test Date:** TBD (after Milestone 4 implementation)

---

## Test Environment Setup

### Prerequisites
- [ ] Milestone 3 completed (tasks working)
- [ ] Supabase comments table created
- [ ] RLS policies enabled on comments
- [ ] At least one test project with tasks available
- [ ] Development server running

### Database Schema to Verify
```sql
-- comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  body TEXT NOT NULL CHECK (char_length(body) > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
```

---

## 1. Database Setup Tests (3 tests)

### TC-1.1: Comments Table Exists
**Priority:** High  
**Type:** Database Test

**Steps:**
1. Connect to Supabase dashboard
2. Navigate to Table Editor
3. Verify `comments` table exists

**Expected Result:**
- Table visible with all columns (id, task_id, owner_id, body, created_at)
- Foreign key to tasks with CASCADE delete
- Foreign key to auth.users
- Check constraint on body (non-empty)

**Status:** ☐ Pass ☐ Fail

---

### TC-1.2: RLS Enabled on Comments
**Priority:** High  
**Type:** Security Test

**Steps:**
1. Check RLS status on comments table
2. Verify policies exist

**Expected Result:**
- RLS enabled
- At least 3 policies (SELECT, INSERT, DELETE)
- Policies enforce owner_id = auth.uid()

**Status:** ☐ Pass ☐ Fail

---

### TC-1.3: Cascade Delete Comments with Task
**Priority:** Medium  
**Type:** Database Test

**Steps:**
1. Create task with comments
2. Delete the task
3. Verify comments are also deleted

**Expected Result:**
- CASCADE delete works
- No orphaned comments remain

**Status:** ☐ Pass ☐ Fail

---

## 2. Task Detail Page Tests (8 tests)

### TC-2.1: Navigate to Task Detail from Task Card
**Priority:** High  
**Type:** Navigation Test

**Steps:**
1. Navigate to project page
2. Click on a task card/title
3. Verify redirect to `/app/tasks/[id]`

**Expected Result:**
- URL changes to `/app/tasks/[taskId]`
- Task detail page loads
- Task title displays correctly

**Status:** ☐ Pass ☐ Fail

---

### TC-2.2: Task Detail Page Displays All Fields
**Priority:** High  
**Type:** UI Test

**Steps:**
1. Navigate to task detail page
2. Verify all task fields are visible

**Expected Result:**
- Task title (large, prominent)
- Task description (if exists)
- Status dropdown
- Priority dropdown
- Due date display
- Project name (as link)
- Created/updated timestamps

**Status:** ☐ Pass ☐ Fail

---

### TC-2.3: Back Navigation Works
**Priority:** High  
**Type:** Navigation Test

**Steps:**
1. Navigate to task detail page
2. Click "← Back to [Project Name]" link
3. Verify return to project page

**Expected Result:**
- Navigation works
- Returns to correct project page
- Project tasks still visible

**Status:** ☐ Pass ☐ Fail

---

### TC-2.4: Task Not Found Returns 404
**Priority:** Medium  
**Type:** Error Handling Test

**Steps:**
1. Navigate to `/app/tasks/fake-uuid-12345`
2. Verify 404 page displays

**Expected Result:**
- 404 Not Found page
- No error in console
- User can navigate away

**Status:** ☐ Pass ☐ Fail

---

### TC-2.5: Update Task Status from Detail Page
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Navigate to task detail page
2. Change status dropdown (e.g., Todo → In Progress)
3. Verify update

**Expected Result:**
- Status updates in database
- UI updates immediately
- Success toast shows
- Status badge color changes

**Status:** ☐ Pass ☐ Fail

---

### TC-2.6: Update Task Priority from Detail Page
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Navigate to task detail page
2. Change priority dropdown (e.g., Medium → High)
3. Verify update

**Expected Result:**
- Priority updates in database
- UI updates immediately
- Success toast shows (optional)
- Priority indicator changes

**Status:** ☐ Pass ☐ Fail

---

### TC-2.7: Update Task Due Date
**Priority:** Medium  
**Type:** Integration Test

**Steps:**
1. Navigate to task detail page
2. Change due date field
3. Verify update

**Expected Result:**
- Due date updates in database
- UI reflects new date
- Overdue indicators work correctly

**Status:** ☐ Pass ☐ Fail

---

### TC-2.8: Project Link Navigation
**Priority:** Low  
**Type:** Navigation Test

**Steps:**
1. Navigate to task detail page
2. Click project name link
3. Verify navigation to project page

**Expected Result:**
- Navigates to correct project page
- Project tasks visible

**Status:** ☐ Pass ☐ Fail

---

## 3. Comments Tab Tests (10 tests)

### TC-3.1: Comments Tab Displays Comment Count
**Priority:** High  
**Type:** UI Test

**Steps:**
1. Navigate to task detail page with comments
2. Check "Comments" tab header

**Expected Result:**
- Shows "Comments (X)" where X = count
- Count is accurate
- Updates when comments added/removed

**Status:** ☐ Pass ☐ Fail

---

### TC-3.2: Add Comment Successfully
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Navigate to task detail page
2. Click "Comments" tab
3. Type comment in textarea
4. Click "Comment" button

**Expected Result:**
- Comment saves to database
- Comment appears in list immediately
- Textarea clears
- Success toast (optional)
- Comment count updates

**Status:** ☐ Pass ☐ Fail

---

### TC-3.3: Empty Comment Validation
**Priority:** High  
**Type:** Validation Test

**Steps:**
1. Navigate to Comments tab
2. Try to submit empty comment
3. Verify validation

**Expected Result:**
- Submit button disabled OR
- Error message shows
- No empty comment saved

**Status:** ☐ Pass ☐ Fail

---

### TC-3.4: Comments Display in Correct Order
**Priority:** High  
**Type:** UI Test

**Steps:**
1. Create multiple comments
2. Verify display order

**Expected Result:**
- Comments sorted (newest last per spec)
- Timestamps visible
- User attribution clear

**Status:** ☐ Pass ☐ Fail

---

### TC-3.5: Empty State for No Comments
**Priority:** Medium  
**Type:** UI Test

**Steps:**
1. Navigate to task with no comments
2. Open Comments tab

**Expected Result:**
- Empty state message displays
- "No comments yet. Be the first to comment."
- Comment composer still visible

**Status:** ☐ Pass ☐ Fail

---

### TC-3.6: Comment Character Limit
**Priority:** Medium  
**Type:** Validation Test

**Steps:**
1. Try to add very long comment (>5000 chars)
2. Verify handling

**Expected Result:**
- Character limit enforced OR
- Textarea accepts but truncates OR
- Error message shows

**Status:** ☐ Pass ☐ Fail

---

### TC-3.7: Multiple Comments on Same Task
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Add 3+ comments to same task
2. Verify all display correctly

**Expected Result:**
- All comments visible
- Correct order maintained
- No duplicates
- Count accurate

**Status:** ☐ Pass ☐ Fail

---

### TC-3.8: Comment Timestamps Display
**Priority:** Low  
**Type:** UI Test

**Steps:**
1. Add comment
2. Check timestamp display

**Expected Result:**
- Timestamp shows relative time ("2 minutes ago")
- OR absolute time ("Feb 11, 2026 at 3:45 PM")
- Consistent formatting

**Status:** ☐ Pass ☐ Fail

---

### TC-3.9: Comments Load on Page Load
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Navigate to task with existing comments
2. Verify comments load automatically

**Expected Result:**
- Comments fetched from database
- Display immediately on page load
- No manual refresh needed
- Loading state shown briefly

**Status:** ☐ Pass ☐ Fail

---

### TC-3.10: Optimistic UI for Comments
**Priority:** Low  
**Type:** UX Test

**Steps:**
1. Add comment
2. Observe UI update timing

**Expected Result:**
- Comment appears immediately (optimistic)
- OR brief loading state (<500ms)
- Smooth user experience

**Status:** ☐ Pass ☐ Fail

---

## 4. Attachments Tab Tests (2 tests)

### TC-4.1: Attachments Tab Shows Placeholder
**Priority:** Low  
**Type:** UI Test

**Steps:**
1. Navigate to task detail page
2. Click "Attachments" tab

**Expected Result:**
- Tab is visible but shows placeholder
- "Attachments (0)" count
- Message: "Coming in Milestone 5"

**Status:** ☐ Pass ☐ Fail

---

### TC-4.2: Attachments Count Displays
**Priority:** Low  
**Type:** UI Test

**Steps:**
1. Check "Attachments (X)" tab header

**Expected Result:**
- Shows "Attachments (0)" for now
- Ready for Milestone 5 integration

**Status:** ☐ Pass ☐ Fail

---

## 5. RLS Security Tests (4 tests)

### TC-5.1: User Cannot View Other User's Task Details
**Priority:** High  
**Type:** Security Test

**Steps:**
1. User A creates task
2. User B attempts to access `/app/tasks/[task-id]`
3. Verify access denied

**Expected Result:**
- 404 Not Found OR
- Redirected to dashboard
- Task details not visible

**Status:** ☐ Pass ☐ Fail

---

### TC-5.2: User Cannot View Other User's Comments
**Priority:** High  
**Type:** Security Test

**Steps:**
1. User A adds comment to their task
2. User B queries comments table directly
3. Verify RLS blocks access

**Expected Result:**
- User B cannot see User A's comments
- RLS policy enforces owner_id check

**Status:** ☐ Pass ☐ Fail

---

### TC-5.3: User Cannot Add Comment to Other User's Task
**Priority:** High  
**Type:** Security Test

**Steps:**
1. User A creates task
2. User B attempts to add comment via API
3. Verify blocked

**Expected Result:**
- Comment insert fails
- RLS policy blocks insertion
- Error message returned

**Status:** ☐ Pass ☐ Fail

---

### TC-5.4: User Cannot Delete Other User's Comments
**Priority:** High  
**Type:** Security Test

**Steps:**
1. User A adds comment
2. User B attempts to delete via API
3. Verify blocked

**Expected Result:**
- Delete fails
- RLS policy enforces ownership
- Comment remains in database

**Status:** ☐ Pass ☐ Fail

---

## 6. Responsive Design Tests (3 tests)

### TC-6.1: Task Detail Page on Mobile
**Priority:** Medium  
**Type:** Responsive Test

**Steps:**
1. Resize browser to mobile width (375px)
2. Navigate to task detail page
3. Verify layout

**Expected Result:**
- Two-column layout converts to single column
- All fields accessible
- Tabs work correctly
- No horizontal scroll

**Status:** ☐ Pass ☐ Fail

---

### TC-6.2: Comment Composer on Mobile
**Priority:** Medium  
**Type:** Responsive Test

**Steps:**
1. Open Comments tab on mobile
2. Try to add comment

**Expected Result:**
- Textarea full width
- Button easily tappable
- Keyboard doesn't break layout

**Status:** ☐ Pass ☐ Fail

---

### TC-6.3: Task Detail on Tablet
**Priority:** Low  
**Type:** Responsive Test

**Steps:**
1. Resize to tablet width (768px)
2. Verify task detail page

**Expected Result:**
- Layout adapts gracefully
- Readable text size
- Proper spacing

**Status:** ☐ Pass ☐ Fail

---

## 7. Error Handling Tests (4 tests)

### TC-7.1: Network Error During Comment Submit
**Priority:** Medium  
**Type:** Error Handling Test

**Steps:**
1. Disconnect network
2. Try to add comment
3. Verify error handling

**Expected Result:**
- Error toast shows
- Comment doesn't appear in list
- User can retry

**Status:** ☐ Pass ☐ Fail

---

### TC-7.2: Database Error on Task Load
**Priority:** Medium  
**Type:** Error Handling Test

**Steps:**
1. Simulate database error (pause Supabase temporarily)
2. Navigate to task detail page
3. Verify error handling

**Expected Result:**
- Error state displays
- Helpful error message
- Option to retry

**Status:** ☐ Pass ☐ Fail

---

### TC-7.3: Invalid Task ID in URL
**Priority:** Medium  
**Type:** Error Handling Test

**Steps:**
1. Navigate to `/app/tasks/invalid-id-123`
2. Verify handling

**Expected Result:**
- 404 page OR error message
- No console errors
- Can navigate back

**Status:** ☐ Pass ☐ Fail

---

### TC-7.4: Comment Submit While Logged Out
**Priority:** Low  
**Type:** Error Handling Test

**Steps:**
1. Open task detail page
2. Log out in another tab
3. Try to add comment

**Expected Result:**
- Error message shows
- Redirected to login OR
- Prompted to re-authenticate

**Status:** ☐ Pass ☐ Fail

---

## Test Summary

| Category | Total Tests | Priority High | Priority Medium | Priority Low |
|----------|-------------|---------------|-----------------|--------------|
| Database Setup | 3 | 2 | 1 | 0 |
| Task Detail Page | 8 | 5 | 2 | 1 |
| Comments Tab | 10 | 7 | 2 | 1 |
| Attachments Tab | 2 | 0 | 0 | 2 |
| RLS Security | 4 | 4 | 0 | 0 |
| Responsive Design | 3 | 0 | 2 | 1 |
| Error Handling | 4 | 0 | 3 | 1 |
| **TOTAL** | **34** | **18** | **10** | **6** |

---

## Quick Smoke Test (5 minutes)

Essential tests to run before marking milestone complete:

1. ✅ Navigate from task card to task detail page
2. ✅ Task detail shows all fields correctly
3. ✅ Add a comment successfully
4. ✅ Comment appears in list
5. ✅ Back navigation works
6. ✅ Update task status from detail page
7. ✅ RLS test: User A cannot see User B's task

**Time estimate:** 5-7 minutes

---

## Issues Found

| Issue | Severity | Status | Resolution |
|-------|----------|--------|------------|
|       |          |        |            |

---

**Tested by:** ___________  
**Date:** ___________  
**Status:** ☐ PASS ☐ FAIL
