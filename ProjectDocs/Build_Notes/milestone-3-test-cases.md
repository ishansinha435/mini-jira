# Milestone 3 Test Cases — Tasks CRUD

**Objective:** Verify task creation, listing, status updates, and filtering work correctly within projects.

**Test Date:** TBD (after Milestone 3 implementation)

---

## Test Environment Setup

### Prerequisites
- [ ] Milestone 2 completed (projects working)
- [ ] Supabase tasks table created
- [ ] RLS policies enabled on tasks
- [ ] At least one test project available
- [ ] Development server running

### Database Schema to Verify
```sql
-- tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) > 0),
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')),
  priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 3),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
```

---

## 1. Database Setup Tests (3 tests)

### TC-1.1: Tasks Table Exists
**Priority:** High  
**Type:** Database Test

**Steps:**
1. Connect to Supabase dashboard
2. Navigate to Table Editor
3. Verify `tasks` table exists

**Expected Result:**
- Table visible with all columns
- Foreign keys to projects and auth.users
- Check constraints on status and priority

**Status:** ☐ Pass ☐ Fail

---

### TC-1.2: RLS Enabled on Tasks
**Priority:** High  
**Type:** Security Test

**Steps:**
1. Check RLS status on tasks table
2. Verify policies exist

**Expected Result:**
- RLS enabled
- At least 4 policies (SELECT, INSERT, UPDATE, DELETE)
- Policies enforce owner_id = auth.uid()

**Status:** ☐ Pass ☐ Fail

---

### TC-1.3: Foreign Key Cascades
**Priority:** Medium  
**Type:** Database Test

**Steps:**
1. Create task in a project
2. Delete the project
3. Verify task is also deleted

**Expected Result:**
- CASCADE delete works
- No orphaned tasks remain

**Status:** ☐ Pass ☐ Fail

---

## 2. Task Creation Tests (7 tests)

### TC-2.1: Create Task Successfully
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Navigate to project detail page
2. Click "+ New Task" button
3. Fill form: title, status, priority
4. Submit

**Expected Result:**
- Success toast shown
- Task appears in task list
- Task stored in database
- Modal closes

**Status:** ☐ Pass ☐ Fail

---

### TC-2.2: Create Task with All Fields
**Priority:** Medium  
**Type:** Integration Test

**Steps:**
1. Open new task modal
2. Fill all fields: title, description, status, priority, due date
3. Submit

**Expected Result:**
- All data saved correctly
- Description displayed
- Due date formatted properly

**Status:** ☐ Pass ☐ Fail

---

### TC-2.3: Create Task with Empty Title
**Priority:** High  
**Type:** Validation Test

**Steps:**
1. Open new task modal
2. Leave title empty
3. Try to submit

**Expected Result:**
- Validation error: "Title is required"
- Form cannot submit
- No task created

**Status:** ☐ Pass ☐ Fail

---

### TC-2.4: Create Task with Very Long Title
**Priority:** Low  
**Type:** Validation Test

**Steps:**
1. Enter 200+ character title
2. Submit

**Expected Result:**
- Either: validation error with max length
- Or: title saved with reasonable limit
- Clear feedback to user

**Status:** ☐ Pass ☐ Fail

---

### TC-2.5: Create Multiple Tasks in Same Project
**Priority:** Medium  
**Type:** Integration Test

**Steps:**
1. Create task "Task A"
2. Create task "Task B"
3. Create task "Task C"

**Expected Result:**
- All tasks appear in list
- Correct order (newest first or by status)
- No duplicates

**Status:** ☐ Pass ☐ Fail

---

### TC-2.6: Create Task with Due Date
**Priority:** Medium  
**Type:** Validation Test

**Steps:**
1. Open new task modal
2. Select due date (future date)
3. Submit

**Expected Result:**
- Date saved correctly
- Date displays in task list
- Format is readable (e.g., "Feb 15")

**Status:** ☐ Pass ☐ Fail

---

### TC-2.7: Create Task Increments Project Task Count
**Priority:** Low  
**Type:** Integration Test

