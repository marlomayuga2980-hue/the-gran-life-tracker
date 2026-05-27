# The Gran Life — Launch Tracker

A full-stack project management + time-tracking app for The Gran Life brand launch. Built for Marlo (admin) and Alison Richardson (read-only client view).

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** (custom brand tokens)
- **Prisma ORM + SQLite** (local file database — no external DB needed)
- **shadcn/ui** components
- **date-fns** for date utilities

---

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Run database migrations

```bash
npx prisma migrate dev --name init
```

This creates `prisma/dev.db` (the local SQLite database) and generates the Prisma client.

### 3. Seed the database

```bash
npx prisma db seed
```

This populates the database with all 13 pre-configured tasks across the 3 phases.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Views

| View | Access | Description |
|------|--------|-------------|
| **Marlo** | Admin | Full CRUD — add/edit/delete tasks, cycle statuses, edit notes, log time |
| **Alison** | Read-only | Clean client dashboard — tasks, progress, status, notes (no edit controls) |

Toggle between views using the **Marlo / Alison** pill buttons in the top-right of the header.

---

## Features

### Task Board
- Tasks grouped by phase with a progress bar per phase
- Overall progress bar at the top
- Status cycling — click a status badge to advance it: `Not Started → In Progress → Done → Blocked`
- Expandable step lists per task
- Inline notes editing (saves on blur)
- Full CRUD via Add Task button and Edit / Delete controls on each card

### Time Tracker (Marlo only)
- Clockify-style weekly time log
- Navigate between weeks with ← / → buttons
- Add entries: select task, date, hours (0.25 step), optional notes
- Entries auto-save when you click the ✓ save button
- Week Summary sidebar: hours per task + total for the week

### Client View (Alison)
- Read-only — no edit controls visible
- Polished dashboard with navy header banner
- 🔒 Client View watermark in the bottom-right corner

---

## Database Management

```bash
# Open Prisma Studio (visual DB browser)
npx prisma studio

# Reset and re-seed the database
npx prisma migrate reset
npx prisma db seed

# Re-generate Prisma client after schema changes
npx prisma generate
```

---

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Navy | `#2C3E6B` | Header, primary text |
| Accent Blue | `#4A6FA5` | In Progress badge, links |
| Soft Blue | `#8BA7C9` | Hover states |
| Periwinkle | `#C9D9F4` | Card borders, subtle backgrounds |
| Gold | `#D6BC8A` | Progress bars, active accents |
| Off White | `#F6F7F9` | Page background |
| Cool Gray | `#D1D8E4` | Dividers, Not Started badge |
| Dark Neutral | `#2A3340` | Body text |

---

## API Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/tasks` | Fetch all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/[id]` | Update a task |
| DELETE | `/api/tasks/[id]` | Delete a task |
| GET | `/api/time-entries?weekStart=ISO` | Fetch entries for a week |
| POST | `/api/time-entries` | Log a time entry |
| PUT | `/api/time-entries/[id]` | Update an entry |
| DELETE | `/api/time-entries/[id]` | Delete an entry |
