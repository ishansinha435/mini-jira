# Milestone 2 Test Cases — Projects CRUD

**Objective:** Verify project creation, listing, updating, deletion, and RLS policies work correctly.

**Test Date:** TBD (after Milestone 2 implementation)

---

## Test Environment Setup

### Prerequisites
- [ ] Milestone 1 completed (authentication working)
- [ ] Supabase projects table created
- [ ] RLS policies enabled and configured
- [ ] Development server running (`npm run dev`)
- [ ] At least one test user account available

### Database Schema to Verify
```sql
-- projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS enabled
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies (user can only see their own projects)
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = owner_id);
```

---

## 1. Database Setup Tests

### TC-1.1: Projects Table Exists
**Priority:** High  
**Type:** Database Test

**Steps:**
1. Connect to Supabase dashboard
2. Navigate to Table Editor
3. Verify `projects` table exists

**Expected Result:**
- Table `projects` is visible
- Columns match schema: id, owner_id, name, created_at
- Correct data types and constraints

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-1.2: RLS Enabled on Projects Table
**Priority:** High  
**Type:** Security Test

**Steps:**
1. Supabase dashboard → Table Editor → projects
2. Check RLS status (should show "RLS enabled")
3. Verify policies are listed

**Expected Result:**
- RLS is enabled
- At least 4 policies exist (SELECT, INSERT, UPDATE, DELETE)
- Each policy references `auth.uid() = owner_id`

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-1.3: Foreign Key Constraint on owner_id
**Priority:** Medium  
**Type:** Database Test

**Steps:**
1. Check table schema
2. Verify `owner_id` has foreign key to `auth.users(id)`
3. Attempt to insert project with invalid owner_id (should fail)

**Expected Result:**
- Foreign key constraint exists
- Cannot create project with non-existent owner_id
- Database enforces referential integrity

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 2. Project Creation Tests

### TC-2.1: Create Project Successfully (Happy Path)
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Log in to the app
2. Navigate to dashboard (`/app`)
3. Click "+ New Project" button
4. Enter project name: "Test Project 1"
5. Submit form

**Expected Result:**
- Modal/dialog closes
- Success toast notification shown
- New project appears in project list
- Project has correct name
- Project stored in database with correct owner_id

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-2.2: Create Project with Empty Name
**Priority:** High  
**Type:** Validation Test

**Steps:**
1. Open "New Project" modal
2. Leave name field empty
3. Attempt to submit

**Expected Result:**
- Form validation error shown
- Error message: "Project name is required" or similar
- Form cannot be submitted
- No project created in database

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-2.3: Create Project with Very Long Name
**Priority:** Medium  
**Type:** Validation Test

**Steps:**
1. Open "New Project" modal
2. Enter very long name (200+ characters)
3. Submit form

**Expected Result:**
- Either: Validation error with max length constraint
- Or: Project created with truncated name
- Clear feedback to user about character limit

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-2.4: Create Multiple Projects
**Priority:** Medium  
**Type:** Integration Test

**Steps:**
1. Create project "Project A"
2. Create project "Project B"
3. Create project "Project C"
4. Verify all appear in list

**Expected Result:**
- All 3 projects created successfully
- All visible in project list
- Listed in correct order (newest first or by name)
- No duplicate entries

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-2.5: Create Project with Special Characters
**Priority:** Low  
**Type:** Edge Case Test

**Steps:**
1. Open "New Project" modal
2. Enter name: "Test & Dev / 2024 (v2.0)"
3. Submit form

**Expected Result:**
- Project created successfully
- Special characters preserved correctly
- No XSS vulnerabilities
- Name displays correctly in UI

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 3. Project List Display Tests

### TC-3.1: Dashboard Shows User's Projects
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Log in with user who has created projects
2. Navigate to dashboard
3. Observe project list section

**Expected Result:**
- All user's projects displayed
- Project cards show: name, creation date, task count (0 for now)
- Clean, organized layout
- No projects from other users visible

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-3.2: Empty State When No Projects
**Priority:** Medium  
**Type:** UX Test

**Steps:**
1. Log in with brand new user (no projects)
2. Navigate to dashboard
3. Observe project section

**Expected Result:**
- Empty state message shown
- Message: "No projects yet" or similar
- Clear call-to-action: "Create your first project"
- "+ New Project" button prominently displayed

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-3.3: Project Count Displayed Correctly
**Priority:** Low  
**Type:** Display Test

**Steps:**
1. Create 5 projects
2. View dashboard
3. Count displayed projects

**Expected Result:**
- All 5 projects visible
- Count matches database records
- No duplicates or missing projects

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-3.4: Project List Updates After Creation
**Priority:** High  
**Type:** Real-time Update Test

**Steps:**
1. Note current project count on dashboard
2. Create new project
3. Observe project list (without manual page refresh)