**Steps:**
1. Note project task count on dashboard
2. Create new task in project
3. Return to dashboard

**Expected Result:**
- Task count increased by 1
- Count accurate

**Status:** ☐ Pass ☐ Fail

---

## 3. Task Display Tests (5 tests)

### TC-3.1: Tasks Display in Project Page
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Navigate to project with tasks
2. Observe task list

**Expected Result:**
- All tasks visible
- Displayed in organized layout (table or cards)
- Shows: title, status, priority, due date

**Status:** ☐ Pass ☐ Fail

---

### TC-3.2: Empty State When No Tasks
**Priority:** Medium  
**Type:** UX Test

**Steps:**
1. Navigate to project with no tasks
2. Observe content

**Expected Result:**
- Empty state message: "No tasks yet"
- "+ New Task" button visible
- Helpful prompt to create first task

**Status:** ☐ Pass ☐ Fail

---

### TC-3.3: Task Status Badges Display
**Priority:** Medium  
**Type:** UI Test

**Steps:**
1. Create tasks with different statuses
2. View task list

**Expected Result:**
- "Todo" badge (gray)
- "In Progress" badge (blue/yellow)
- "Done" badge (green)
- Badges visually distinct

**Status:** ☐ Pass ☐ Fail

---

### TC-3.4: Priority Indicators Display
**Priority:** Medium  
**Type:** UI Test

**Steps:**
1. Create tasks with priority 1, 2, 3
2. View task list

**Expected Result:**
- Priority 1 (Low): subtle indicator
- Priority 2 (Medium): moderate indicator
- Priority 3 (High): prominent indicator (red?)
- Clear visual hierarchy

**Status:** ☐ Pass ☐ Fail

---

### TC-3.5: Due Date Display
**Priority:** Low  
**Type:** UI Test

**Steps:**
1. Create tasks with various due dates
2. View task list

**Expected Result:**
- Future dates: normal display
- Today: highlighted
- Overdue: red/warning color
- No due date: shows "—" or hidden

**Status:** ☐ Pass ☐ Fail

---

## 4. Task Update Tests (6 tests)

### TC-4.1: Update Task Status Inline
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Find task with status "Todo"
2. Click status badge/dropdown
3. Change to "In Progress"

**Expected Result:**
- Status updates immediately
- Badge changes visually
- Database updated
- No page reload needed

**Status:** ☐ Pass ☐ Fail

---

### TC-4.2: Update Task Priority Inline
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Find task with priority 1
2. Click priority indicator
3. Change to priority 3

**Expected Result:**
- Priority updates immediately
- Indicator changes visually
- Database updated

**Status:** ☐ Pass ☐ Fail

---

### TC-4.3: Mark Task as Done
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Find task with status "Todo"
2. Change status to "Done"

**Expected Result:**
- Status updates
- Visual indication (strikethrough? green badge?)
- Task moves to "Done" section (if grouped)

**Status:** ☐ Pass ☐ Fail

---

### TC-4.4: Update Task Multiple Times
**Priority:** Medium  
**Type:** Integration Test

**Steps:**
1. Change status: Todo → In Progress
2. Change priority: 1 → 3
3. Change status: In Progress → Done

**Expected Result:**
- All updates persist
- No conflicts or lost updates
- updated_at timestamp changes

**Status:** ☐ Pass ☐ Fail

---

### TC-4.5: Update Task Title (if implemented)
**Priority:** Low  
**Type:** Integration Test

**Steps:**
1. Click task title to edit
2. Change title
3. Save

**Expected Result:**
- Title updates
- Database reflects change
- Validation applies

**Status:** ☐ Pass ☐ Fail

---

### TC-4.6: Optimistic UI Updates
**Priority:** Low  
**Type:** UX Test

**Steps:**
1. Update task status on slow network
2. Observe UI behavior

**Expected Result:**
- UI updates immediately (optimistic)
- If server fails, revert with error
- Smooth user experience

**Status:** ☐ Pass ☐ Fail

