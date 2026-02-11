# Mini JIRA — UI Mockup Specifications

This document provides detailed specifications for implementing the Mini JIRA frontend based on the provided mockups. Follow the principles outlined in the project context and Cursor rules rather than pixel-perfect reproduction.

---

## Image Files

1. `01-dashboard-home.png` - Main dashboard with projects grid and activity feed
2. `02-projects-dropdown.png` - Projects navigation dropdown menu
3. `03-profile-dropdown.png` - User profile menu with logout
4. `04-project-task-list.png` - Task list view within a project
5. `05-create-project-modal.png` - Create new project dialog
6. `06-task-detail-view.png` - Individual task detail page with comments/attachments

---

## 1. Dashboard / Home Page (`/app`)

**File:** `01-dashboard-home.png`

### Top Navigation Bar
- **Left side:** App logo + "Mini JIRA" brand text
- **Center:** "Dashboard" link, "Projects" dropdown
- **Right side:** User avatar with name + dropdown menu

### Welcome Section
- Personalized greeting: "Welcome back, [Name]"
- Subtitle explaining the page purpose

### Projects Section
- Section heading with "+ New Project" button (primary blue)
- **Project cards in responsive grid** (3 columns on desktop)
- Each card shows:
  - Colored folder icon (blue or red indicators)
  - Project name (bold)
  - Project description (2 lines, truncated with ellipsis)
  - Task count + last activity date

**shadcn components:** Card, Button

### Recent Activity Section
- Section heading: "Recent Activity"
- Activity feed showing recent actions:
  - Activity type icon (checkmark, comment, etc.)
  - Action description with emphasized text
  - Project name + timestamp
- Empty state: "No recent activity" (when no items)

**shadcn components:** Card for feed container

---

## 2. Projects Dropdown

**File:** `02-projects-dropdown.png`

### Dropdown Menu
- Triggered by "Projects" in top nav with chevron icon
- Clean vertical list of all user projects
- Each item shows:
  - Colored dot indicator (matches project icon color)
  - Project name
- Hover state: Light gray background
- Clicking navigates to project task list

**shadcn components:** DropdownMenu

---

## 3. Profile Dropdown

**File:** `03-profile-dropdown.png`

### User Menu
- Triggered by user avatar + name in top nav
- Two menu items:
  1. **Profile:** User icon + "Profile" text (black)
  2. **Sign out:** Exit icon + "Sign out" text (red)

**shadcn components:** DropdownMenu

---

## 4. Project Task List View (`/app/projects/[id]`)

**File:** `04-project-task-list.png`

### Page Header
- Back navigation: "← Back to Dashboard"
- Project indicator: Colored dot + project name (large, bold)
- Project description (gray text)
- Created date with calendar icon
- "+ New Task" button (primary blue, top-right)

### Controls
- Search input: "Search tasks..." with icon
- Filter dropdowns:
  - "All Statuses" (Todo, In Progress, Done)
  - "All Priorities" (Low, Medium, High)

### Task Table
Columns:
- **Title** (left-aligned, clickable)
- **Status** (badge/pill: Todo, In Progress, Done)
- **Priority** (badge/pill: Low, Medium, High)
- **Due Date** (right-aligned, formatted date)

**Status badge colors:**
- Todo: Plain text
- In Progress: Blue badge
- Done: Plain text (completed state)

**Priority badge colors:**
- Low: Plain text (no badge)
- Medium: Orange badge
- High: Red badge

**Empty state:** "No tasks yet—create one" with icon

**shadcn components:** Table, Badge, Input (search), Select (filters), Button

---

## 5. Create Project Modal

**File:** `05-create-project-modal.png`

### Modal Dialog
- Dark overlay background
- Centered white panel with rounded corners
- Close button (×) in top-right

### Form Fields
1. **Project name** (required)
   - Label: "Project name"
   - Placeholder: "e.g., Thesis Writing"
   - Single-line input

2. **Description** (optional)
   - Label: "Description"
   - Placeholder: "Brief description of your project..."
   - Multi-line textarea (3-4 rows)