**Expected Result:**
- New project appears in list immediately
- List updates without full page reload
- Optimistic UI or smooth transition
- Correct project count

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 4. Project Navigation Tests

### TC-4.1: Click Project Card Opens Project Detail
**Priority:** High  
**Type:** Navigation Test

**Steps:**
1. View dashboard with at least one project
2. Click on a project card
3. Observe navigation

**Expected Result:**
- Navigates to project detail page (`/app/projects/[id]`)
- URL contains project ID
- Page loads without errors
- (For now, page may show placeholder content)

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-4.2: Direct URL Access to Project Detail
**Priority:** Medium  
**Type:** Authorization Test

**Steps:**
1. Copy project detail URL (e.g., `/app/projects/[valid-id]`)
2. Log out
3. Paste URL in browser
4. Observe behavior

**Expected Result:**
- Redirected to `/login` (protected route)
- Cannot access project detail without authentication

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 5. Row Level Security Tests

### TC-5.1: User Cannot See Other Users' Projects
**Priority:** High  
**Type:** Security Test

**Steps:**
1. Create project with User A
2. Log out
3. Log in as User B
4. View dashboard

**Expected Result:**
- User B sees only their own projects (or empty state)
- User A's projects NOT visible to User B
- RLS policy enforced at database level

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-5.2: User Cannot Access Other User's Project by Direct URL
**Priority:** High  
**Type:** Security Test

**Steps:**
1. Create project with User A, note project ID
2. Log out, log in as User B
3. Navigate to `/app/projects/[user-a-project-id]`
4. Observe behavior

**Expected Result:**
- 404 error or "Project not found" message
- Or redirected to dashboard
- User B cannot access User A's project
- No data leak in network tab

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-5.3: User Cannot Modify Other User's Projects via API
**Priority:** High  
**Type:** Security Test

**Steps:**
1. Create project with User A
2. Obtain project ID
3. Log in as User B
4. Attempt to update/delete via Supabase client
   - Open browser console
   - Try: `supabase.from('projects').update({name: 'Hacked'}).eq('id', '[user-a-id]')`

**Expected Result:**
- Update fails
- RLS policy blocks modification
- Error returned from database
- User A's project unchanged

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-5.4: User Can Only Create Projects for Themselves
**Priority:** High  
**Type:** Security Test

**Steps:**
1. Log in as User A
2. Attempt to create project with different owner_id via API
   - Open console
   - Try: `supabase.from('projects').insert({name: 'Test', owner_id: '[different-uuid]'})`

**Expected Result:**
- Insert fails or owner_id overridden by RLS policy
- Policy enforces `auth.uid() = owner_id`
- Cannot create projects for other users

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 6. Project Update Tests (if implemented)

### TC-6.1: Update Project Name
**Priority:** Medium  
**Type:** CRUD Test

**Steps:**
1. Create project "Old Name"
2. Click edit/settings (if UI exists)
3. Change name to "New Name"
4. Submit

**Expected Result:**
- Project name updated in database
- Change reflected immediately in UI
- Success toast shown
- No other fields affected

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail ☐ N/A (if not implemented in M2)

---

## 7. Project Deletion Tests (if implemented)

### TC-7.1: Delete Project Successfully
**Priority:** Medium  
**Type:** CRUD Test

**Steps:**
1. Create a test project
2. Click delete button (if exists)
3. Confirm deletion
4. Verify project removed

**Expected Result:**
- Project deleted from database
- Removed from project list
- Success confirmation
- User redirected to dashboard

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail ☐ N/A (if not implemented in M2)

---

### TC-7.2: Delete Project with Confirmation
**Priority:** Low  
**Type:** UX Test

**Steps:**
1. Click delete on a project
2. Observe confirmation dialog

**Expected Result:**
- Confirmation dialog appears
- Warning message shown
- "Cancel" option available
- Deletion only happens after explicit confirmation

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail ☐ N/A (if not implemented in M2)

---

## 8. UI/UX Tests

### TC-8.1: Create Project Modal Opens/Closes
**Priority:** Medium  
**Type:** UX Test

**Steps:**
1. Click "+ New Project" button
2. Observe modal
3. Click outside modal or "Cancel"

**Expected Result:**
- Modal opens smoothly
- Form is empty and ready for input
- Clicking outside or Cancel closes modal
- No project created on cancel

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-8.2: Loading State During Project Creation
**Priority:** Medium  
**Type:** UX Test

**Steps:**
1. Open new project modal
2. Enter project name
3. Submit
4. Observe loading indicator

**Expected Result:**
- Loading spinner or disabled button shown
- User cannot double-submit
- Clear feedback that action is processing

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-8.3: Error Handling in Create Project Form
**Priority:** Medium  
**Type:** Error Handling Test