---

## 5. Task Filtering/Sorting Tests (4 tests)

### TC-5.1: Filter Tasks by Status
**Priority:** High  
**Type:** Integration Test

**Steps:**
1. Create tasks with different statuses
2. Click "Todo" filter
3. Observe list

**Expected Result:**
- Only "Todo" tasks shown
- Other statuses hidden
- Count updates

**Status:** ☐ Pass ☐ Fail

---

### TC-5.2: Filter Tasks by Priority
**Priority:** Medium  
**Type:** Integration Test

**Steps:**
1. Create tasks with different priorities
2. Click "High Priority" filter

**Expected Result:**
- Only priority 3 tasks shown
- Filter is clearable

**Status:** ☐ Pass ☐ Fail

---

### TC-5.3: Sort Tasks by Due Date
**Priority:** Low  
**Type:** Integration Test

**Steps:**
1. Create tasks with various due dates
2. Click "Sort by Due Date"

**Expected Result:**
- Tasks reorder
- Overdue first, then nearest due date
- Tasks without due date at end

**Status:** ☐ Pass ☐ Fail

---

### TC-5.4: Clear All Filters
**Priority:** Low  
**Type:** UX Test

**Steps:**
1. Apply status and priority filters
2. Click "Clear filters"

**Expected Result:**
- All tasks visible again
- Filter state resets

**Status:** ☐ Pass ☐ Fail

---

## 6. RLS Security Tests (4 tests)

### TC-6.1: User Cannot See Other Users' Tasks
**Priority:** High  
**Type:** Security Test

**Steps:**
1. User A creates task in their project
2. User B logs in
3. User B navigates to their own project

**Expected Result:**
- User B does NOT see User A's tasks
- RLS enforced at database level

**Status:** ☐ Pass ☐ Fail

---

### TC-6.2: User Cannot Update Other Users' Tasks
**Priority:** High  
**Type:** Security Test

**Steps:**
1. User A creates task, note task ID
2. User B logs in
3. User B tries to update task via API

**Expected Result:**
- Update fails
- RLS blocks modification
- No data changed

**Status:** ☐ Pass ☐ Fail

---

### TC-6.3: Tasks Belong to Correct Project
**Priority:** High  
**Type:** Security Test

**Steps:**
1. Create task in Project A
2. Navigate to Project B
3. Verify task not visible in Project B

**Expected Result:**
- Tasks only show in their own project
- project_id correctly enforced

**Status:** ☐ Pass ☐ Fail

---

### TC-6.4: Cannot Create Task in Other User's Project
**Priority:** High  
**Type:** Security Test

**Steps:**
1. User A has Project A
2. User B tries to create task with project_id = Project A's ID

**Expected Result:**
- Insert fails or is rejected
- RLS/foreign key blocks creation

**Status:** ☐ Pass ☐ Fail

---

## 7. UI/UX Tests (5 tests)

### TC-7.1: Create Task Modal Opens/Closes
**Priority:** Medium  
**Type:** UX Test

**Steps:**
1. Click "+ New Task"
2. Observe modal
3. Click Cancel or outside

**Expected Result:**
- Modal opens smoothly
- Form is empty
- Closes without creating task

**Status:** ☐ Pass ☐ Fail

---

### TC-7.2: Loading States During Task Operations
**Priority:** Medium  
**Type:** UX Test

**Steps:**
1. Create task
2. Observe loading indicators

**Expected Result:**
- Spinner or disabled button
- Clear feedback
- Prevents double submission

**Status:** ☐ Pass ☐ Fail

---

### TC-7.3: Error Messages are Clear
**Priority:** Medium  
**Type:** UX Test

**Steps:**
1. Trigger validation errors
2. Simulate network error

**Expected Result:**
- Clear, actionable error messages
- No technical jargon
- User knows how to fix

**Status:** ☐ Pass ☐ Fail

---

### TC-7.4: Task List is Responsive
**Priority:** Medium  
**Type:** Responsive Test

**Steps:**
1. View task list on mobile
2. View on desktop