### Actions
- "Cancel" button (secondary/outline)
- "Create project" button (primary blue)
- Both buttons right-aligned in footer

**shadcn components:** Dialog, Input, Textarea, Button

---

## 6. Task Detail View (`/app/tasks/[id]`)

**File:** `06-task-detail-view.png`

### Layout
Two-column layout (70/30 split approximately)

### Left Panel - Task Information
- Back navigation: "← [Project Name]"
- Task title (large, bold, editable)
- Task description (gray text, editable)

**Metadata fields:**
- **STATUS:** Dropdown (Todo, In Progress, Done)
- **PRIORITY:** Dropdown (Low, Medium, High)
- **DUE DATE:** Date picker with calendar icon
- **ASSIGNEE:** User name (current user)
- **PROJECT:** Project name as link (blue)

### Right Panel - Tabs
- Tab headers: "Comments (X)" and "Attachments (X)"

**Comments Tab:**
- Comment textarea: "Write a comment..."
- "+ Comment" button (blue)
- Comment list (newest first or last per spec)
- Empty state: "No comments yet. Be the first to comment."

**Attachments Tab:**
- Upload button with progress indicator
- Attachment list showing:
  - File icon
  - Filename
  - View/download link
- Empty state: "No attachments yet"

**shadcn components:** Card, Tabs, Select, Input, Textarea, Button

---

## Design System Specifications

### Colors (aligned with spec)
- **Primary Blue:** Use for buttons, links, active states
- **Red/Danger:** High priority badges, destructive actions
- **Orange/Warning:** Medium priority badges
- **Gray Palette:** Text hierarchy, backgrounds, borders

### Typography
- Sans-serif font family (default shadcn)
- Clear hierarchy: headings, body text, captions
- Consistent font weights

### Spacing
- Use Tailwind spacing scale: p-4, p-6, gap-4, gap-6, space-y-4
- Maintain consistent padding in cards (p-6)
- Adequate whitespace for readability

### Components
All components should use **shadcn/ui primitives**:
- Button (primary, secondary, destructive variants)
- Card (with header, content, footer sections)
- Badge (for status and priority)
- Dialog (for modals)
- DropdownMenu (for nav and user menus)
- Table (for task lists)
- Input, Textarea, Select (for forms)
- Tabs (for task detail sections)

### States (critical for UX)
- **Loading states:** Skeleton loaders or spinners
- **Empty states:** Friendly messages with icons
- **Error states:** Clear error messages with retry options
- **Hover states:** Visual feedback on interactive elements
- **Disabled states:** Buttons disabled during async operations

### Responsive Design
- Mobile-first approach
- Grid layout adjusts: 3 columns → 2 columns → 1 column
- Navigation collapses on mobile
- Tables scroll horizontally or convert to cards on small screens

---

## Implementation Notes

### Do Not
- Do not create custom Button/Input/Dialog components (use shadcn)
- Do not worry about exact pixel dimensions
- Do not add features not in the spec

### Do
- Follow the visual hierarchy and layout structure
- Implement all loading/empty/error states
- Use consistent spacing throughout
- Maintain clean, readable code
- Test keyboard navigation and accessibility

### Priority Order
1. Core functionality (auth, CRUD operations)
2. Visual structure (layout, navigation)
3. shadcn component integration
4. Loading/empty/error states
5. Polish (animations, micro-interactions)

---

## Mockup to Route Mapping

| Mockup | Route | Component Type |
|--------|-------|----------------|
| 01-dashboard-home | `/app` | Page |
| 02-projects-dropdown | N/A | Component (nav) |
| 03-profile-dropdown | N/A | Component (nav) |
| 04-project-task-list | `/app/projects/[id]` | Page |
| 05-create-project-modal | N/A | Dialog component |
| 06-task-detail-view | `/app/tasks/[id]` | Page |

---

## References

- **Project Context:** `/ProjectDocs/contexts/projectContext.md`
- **Cursor Rules:** `/.cursor/rules/nextjs-supabase-standards.mdc`
- **shadcn/ui:** Use `npx shadcn@latest add <component>` to add components

---

*Last updated: February 11, 2026*
