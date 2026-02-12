# Mini JIRA

**🚀 Live Demo:** [https://mini-jira-beta.vercel.app](https://mini-jira-beta.vercel.app)

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
- **Deployment:** Vercel (production), Docker-ready

## Quick Start (Local Development)

**Prerequisites:**
- Node.js 20+, npm 10+
- Supabase account ([free tier](https://supabase.com))

**Setup:**
```bash
# Clone and install
git clone <repository-url>
cd mini_jira
npm install

# Configure environment
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local

# Apply database migrations (in Supabase Dashboard → SQL Editor)
# Run migrations from ProjectDocs/migrations/ in order: 004, 005, 006

# Set up storage bucket
# Follow ProjectDocs/migrations/STORAGE_BUCKET_SETUP.md

# Run the app
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

**Docker:**
```bash
docker-compose up --build
```

📖 **Detailed Setup:** See [ProjectDocs/migrations/COMPLETE_MIGRATION_GUIDE.md](ProjectDocs/migrations/COMPLETE_MIGRATION_GUIDE.md)

## Documentation

- [Complete Migration Guide](./ProjectDocs/migrations/COMPLETE_MIGRATION_GUIDE.md) - Database setup
- [Project Context](./ProjectDocs/contexts/projectContext.md) - Full specification
- [Build Notes](./ProjectDocs/Build_Notes/) - Implementation details

## Architecture

- **Next.js App Router** with server/client components
- **Supabase** for auth, database, and storage
- **Row-Level Security (RLS)** - users can only access their own data
- **shadcn/ui** components with Tailwind CSS

## Development

All milestones (0-7) complete. See [Build Notes](./ProjectDocs/Build_Notes/) for implementation details.

---

Built for assessment purposes.