**Expected Result:**
- Mobile: Stack vertically, touch-friendly
- Desktop: Table or grid layout
- No horizontal scroll

**Status:** ☐ Pass ☐ Fail

---

### TC-7.5: Keyboard Shortcuts (Optional)
**Priority:** Low  
**Type:** Accessibility Test

**Steps:**
1. Press 'N' to create new task (if implemented)
2. Use Tab to navigate form

**Expected Result:**
- Keyboard shortcuts work
- Tab order logical
- Enter submits form

**Status:** ☐ Pass ☐ Fail

---

## 8. Edge Cases (4 tests)

### TC-8.1: Create Task While Offline
**Priority:** Low  
**Type:** Edge Case Test

**Steps:**
1. Go offline
2. Try to create task

**Expected Result:**
- Clear error message
- Does not create task locally
- User can retry when online

**Status:** ☐ Pass ☐ Fail

---

### TC-8.2: Very Long Description
**Priority:** Low  
**Type:** Edge Case Test

**Steps:**
1. Enter 1000+ character description
2. Submit

**Expected Result:**
- Either: validation limit
- Or: saves and displays correctly
- No UI breaking

**Status:** ☐ Pass ☐ Fail

---

### TC-8.3: Past Due Date Selection
**Priority:** Low  
**Type:** Validation Test

**Steps:**
1. Select past date as due date
2. Submit

**Expected Result:**
- Allowed (can add old tasks)
- Shows as overdue
- Or: warning shown but allowed

**Status:** ☐ Pass ☐ Fail

---

### TC-8.4: Delete Project with Tasks
**Priority:** Medium  
**Type:** Integration Test

**Steps:**
1. Create project with tasks
2. Delete project (if delete implemented)

**Expected Result:**
- CASCADE delete removes tasks
- No orphaned tasks
- Confirms deletion

**Status:** ☐ Pass ☐ Fail

---

## 9. Performance Tests (2 tests)

### TC-9.1: Load Project with Many Tasks
**Priority:** Low  
**Type:** Performance Test

**Steps:**
1. Create 50+ tasks in project
2. Navigate to project page
3. Measure load time

**Expected Result:**
- Loads in < 2 seconds
- Smooth scrolling
- Consider pagination if needed

**Status:** ☐ Pass ☐ Fail

---

### TC-9.2: Fast Status Updates
**Priority:** Low  
**Type:** Performance Test

**Steps:**
1. Rapidly change task statuses
2. Observe response time

**Expected Result:**
- Updates feel instant
- No lag or stuttering
- Optimistic UI helpful

**Status:** ☐ Pass ☐ Fail

---

## Test Summary

**Total Test Cases:** 45

### By Priority:
- **High Priority:** 18
- **Medium Priority:** 17
- **Low Priority:** 10

### By Category:
- **Database Setup:** 3
- **Task Creation:** 7
- **Task Display:** 5
- **Task Update:** 6
- **Filtering/Sorting:** 4
- **RLS Security:** 4
- **UI/UX:** 5
- **Edge Cases:** 4
- **Performance:** 2

### Expected Results:
- [ ] All High priority tests pass
- [ ] At least 90% of Medium priority tests pass
- [ ] RLS security tests confirm task isolation
- [ ] UI feels smooth and responsive

---

## Milestone 3 Acceptance Criteria

**Milestone is COMPLETE when:**
1. ✅ Tasks table exists with correct schema
2. ✅ RLS policies enabled and enforced
3. ✅ Users can create tasks within projects
4. ✅ Tasks display in project page
5. ✅ Status and priority can be updated inline
6. ✅ Filters work (at minimum: by status)
7. ✅ Users cannot see other users' tasks
8. ✅ Empty state for projects with no tasks
9. ✅ All High priority test cases pass
10. ✅ UI matches design mockups

---

## Sign-Off

**Tester:** ___________  
**Date:** ___________  
**Overall Status:** ☐ Pass ☐ Fail ☐ Partially Passing  

**Notes:**
