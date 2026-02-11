# Milestone 3 Quick Checklist — Tasks CRUD

**Purpose:** Fast smoke test after completing Milestone 3

---

## Setup ✓
- [ ] Logged in to app
- [ ] At least one project exists
- [ ] Supabase tasks table created

---

## Critical Path (Must Test)

### 1. Database Setup
- [ ] Supabase: tasks table visible in Table Editor
- [ ] RLS enabled on tasks table
- [ ] Policies exist (SELECT, INSERT, UPDATE, DELETE)
- [ ] Foreign key to projects with CASCADE

### 2. Create Task
- [ ] Navigate to project detail page
- [ ] Click "+ New Task" button → modal opens
- [ ] Fill form: title, status, priority
- [ ] Submit → success toast
- [ ] Modal closes
- [ ] New task appears in task list

### 3. Task Display
- [ ] Task shows title correctly
- [ ] Status badge displays (color-coded)
- [ ] Priority indicator visible
- [ ] Due date formatted (if set)
- [ ] Layout is clean and organized

### 4. Update Task Status
- [ ] Click status badge on a task
- [ ] Dropdown/menu appears
- [ ] Change from "Todo" to "In Progress"
- [ ] Badge updates immediately
- [ ] Color changes appropriately

### 5. Update Task Priority
- [ ] Click priority indicator
- [ ] Change priority (e.g., 2 → 3)
- [ ] Indicator updates immediately
- [ ] Visual change reflects new priority

### 6. Filters
- [ ] Click "Todo" filter tab/button
- [ ] Only "Todo" tasks shown
- [ ] Click "In Progress" filter
- [ ] Only "In Progress" tasks shown
- [ ] Click "All" → all tasks visible again

### 7. Empty State
- [ ] Create new project (or delete all tasks from existing)
- [ ] Navigate to project page
- [ ] See "No tasks yet" message
- [ ] "+ New Task" button visible

### 8. RLS Security (Two Users Required)
**User A:**
- [ ] Create task in their project
- [ ] Note task ID from database
- [ ] Log out

**User B:**
- [ ] Log in as different user
- [ ] Navigate to their project
- [ ] User A's tasks NOT visible
- [ ] Can only see own tasks

### 9. Task Count Integration
- [ ] Navigate to dashboard
- [ ] Project cards show correct task count
- [ ] Create new task in project
- [ ] Return to dashboard
- [ ] Task count incremented

---

## Validation Tests

### Form Validation
- [ ] Try creating task with empty title → error shown
- [ ] Cannot submit with validation errors
- [ ] Long title (200+ chars) → validation or truncation

### Loading States
- [ ] Submit button shows loading during task creation
- [ ] Status/priority updates show loading (brief)
- [ ] Button disabled during submission

### Error Handling
- [ ] Network offline → clear error message
- [ ] Invalid data → helpful validation message

---

## Database Verification

```sql
-- Run in Supabase SQL Editor:
SELECT 
  t.id, 
  t.title, 
  t.status, 
  t.priority, 
  t.project_id, 
  p.name as project_name
FROM tasks t
JOIN projects p ON t.project_id = p.id
ORDER BY t.created_at DESC;
```

- [ ] All test tasks exist
- [ ] Linked to correct projects
- [ ] Status values valid ('todo', 'in_progress', 'done')
- [ ] Priority values valid (1, 2, or 3)

---

## UI Quality Checks

### Visual
- [ ] Status badges: Gray (Todo), Blue/Yellow (In Progress), Green (Done)
- [ ] Priority indicators: Low (subtle), Medium (normal), High (prominent/red)
- [ ] Consistent spacing and alignment
- [ ] Matches design mockups

### Responsive
- [ ] Mobile: Tasks stack vertically, touch-friendly
- [ ] Desktop: Table or grid layout
- [ ] No horizontal scrolling needed

### Interactions
- [ ] Hover states on task cards
- [ ] Clickable elements clear
- [ ] Dropdowns work smoothly
- [ ] Form inputs accessible

---

## Pass Criteria

**Milestone 3 is COMPLETE if:**
- ✅ All "Critical Path" items work
- ✅ RLS test confirms task isolation
- ✅ Status and priority updates work inline
- ✅ Filters function correctly
- ✅ Empty state implemented
- ✅ Task count accurate on dashboard

**Time estimate:** 10-15 minutes

---

## Common Issues to Check

| Issue | How to Verify | Fix |
|-------|---------------|-----|
| Tasks not appearing | Check RLS policies | Verify owner_id and project_id |
| Status update fails | Check console errors | Verify server action + RLS |
| Wrong task count | Check dashboard | Verify aggregation query |
| Filter not working | Check client state | Debug filter logic |

---

## Issues Found

| Issue | Severity | Status |
|-------|----------|--------|
|       |          |        |
|       |          |        |

---

**Tested by:** ___________  
**Date:** ___________  
**Status:** ☐ PASS ☐ FAIL
