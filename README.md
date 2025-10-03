# Exam System (React + Tailwind + Express + SQLite)

A full-stack exam platform with role-based access (student, instructor, admin).

## Tech Stack
- Frontend: React + Vite + TailwindCSS, react-router-dom
- Backend: Node.js, Express, SQLite
- Auth: JWT stored in localStorage

## Features Roadmap
- Week 1: Auth (Login/Signup), role-based dashboards and redirects
- Week 2: Exams & Questions (create, list, add/get questions)
- Week 3: Submissions & Evaluation (attempt exam, timer, autosave, results)
- Week 4: Leaderboard, Admin, and UI polish

## Getting Started

### Backend
1. Copy `server/.env.example` to `server/.env` and set values.
2. Install deps:
   ```bash
   npm install --prefix server
   ```
3. Run dev server:
   ```bash
   npm run dev --prefix server
   ```
   Backend runs on http://localhost:4000

### Frontend
1. Install deps:
   ```bash
   npm install --prefix client
   ```
2. Run dev server:
   ```bash
   npm run dev --prefix client
   ```
   Frontend runs on http://localhost:5173

### Default Roles
- student, instructor, admin

### Notes
- JWT is saved in localStorage under `token`.
- Role-based protected routes on the client using `ProtectedRoute`.
- SQLite DB file stored at `server/data/app.db` (auto-created).
