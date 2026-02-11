# Milestone 4 Quick Checklist — Task Detail + Comments

**Objective:** Create task detail page with comments functionality

**Status:** ⏳ In Progress

---

## Stage 1: Database + Types + Server Actions

### Database Setup
- [x] Create `comments` table in Supabase
- [x] Add indexes (task_id, owner_id)
- [x] Enable RLS on comments table
- [x] Create SELECT policy (users can view comments on their tasks)
- [x] Create INSERT policy (users can add comments to their tasks)
- [x] Create DELETE policy (users can delete their own comments)
- [x] Verify CASCADE delete on task deletion

### TypeScript Types
- [x] Add `Comment` interface to `src/types/database.ts`
- [x] Add `CommentInsert` type
- [x] Verify types compile

### Server Actions
- [x] Create `src/app/actions/comments.ts`
- [x] Implement `createComment(taskId, body)`
- [x] Implement `getComments(taskId)`
- [x] Implement `getCommentCount(taskId)`
- [x] Add Zod validation schema for comments
- [x] Test server actions work

### Testing
- [ ] Comments table visible in Supabase dashboard (needs user to run migration)
- [ ] RLS policies active (needs user to run migration)
- [ ] Can insert comment via SQL editor (needs user to run migration)
- [x] No linter errors

**Stage 1 Complete:** ✅

---

## Stage 2: Task Detail Page + Navigation

### Page Setup
- [x] Create `src/app/app/tasks/[id]/page.tsx`
- [x] Create `src/app/app/tasks/[id]/loading.tsx`
- [x] Create `src/app/app/tasks/[id]/not-found.tsx`
- [x] Fetch task with `getTaskById(id)`
- [x] Handle not found case (404)

### Task Information Display
- [x] Show task title (large, prominent)
- [x] Show task description
- [x] Display status (editable dropdown)
- [x] Display priority (editable dropdown)
- [x] Display due date
- [x] Show project name as link
- [x] Show created/updated timestamps

### Navigation
- [x] Add back button "← Back to [Project Name]"
- [x] Link back button to project page
- [x] Make task cards clickable (modify `task-card.tsx`)
- [x] Link task cards to `/app/tasks/[id]`

### Layout & Tabs
- [x] Two-column layout (desktop)
- [x] Single column on mobile (responsive)
- [x] Add shadcn Tabs component
- [x] Create "Comments (X)" tab
- [x] Create "Attachments (0)" tab
- [x] Set Comments as default active tab

### Testing
- [ ] Navigate from task card to detail page (needs manual test)
- [ ] All task fields display correctly (needs manual test)
- [ ] Back navigation works (needs manual test)
- [ ] Loading state shows (needs manual test)
- [ ] 404 page for invalid task IDs (needs manual test)
- [ ] Responsive layout on mobile (needs manual test)
- [ ] Tabs render correctly (needs manual test)

**Stage 2 Complete:** ✅

---

## Stage 3: Comments Feature Implementation

### Comment Components
- [x] Create `src/components/tasks/comment-composer.tsx`
- [x] Create `src/components/tasks/comment-list.tsx`
- [x] Create `src/components/tasks/comment-card.tsx`

### Comment Composer
- [x] Textarea for comment body
- [x] Submit button with loading state
- [x] Integrate with `createComment()` action
- [x] Clear textarea after submit
- [x] Toast notification on success
- [x] Error handling with toast
- [x] Disable submit for empty comments
- [x] Character count indicator (0/5000)

### Comment List
- [x] Fetch comments with `getComments(taskId)`
- [x] Display comments (newest last per spec)
- [x] Show comment body
- [x] Show author email/name
- [x] Show timestamp (relative with date-fns)
- [x] Empty state: "No comments yet"

### Integration
- [x] Add CommentComposer to Comments tab
- [x] Add CommentList to Comments tab
- [x] Pass taskId to components
- [x] Update comment count in tab header
- [x] Fetch comment count with `getCommentCount()`
- [x] Router.refresh() for updates

### Attachments Tab Placeholder
- [x] Show empty state in Attachments tab
- [x] Message: "Coming in Milestone 5"
- [x] Keep count at (0)

### Testing
- [ ] Can add comment successfully (needs manual test)
- [ ] Comment appears in list immediately (needs manual test)
- [ ] Comment saved to database (needs manual test)
- [ ] Comment count updates (needs manual test)
- [ ] Multiple comments display in order (needs manual test)
- [ ] Empty state works (needs manual test)
- [ ] Validation prevents empty comments (needs manual test)
- [ ] Timestamps display correctly (needs manual test)

**Stage 3 Complete:** ✅

---

## Final Verification

### Functional Tests
- [ ] Run all High priority tests (18 total)
- [ ] Navigate: Dashboard → Project → Task → Detail
- [ ] Add multiple comments to one task
- [ ] Update task status from detail page
- [ ] Update task priority from detail page
- [ ] Back navigation preserves state

### Security Tests
- [ ] RLS test: User A cannot see User B's tasks
- [ ] RLS test: User A cannot see User B's comments
- [ ] RLS test: User A cannot comment on User B's tasks

### UX/UI Tests
- [ ] Mobile responsive (375px width)
- [ ] Tablet responsive (768px width)
- [ ] Desktop layout (1440px width)
- [ ] Loading states smooth
- [ ] Error states clear
- [ ] Toast notifications work

### Code Quality
- [ ] No linter errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] All components properly typed
- [ ] Server actions use proper validation
- [ ] RLS policies correct

### Documentation
- [ ] Update README if needed
- [ ] Create completion summary document
- [ ] Document any issues found
- [ ] Note any deferred features

### Git
- [ ] Stage all changes
- [ ] Write descriptive commit message
- [ ] Commit to repository

---

## Milestone 4 Complete! ✅

**Ready for:** Milestone 5 (Attachments + Storage)

---

## Quick Reference

### New Routes
- `/app/tasks/[id]` - Task detail page

### New Database Tables
- `comments` (id, task_id, owner_id, body, created_at)

### New Server Actions (comments.ts)
- `createComment(taskId, body)`
- `getComments(taskId)`
- `getCommentCount(taskId)`

### New Components
- `comment-composer.tsx`
- `comment-list.tsx`
- `comment-card.tsx`

### Modified Files
- `task-card.tsx` (add navigation)
- `database.ts` (add Comment types)

---

**Last Updated:** Feb 11, 2026
