# Milestone 2 Quick Checklist — Projects CRUD

**Purpose:** Fast smoke test after completing Milestone 2

---

## Setup ✓
- [ ] Logged in to app
- [ ] Dashboard loads successfully
- [ ] Supabase projects table exists

---

## Critical Path (Must Test)

### 1. Database Setup
- [ ] Supabase: projects table visible in Table Editor
- [ ] RLS enabled on projects table
- [ ] Policies exist (SELECT, INSERT, UPDATE, DELETE)

### 2. Create Project
- [ ] Click "+ New Project" button → modal opens
- [ ] Enter name "Test Project" → submit
- [ ] Success toast appears
- [ ] Modal closes
- [ ] New project appears in dashboard list

### 3. Project Display
- [ ] Project card shows correct name
- [ ] Created date displayed
- [ ] Task count shows 0 (or mock data for now)
- [ ] No old mock projects visible

### 4. Navigation
- [ ] Click project card → navigates to project detail page
- [ ] URL shows `/app/projects/[id]`
- [ ] Page loads (placeholder content OK for now)

### 5. RLS Security (Two Users Required)
**User A:**
- [ ] Create project "User A Project"
- [ ] Note project ID from URL or database
- [ ] Log out

**User B:**
- [ ] Log in as different user
- [ ] Dashboard shows only User B's projects
- [ ] User A's projects NOT visible
- [ ] Try navigating to `/app/projects/[user-a-project-id]`
- [ ] Should see 404 or "not found" (cannot access)

### 6. Empty State
- [ ] Log in as brand new user (no projects)
- [ ] Dashboard shows "No projects yet" message
- [ ] "+ New Project" button visible

---

## Validation Tests

### Form Validation
- [ ] Try creating project with empty name → error shown
- [ ] Cannot submit form with validation errors

### Loading States
- [ ] Submit button shows loading spinner/text
- [ ] Button disabled during submission

### Error Handling
- [ ] Network offline → shows clear error message
- [ ] Error doesn't crash app

---

## Mobile Quick Check (Optional)
- [ ] Open DevTools → mobile view
- [ ] Dashboard layout looks good (cards stack vertically)
- [ ] Create project modal fits screen
- [ ] Touch targets are large enough

---

## Final Verification

### Database Check
```sql
-- Run in Supabase SQL Editor:
SELECT id, name, owner_id, created_at FROM projects;
```
- [ ] All test projects exist
- [ ] owner_id matches correct users
- [ ] No duplicate entries

### No Mock Data
- [ ] Check dashboard project section
- [ ] Verify all data comes from database
- [ ] Old hardcoded projects removed from code

---

## Pass Criteria

**Milestone 2 is COMPLETE if:**
- ✅ All "Critical Path" items work
- ✅ RLS test confirms user isolation
- ✅ No mock data visible
- ✅ UI matches design mockups

**Time estimate:** 10-15 minutes

---

## Issues Found

| Issue | Severity | Status |
|-------|----------|--------|
|       |          |        |
|       |          |        |
|       |          |        |

---

**Tested by:** ___________  
**Date:** ___________  
**Status:** ☐ PASS ☐ FAIL
