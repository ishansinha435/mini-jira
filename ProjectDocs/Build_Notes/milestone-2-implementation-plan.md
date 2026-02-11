# Milestone 2 Implementation Plan — Projects CRUD

**Objective:** Enable users to create, view, and manage projects with proper RLS security

**Approach:** Incremental, stage-by-stage implementation with testing at each step

---

## Overview

**Total Stages:** 5  
**Estimated Complexity:** Medium  
**Dependencies:** Milestone 1 (Authentication) must be complete

---

## Stage 1: Database Schema + RLS Setup

**Goal:** Create projects table in Supabase with proper RLS policies

### Tasks:
1. **Create projects table via Supabase SQL Editor**
   ```sql
   CREATE TABLE projects (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     name TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Enable RLS on projects table**
   ```sql
   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
   ```

3. **Create RLS policies**
   ```sql
   -- SELECT: Users can view their own projects
   CREATE POLICY "Users can view their own projects"
     ON projects FOR SELECT
     USING (auth.uid() = owner_id);

   -- INSERT: Users can create projects for themselves
   CREATE POLICY "Users can create their own projects"
     ON projects FOR INSERT
     WITH CHECK (auth.uid() = owner_id);

   -- UPDATE: Users can update their own projects
   CREATE POLICY "Users can update their own projects"
     ON projects FOR UPDATE
     USING (auth.uid() = owner_id);

   -- DELETE: Users can delete their own projects
   CREATE POLICY "Users can delete their own projects"
     ON projects FOR DELETE
     USING (auth.uid() = owner_id);
   ```

4. **Verify setup in Supabase dashboard**
   - Check table exists
   - Verify RLS enabled
   - Confirm policies listed

### Files Created/Modified:
- None (Supabase-only changes)
- Optional: Create migration file in `supabase/migrations/` if tracking SQL

### Testing Checkpoints:
- [ ] Table visible in Supabase Table Editor
- [ ] RLS shows as "enabled"
- [ ] All 4 policies present
- [ ] Can manually insert test row via SQL editor

### Success Criteria:
✅ Projects table exists with correct schema  
✅ RLS enabled and policies configured  
✅ Ready for Next.js integration

---

## Stage 2: TypeScript Types + Server Actions

**Goal:** Create type definitions and server actions for project CRUD operations

### Tasks:
1. **Create TypeScript types**
   - File: `src/types/database.ts` (new)
   - Define Project type matching Supabase schema

2. **Create project server actions**
   - File: `src/app/actions/projects.ts` (new)
   - Implement:
     - `createProject(name: string)`
     - `getProjects()` - fetch user's projects
     - `getProjectById(id: string)`
     - Optional: `updateProject(id, data)`, `deleteProject(id)`

3. **Add error handling and validation**
   - Zod schema for project creation
   - Return proper error/success responses

### Files Created/Modified:
- **NEW:** `src/types/database.ts`
- **NEW:** `src/app/actions/projects.ts`

### Code Structure:
```typescript
// src/types/database.ts
export interface Project {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
}

// src/app/actions/projects.ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProject(name: string) {
  // Validation
  // Insert into Supabase
  // Return result
}

