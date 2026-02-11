# Mini JIRA — Project Context

## Project Overview

Build a visually polished, personal Jira-style task tracker where a logged-in user can create projects, manage tasks, comment, and upload attachments — powered entirely by Supabase (Auth + Postgres + RLS + Storage) with a Next.js + shadcn/ui frontend, packaged with Docker for easy reviewer execution.

**Purpose:** Ship a working full-stack app end-to-end (first time) with clean structure and minimal moving parts, demonstrating production hygiene and the exact assessment stack.

## Goals & Objectives

### Primary Goals
- Ship a working full-stack app end-to-end with clean structure and minimal moving parts
- Use the exact assessment stack: Next.js + Tailwind + shadcn/ui + Supabase-only backend + Docker
- Demonstrate "production hygiene": auth, secure data access, good UX states, clear README, and reliable local run

### Success Criteria (Definition of Done)
- A new user can sign up/log in and only see their own data (RLS enforced)
- User can create a project → create tasks → update status → comment → upload an attachment
- App has clean UI (shadcn primitives), handles empty/loading/error states, and is dockerized
- Repo includes README, .env.example, and runs via predictable commands

## Target Users

**Individual developers** using this as a personal task tracker (single-user workspace). Each logged-in user sees only their own projects, tasks, and data.

## Tech Stack

### Frontend
- Next.js (App Router) + TypeScript
- Node.js runtime (LTS version, e.g., Node 20)
- Tailwind CSS
- shadcn/ui component primitives (use whenever possible)
- lucide-react icons
- Optional: zod + react-hook-form for form validation

### Backend (Supabase-only)
- Supabase Auth (email/password)
- Supabase Postgres (database)
- Row Level Security (RLS) policies for per-user access control
- Supabase Storage for file uploads (attachments)

### Dev / Quality
- Git version control with frequent small commits per feature
- Basic testing: unit tests for critical utilities, light integration tests for core flows
- Docker for containerized run (single service: Next.js app; Supabase hosted)

## Scope & Constraints

### In Scope (Core MVP Features)

#### A) Authentication + Gated App
- Login/signup flow with email/password
- Redirect unauthenticated users to `/login`
- Logged in users land on `/app` dashboard
- Clean login page using shadcn Card, Input, Button with inline validation

#### B) Projects
- Create/list projects (name + created date)
- Click project → opens project detail page
- Dashboard project list using shadcn Card grid
- "New Project" in shadcn Dialog (modal)

#### C) Tasks (inside a project)
- Create tasks with: title (required), description (optional), status (Todo/In Progress/Done), priority (Low/Med/High), due date (optional)
- List tasks per project
- Update task status + edit basic fields
- Task list in shadcn Table with Badge for status/priority
- Filters (status, priority) using shadcn Select
- Empty states and loading skeletons

#### D) Task Detail + Comments
- Task detail page shows full description + metadata
- Add comments to a task
- Display comment list newest-last
- Comment composer with optimistic UI if feasible

#### E) Attachments (Supabase Storage)
- Upload file from task detail (png/jpg/pdf)
- Store file in Supabase Storage bucket
- Save attachment metadata in DB
- List attachments with link to view/download
- Upload button with progress indicator

#### F) Security via RLS
- RLS enabled on all tables
- Policies ensure users can only read/write their own rows
- No service role key needed on client

### Optional "Polish" Features (Nice-to-Have)

#### G) Activity Feed
- Simple activity log (task created, status changed, comment added, file uploaded)
- Display on dashboard as timeline list

#### H) Search / Sort
- Search tasks by title
- Sort by due date or priority

#### I) Basic Settings
- Profile page showing email
- Sign out button in navbar

### Out of Scope (Non-Goals)
- No realtime updates (Supabase Realtime) unless time remains
- No advanced permissions beyond "each user sees their own workspace"
- No teams/orgs/multi-user project sharing
- No complex audit logging beyond lightweight activity feed (optional)
- No external backend service (Express/FastAPI/etc.)
- No LangChain / vector DB / embeddings

### Technical Constraints
- Assessment-ready: must run locally with Docker
- Supabase-only backend (no additional backend frameworks)
- Must use shadcn/ui primitives (no custom component replacements)
- RLS must be enforced on all tables
- Single-user workspace (no multi-tenant architecture)

## Data Model

### Tables

**projects**
- `id` uuid PK
- `owner_id` uuid (auth.users.id)
- `name` text
- `created_at` timestamp

**tasks**
- `id` uuid PK
- `project_id` uuid FK → projects.id
- `owner_id` uuid
- `title` text
- `description` text nullable
- `status` text (todo | in_progress | done)
- `priority` int (1–3)
- `due_date` date nullable
- `created_at` timestamp
- `updated_at` timestamp