**Steps:**
1. Simulate network error (DevTools → offline)
2. Attempt to create project
3. Observe error handling

**Expected Result:**
- Clear error message shown
- User informed of network issue
- Form remains filled (data not lost)
- Can retry after connection restored

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-8.4: Project Cards Visual Design
**Priority:** Low  
**Type:** Visual Test

**Steps:**
1. View dashboard with multiple projects
2. Inspect project cards

**Expected Result:**
- Cards visually consistent with mockups
- Proper spacing, typography, icons
- Hover states work correctly
- Responsive on mobile

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 9. Integration with Mock Data

### TC-9.1: Mock Data Replaced with Real Data
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Review dashboard project section
2. Verify data source

**Expected Result:**
- No hardcoded mock projects displayed
- All projects come from Supabase database
- Real-time data fetching
- Mock projects from Milestone 0 removed

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 10. Performance Tests

### TC-10.1: Dashboard Loads Quickly with Many Projects
**Priority:** Low  
**Type:** Performance Test

**Steps:**
1. Create 20+ projects
2. Navigate to dashboard
3. Measure load time

**Expected Result:**
- Page loads in < 2 seconds
- No lag or stuttering
- Smooth rendering
- Pagination or virtualization if needed for large lists

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-10.2: Project Creation is Fast
**Priority:** Low  
**Type:** Performance Test

**Steps:**
1. Create new project
2. Measure time from submit to UI update

**Expected Result:**
- Project appears in list within 1 second
- Feels instant to user
- Optimistic UI updates if possible

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 11. Edge Cases

### TC-11.1: Create Project While Offline
**Priority:** Low  
**Type:** Edge Case Test

**Steps:**
1. Go offline (DevTools)
2. Attempt to create project
3. Go back online

**Expected Result:**
- Clear error message while offline
- Does not create project
- User can retry when back online

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-11.2: Rapid Project Creation
**Priority:** Low  
**Type:** Edge Case Test

**Steps:**
1. Click "+ New Project" multiple times rapidly
2. Submit forms quickly

**Expected Result:**
- All projects created successfully
- No duplicate entries
- Proper form/button disabling prevents issues

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-11.3: Session Expires While Creating Project
**Priority:** Low  
**Type:** Edge Case Test

**Steps:**
1. Start creating project
2. Wait for session to expire (or manually clear session)
3. Submit form

**Expected Result:**
- Redirect to login or session expired message
- Form data not lost if possible
- Graceful error handling

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## 12. Mobile Responsiveness

### TC-12.1: Project List on Mobile
**Priority:** Medium  
**Type:** Responsive Test

**Steps:**
1. View dashboard on mobile device or DevTools mobile view
2. Observe project list layout

**Expected Result:**
- Cards stack vertically on mobile
- Readable text sizes
- Touch-friendly tap targets
- No horizontal scrolling

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

### TC-12.2: Create Project Modal on Mobile
**Priority:** Medium  
**Type:** Responsive Test

**Steps:**
1. Open create project modal on mobile
2. Fill and submit form

**Expected Result:**
- Modal fits screen properly
- Form input accessible
- Keyboard doesn't obscure form
- Easy to close modal

**Actual Result:** ___________  
**Status:** ☐ Pass ☐ Fail

---

## Test Summary

**Total Test Cases:** 42

### By Priority:
- **High Priority:** 17
- **Medium Priority:** 15
- **Low Priority:** 10

### By Category:
- **Database Setup:** 3
- **Project Creation:** 5
- **Project List Display:** 4
- **Project Navigation:** 2
- **Row Level Security:** 4
- **Project Update:** 1 (optional)
- **Project Deletion:** 2 (optional)
- **UI/UX:** 4
- **Integration:** 1
- **Performance:** 2
- **Edge Cases:** 3
- **Mobile Responsiveness:** 2

### Expected Results:
- [ ] All High priority tests pass
- [ ] At least 90% of Medium priority tests pass
- [ ] RLS security tests confirm data isolation
- [ ] No mock data visible on dashboard

---

## Milestone 2 Acceptance Criteria

**Milestone is COMPLETE when:**
1. ✅ Projects table exists in Supabase with correct schema
2. ✅ RLS policies enabled and enforced
3. ✅ Users can create projects via UI
4. ✅ Dashboard displays user's projects (no mock data)
5. ✅ Users cannot see other users' projects
6. ✅ Project cards clickable (navigate to project detail placeholder)
7. ✅ All High priority test cases pass
8. ✅ UI matches design mockups for dashboard

**Optional for Milestone 2:**
- Project update functionality
- Project delete functionality
- Advanced filtering/sorting

---

## Sign-Off

**Tester:** ___________  
**Date:** ___________  
**Overall Status:** ☐ Pass ☐ Fail ☐ Partially Passing  

**Notes:**
