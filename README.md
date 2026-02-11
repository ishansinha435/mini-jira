# Mini JIRA

A visually polished, personal Jira-style task tracker built with Next.js, Supabase, and shadcn/ui. Features include project management, task tracking with status/priority, comments, file attachments, and activity logging.

## Features

- 🔐 **Authentication** - Secure email/password login with Supabase Auth
- 📁 **Projects** - Create and manage multiple projects
- ✅ **Tasks** - Full CRUD with status, priority, due dates, and inline editing
- 💬 **Comments** - Threaded discussions on tasks
- 📎 **Attachments** - File upload/download with Supabase Storage
- 📊 **Activity Feed** - Real-time activity tracking across all actions
- 🔒 **Security** - Row-level security (RLS) on all tables
- 🎨 **Modern UI** - Clean interface with shadcn/ui components

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, React 19, Tailwind CSS
- **UI Components:** shadcn/ui
- **Backend:** Supabase (Auth, Postgres, RLS, Storage)
- **Icons:** lucide-react
- **Deployment:** Docker-ready with multi-stage build

## Getting Started

### Option 1: Local Development (Recommended for Development)

#### Prerequisites

- Node.js 20+ (LTS)
- npm 10+
- Supabase account ([Sign up free](https://supabase.com))

#### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini_jira
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   
   Get these from: Supabase Dashboard → Project Settings → API

4. **Set up Supabase database**
   
   In Supabase Dashboard → SQL Editor, run these migrations in order:
   - `ProjectDocs/migrations/004_create_comments_table.sql`
   - `ProjectDocs/migrations/005_create_attachments_table.sql`
   - `ProjectDocs/migrations/006_create_activity_table.sql`

5. **Set up Supabase Storage**
   
   Follow the instructions in `ProjectDocs/migrations/STORAGE_BUCKET_SETUP.md` to:
   - Create the "attachments" bucket
   - Configure storage policies

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open the app**
   
   Visit [http://localhost:3000](http://localhost:3000) and sign up!

### Option 2: Docker (Recommended for Production/Review)

#### Prerequisites

- Docker Desktop or Docker Engine
- Supabase account ([Sign up free](https://supabase.com))

#### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini_jira
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials (same as local dev)

3. **Set up Supabase** (same as Option 1, steps 4-5)
   - Apply database migrations
   - Configure storage bucket

4. **Build and run with Docker**
   ```bash
   docker-compose up --build
   ```
   
   Or manually:
   ```bash
   docker build -t mini-jira .
   docker run -p 3000:3000 --env-file .env.local mini-jira
   ```

5. **Open the app**
   
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/src
  /app          - Next.js App Router pages
  /components   - Reusable React components
    /ui         - shadcn/ui components
  /lib          - Utility functions
  /types        - TypeScript type definitions
/ProjectDocs    - Project documentation
  /contexts     - Project context and specifications
  /mockups      - UI mockups and design specifications
  /Build_Notes  - Implementation notes per milestone
```

## Development Milestones

- [x] **Milestone 0** - Repo + Foundation
- [x] **Milestone 1** - Supabase Connection + Auth
- [x] **Milestone 2** - Projects (CRUD)
- [x] **Milestone 3** - Tasks (CRUD + List UI)
- [x] **Milestone 4** - Task Detail + Comments
- [x] **Milestone 5** - Attachments (Storage)
- [x] **Milestone 6** - Docker + Packaging + Docs
- [x] **Milestone 7** - Activity Feed + Final Polish

## Database Migrations

All SQL migrations are located in `ProjectDocs/migrations/`. Apply them in order via Supabase SQL Editor:

1. `004_create_comments_table.sql` - Comments functionality
2. `005_create_attachments_table.sql` - Attachments functionality  
3. `006_create_activity_table.sql` - Activity tracking

**Note:** Migrations 001-003 (auth, projects, tasks) were applied during early development.

## Storage Setup

Follow the guide in `ProjectDocs/migrations/STORAGE_BUCKET_SETUP.md` to:
1. Create the "attachments" storage bucket
2. Configure bucket policies for secure file access

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server (after build)
- `npm run lint` - Run ESLint

## Docker Commands

```bash
# Build the Docker image
docker build -t mini-jira .

# Run the container
docker run -p 3000:3000 --env-file .env.local mini-jira

# Or use docker-compose
docker-compose up --build
```

## Troubleshooting

### "Module not found" or build errors
- Ensure all dependencies are installed: `npm install`
- Delete `.next` folder and rebuild: `rm -rf .next && npm run build`

### "Unauthorized" or "Not authenticated" errors
- Verify `.env.local` has correct Supabase credentials
- Check that Supabase project is active (not paused)
- Ensure RLS policies are applied

### Attachments upload fails
- Verify Storage bucket "attachments" exists
- Check that storage policies are configured
- Ensure bucket is private (not public)

### Activity feed is empty
- Activity tracking requires migration 006 to be applied
- Activities are only logged for new actions after migration

## Documentation

- [Project Context](./ProjectDocs/contexts/projectContext.md) - Full project specification
- [Mockup Specifications](./ProjectDocs/mockups/MOCKUP_SPECIFICATIONS.md) - UI design guidelines
- [Migration Files](./ProjectDocs/migrations/) - Database schema migrations
- [Build Notes](./ProjectDocs/Build_Notes/) - Implementation details per milestone

## Project Structure

```
/src
  /app                    - Next.js App Router
    /actions              - Server actions
    /app                  - Protected routes
      /projects/[id]      - Project task list
      /tasks/[id]         - Task detail page
    /login                - Authentication
  /components             - React components
    /auth                 - Login/signup forms
    /projects             - Project components
    /tasks                - Task components
    /ui                   - shadcn/ui primitives
  /lib                    - Utilities
    /supabase             - Supabase clients
  /types                  - TypeScript definitions
/ProjectDocs
  /migrations             - SQL migrations
  /mockups                - UI mockups
  /Build_Notes            - Implementation notes
```

## Security

- All tables use Row-Level Security (RLS)
- Users can only access their own data
- File uploads restricted to authenticated users
- Storage policies enforce owner-based access
- No service role keys exposed to client

## License

Private project for assessment purposes.