**comments**
- `id` uuid PK
- `task_id` uuid FK → tasks.id
- `owner_id` uuid
- `body` text
- `created_at` timestamp

**attachments**
- `id` uuid PK
- `task_id` uuid FK → tasks.id
- `owner_id` uuid
- `path` text (storage path)
- `filename` text
- `created_at` timestamp

**activity** (Optional)
- `id` uuid PK
- `owner_id` uuid
- `project_id` uuid FK nullable
- `type` text
- `metadata` jsonb
- `created_at` timestamp

### RLS Policy Intent

Enable RLS on all tables. Policies enforce:
- Users can only select/insert/update/delete rows where `owner_id = auth.uid()`
- For tasks/comments/attachments, also ensure relationship integrity (task belongs to user's project)

## Frontend Requirements

### Visual Goals
- Modern, clean, "startup-grade" UI
- Consistent spacing, typography, and component usage
- Minimal clutter: prefer cards, tables, and clear hierarchy
- Great micro-UX: toasts, loading states, empty states

### Layout Structure
App shell with:
- Top nav (app name, project selector optional, profile menu)
- Main content area

### Pages
- `/login` - Authentication
- `/app` - Dashboard (projects + activity feed)
- `/app/projects/[id]` - Task list for project
- `/app/tasks/[id]` - Task detail with comments + attachments

### shadcn Components to Prioritize
- Button, Input, Textarea, Select, Badge
- Card, Dialog, Table, Tabs
- DropdownMenu (optional)
- Toast / Sonner (for feedback)

### Accessibility + UX Basics
- Keyboard navigable modals
- Clear error messages
- Buttons disabled during async requests
- Loading states, empty states, error states for all data views

## Implementation Milestones

### Milestone 0 — Repo + Foundation (Setup)
- Initialize Next.js + TS + Tailwind
- Install shadcn/ui and add baseline components
- Set up project structure (components/lib)
- Create basic app shell layout
- **Checkpoint:** App runs locally; simple landing page renders

### Milestone 1 — Supabase Connection + Auth
- Create Supabase project
- Configure env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Build login/signup page
- Gated routing (redirect if not logged in)
- Logout
- **Checkpoint:** Can create account and access /app

### Milestone 2 — Projects (CRUD)
- Create projects table
- Add RLS for projects
- Dashboard project list + create project modal
- **Checkpoint:** Projects persist in DB; RLS prevents cross-user access

### Milestone 3 — Tasks (CRUD + List UI)
- Create tasks table
- RLS for tasks
- Project page lists tasks
- Create task modal
- Update status/priority inline
- **Checkpoint:** Task list works, filters render, UX feels clean

### Milestone 4 — Task Detail + Comments
- Create comments table
- RLS for comments
- Task detail page shows task, comments, add comment
- **Checkpoint:** Comments persist; basic error/loading states done

### Milestone 5 — Attachments (Storage)
- Create Storage bucket attachments
- Create attachments table + RLS
- Upload UI + list attachments + open link
- **Checkpoint:** Upload and view attachments works reliably

### Milestone 6 — Docker + Packaging + Docs
- Add Dockerfile (Next.js production build)
- Add .env.example
- Update README with local dev run, Docker run, Supabase setup notes
- Final UI polish passes
- **Checkpoint:** docker build + docker run works from fresh clone

### Milestone 7 (Optional) — Activity Feed + Final Polish
- Add activity table + minimal writes
- Render activity list on dashboard
- Add search/sort if time
- **Checkpoint:** App demo feels complete

## Mockups & Design

See `/ProjectDocs/mockups/` for:
- Login page mockup
- Dashboard/project list mockup
- Task list view mockup
- Task detail page mockup
- Design references and inspirations

*Note: Mockups to be added - use v0 for UI inspiration*

## Deliverables

Working application with:
- Local development environment
- Docker containerization
- README.md with run instructions and setup
- .env.example
- Dockerfile
- This SPEC.md (project context)
- Optional: short demo video link

## Development Process

### Workflow Rules
- Start with plan-only mode: Cursor must produce file tree, checklist, schema plan before writing code
- Implement one milestone at a time
- Make incremental edits (no massive rewrites)
- Run local test/check quickly after each feature
- Commit to git with clear messages

### Testing and Verification Checkpoints
After each milestone:
- Manual smoke test of the feature
- At least one "negative test" (e.g., logged out user can't access)
- Add minimal automated tests near the end (or as you go if comfortable)

---

*Last updated: February 11, 2026*