export async function getProjects() {
  // Fetch user's projects
  // Return array
}
```

### Testing Checkpoints:
- [ ] Types compile without errors
- [ ] Server actions can be imported
- [ ] No linter errors

### Success Criteria:
✅ TypeScript types defined  
✅ Server actions implemented  
✅ Validation logic in place

---

## Stage 3: Create Project UI (Modal + Form)

**Goal:** Build UI for creating new projects

### Tasks:
1. **Add shadcn Dialog component**
   ```bash
   npx shadcn@latest add dialog
   ```

2. **Create NewProjectDialog component**
   - File: `src/components/projects/new-project-dialog.tsx` (new)
   - Use shadcn Dialog + Form
   - React Hook Form + Zod validation
   - Integrate with `createProject` server action
   - Show success/error toasts

3. **Add "+ New Project" button to dashboard**
   - Modify: `src/app/app/page.tsx`
   - Place button in projects section
   - Open dialog on click

### Files Created/Modified:
- **NEW:** `src/components/projects/new-project-dialog.tsx`
- **MODIFIED:** `src/app/app/page.tsx`
- **NEW:** `src/components/ui/dialog.tsx` (via shadcn)

### UI Features:
- Dialog with form
- Input field for project name
- Form validation (required, min length)
- Submit button with loading state
- Cancel button
- Toast notifications on success/error

### Testing Checkpoints:
- [ ] Dialog opens when clicking "+ New Project"
- [ ] Form validation works (empty name shows error)
- [ ] Submit creates project in Supabase
- [ ] Success toast appears
- [ ] Dialog closes after successful creation

### Success Criteria:
✅ Can create project via UI  
✅ Form validation prevents empty names  
✅ Loading states work  
✅ Toast feedback provided

---

## Stage 4: Display Projects List (Replace Mock Data)

**Goal:** Fetch and display real projects from Supabase on dashboard

### Tasks:
1. **Create ProjectCard component (modify existing)**
   - File: `src/components/project-card.tsx` (already exists - modify)
   - Accept `Project` type as prop
   - Update to use real data (not hardcoded)

2. **Create ProjectsSection component (modify existing)**
   - File: `src/components/projects-section.tsx` (already exists - modify)
   - Remove mock data
   - Fetch projects using `getProjects()` server action
   - Map over real projects to render ProjectCard
   - Add empty state for no projects

3. **Update dashboard page**
   - File: `src/app/app/page.tsx` (modify)
   - Fetch projects server-side
   - Pass projects to ProjectsSection
   - Handle loading state

### Files Created/Modified:
- **MODIFIED:** `src/components/project-card.tsx`
- **MODIFIED:** `src/components/projects-section.tsx`
- **MODIFIED:** `src/app/app/page.tsx`

### Empty State Design:
```tsx
{projects.length === 0 ? (
  <div className="text-center py-12">
    <p className="text-gray-600 mb-4">No projects yet</p>
    <NewProjectDialog trigger={<Button>Create your first project</Button>} />
  </div>
) : (
  <ProjectGrid projects={projects} />
)}
```

### Testing Checkpoints:
- [ ] Dashboard shows real projects (not mock data)
- [ ] Empty state appears for new users
- [ ] Project count matches database
- [ ] Each card shows correct project name and date
- [ ] No console errors

### Success Criteria:
✅ Mock data removed  
✅ Real projects from Supabase displayed  
✅ Empty state implemented  
✅ UI matches mockups

---

## Stage 5: Project Navigation + Detail Page Placeholder

**Goal:** Enable clicking project cards to navigate to project detail page

### Tasks:
1. **Make ProjectCard clickable**
   - File: `src/components/project-card.tsx` (modify)
   - Wrap card in Next.js Link
   - Link to `/app/projects/[id]`
   - Add hover states

2. **Create project detail page (placeholder)**
   - File: `src/app/app/projects/[id]/page.tsx` (new)
   - Fetch project by ID using `getProjectById()`
   - Display project name
   - Show placeholder for task list (Milestone 3)
   - Handle 404 if project not found or not owned by user

3. **Add loading state for project detail**
   - File: `src/app/app/projects/[id]/loading.tsx` (new)
   - Skeleton UI matching future task list layout

### Files Created/Modified:
- **MODIFIED:** `src/components/project-card.tsx`
- **NEW:** `src/app/app/projects/[id]/page.tsx`
- **NEW:** `src/app/app/projects/[id]/loading.tsx`

### Project Detail Page Structure:
```tsx
// Minimal for Milestone 2
export default async function ProjectDetailPage({ params }) {
  const project = await getProjectById(params.id);
  
  if (!project) {
    notFound();
  }
  
  return (
    <div>
      <h1>{project.name}</h1>
      <p>Tasks will be displayed here in Milestone 3</p>
    </div>
  );
}
```

### Testing Checkpoints:
- [ ] Clicking project card navigates to detail page
- [ ] URL shows `/app/projects/[id]`
- [ ] Project name displays correctly
- [ ] 404 for non-existent project ID
- [ ] 404 when accessing another user's project (RLS)

### Success Criteria:
✅ Project cards are clickable links  
✅ Detail page loads with project data  
✅ RLS enforced (cannot access others' projects)  
✅ 404 handling in place

---

## Stage 6 (Optional): Project Update/Delete

**Goal:** Add ability to edit or delete projects

**Note:** This stage is OPTIONAL for Milestone 2. Can be deferred to polish phase or later milestone.

### Tasks (if implementing):
1. **Add edit functionality**
   - Edit button on project detail page
   - Dialog/modal with form to update name
   - `updateProject` server action

2. **Add delete functionality**
   - Delete button with confirmation dialog
   - `deleteProject` server action
   - Redirect to dashboard after deletion

3. **Update UI with dropdown menu**
   - Add 3-dot menu to project cards
   - Options: Edit, Delete

### Files Created/Modified:
- **MODIFIED:** `src/app/app/projects/[id]/page.tsx`
- **NEW:** `src/components/projects/edit-project-dialog.tsx`
- **NEW:** `src/components/projects/delete-project-dialog.tsx`
- **MODIFIED:** `src/app/actions/projects.ts`

### Success Criteria (if implementing):
✅ Can rename projects  
✅ Can delete projects with confirmation  
✅ UI updates reflect changes  
✅ Proper error handling

---

## Post-Implementation: Testing & Verification

### Manual Testing Checklist:
Refer to: `milestone-2-quick-checklist.md`

**Critical tests:**
1. Create project via UI
2. Project appears in dashboard list
3. Click project → navigates to detail page
4. RLS test: User A cannot see User B's projects
5. Empty state for new users

### Before Moving to Milestone 3:
- [ ] Run all High priority test cases (17 tests)
- [ ] Verify RLS security with 2 test users
- [ ] Confirm no mock data visible
- [ ] Check mobile responsiveness
- [ ] Review linter errors (should be 0)
- [ ] Commit to Git with clear message

---

## Summary

| Stage | Description | Complexity | Files Changed |
|-------|-------------|------------|---------------|
| 1 | Database Schema + RLS | Low | 0 (Supabase only) |
| 2 | TypeScript Types + Server Actions | Low | 2 new |
| 3 | Create Project UI (Modal) | Medium | 3 (2 new, 1 mod) |
| 4 | Display Projects List | Medium | 3 modified |
| 5 | Navigation + Detail Page | Low | 3 (2 new, 1 mod) |
| 6 | Update/Delete (Optional) | Medium | 4 (2 new, 2 mod) |

**Total Estimated Time:** 2-3 hours (excluding optional Stage 6)

**Incremental Progress:**
- After Stage 1: Database ready ✅
- After Stage 3: Can create projects ✅
- After Stage 4: Dashboard shows real data ✅
- After Stage 5: Full navigation works ✅

---

## Ready to Begin?

**Next Step:** Start with Stage 1 (Database Schema + RLS Setup)

Would you like to proceed with Stage 1?
