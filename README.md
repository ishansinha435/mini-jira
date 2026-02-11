# Mini JIRA

A visually polished, personal Jira-style task tracker built with Next.js, Supabase, and shadcn/ui.

## Tech Stack

- **Frontend:** Next.js 15+ (App Router), TypeScript, React 19, Tailwind CSS
- **UI Components:** shadcn/ui
- **Backend:** Supabase (Auth, Postgres, RLS, Storage)
- **Icons:** lucide-react

## Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- npm 10+

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

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

- [x] **Milestone 0** - Repo + Foundation (Complete)
  - [x] Stage 1: Next.js + TypeScript + Tailwind setup
  - [x] Stage 2: Project structure
  - [x] Stage 3: shadcn/ui installation
  - [x] Stage 4: App shell & navigation
  - [x] Stage 5: Dashboard home page
- [ ] **Milestone 1** - Supabase Connection + Auth
- [ ] **Milestone 2** - Projects (CRUD)
- [ ] **Milestone 3** - Tasks (CRUD + List UI)
- [ ] **Milestone 4** - Task Detail + Comments
- [ ] **Milestone 5** - Attachments (Storage)
- [ ] **Milestone 6** - Docker + Packaging + Docs
- [ ] **Milestone 7** - Activity Feed + Final Polish (Optional)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Documentation

- [Project Context](./ProjectDocs/contexts/projectContext.md) - Full project specification
- [Mockup Specifications](./ProjectDocs/mockups/MOCKUP_SPECIFICATIONS.md) - UI design guidelines
- [Cursor Rules](./.cursor/rules/nextjs-supabase-standards.mdc) - Development standards

## License

Private project for assessment purposes.
