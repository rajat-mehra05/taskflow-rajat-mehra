# TaskFlow — Frontend

A minimal task management UI. Users can log in, browse projects, create/edit/delete tasks, assign them to teammates, and move tasks across status columns on a Kanban board.

Frontend-only submission, built against a mocked API per the assignment's Appendix A spec.

---

## 1. Overview

**What it does**

- Email/password auth (register, login, logout) with session persistence
- Projects list with create and delete
- Project detail page with a three-column Kanban (Todo · In Progress · Done)
- Task create / edit / delete modal — title, description, status, priority, assignee, due date
- Filter tasks by status and assignee (state persisted in URL)
- Responsive layout (375px and 1280px), light/dark mode
- Loading, error, and empty states on every data-driven view

**Tech stack**

- React 19 + TypeScript (strict), Vite
- React Router 7 for navigation
- TanStack Query for server state + cache
- React Hook Form + Zod for forms and validation
- Tailwind CSS 4 + shadcn-style components built on Base UI primitives
- MSW (Mock Service Worker) for the API
- `@dnd-kit` for drag-and-drop status changes on the Kanban board (mouse, touch, and keyboard)

---

## 2. Architecture Decisions

**Mock API over a real backend.** The assignment is frontend-only. MSW intercepts `fetch` in the browser and returns from an in-memory DB (`src/mocks/data.ts`). This keeps the app a single process, makes the code testable without network, and mirrors the exact endpoints from Appendix A. The tradeoff: state resets on page reload. Acceptable for a demo; documented below under "What I'd do with more time."

**Server state lives in TanStack Query, UI state lives in components / URL.** Data fetching, caching, and invalidation are all handled by React Query. Filter state (status, assignee) is stored in URL search params instead of component state — the URL is shareable, survives refresh, and is a natural fit for "which slice of the data am I looking at." React Context is reserved for truly cross-cutting concerns (auth, theme).

**Forms are Zod-validated at the boundary.** Every form defines a Zod schema, and `z.infer<typeof schema>` produces the TypeScript type. One source of truth for validation and types. Server-side validation errors map back to field-level errors.

**Component library: shadcn/ui on Base UI.** Source-owned components (not an npm dependency tree). This gives us full design control while keeping keyboard, focus, and ARIA handling correct. Customization is plain Tailwind + React — no theme-provider gymnastics.

**Strict TypeScript with no escape hatches.** `strict: true`, `noUncheckedIndexedAccess: true`, `no-explicit-any` and `no-non-null-assertion` as ESLint errors. Discriminated unions for prop shapes with multiple modes (e.g. `TaskModal` create vs. edit) — mutually exclusive fields are enforced at the type level instead of via runtime checks.

**What I intentionally left out**

- Backend — not required for the frontend role
- Real-time updates — no backend to source events from
- Automated test suite — see "What I'd Do With More Time" for the shape I'd ship in production

---

## 3. Running Locally

### Option A — Docker (recommended, zero setup)

Docker Desktop is the only prerequisite.

```bash
git clone <repo-url>
cd greening-india-assignment
cp .env.example .env
docker compose up --build
# App available at http://localhost:3000
```

The frontend is built in a Node 20 stage and served from a minimal Nginx alpine runtime (multi-stage Dockerfile in `frontend/Dockerfile`). Nginx is configured for SPA fallback, gzip, and cache headers (`frontend/nginx.conf`). The host port is configurable via `FRONTEND_PORT` in `.env` (default `3000`).

### Option B — Local dev server

Node 20+ required.

```bash
cd greening-india-assignment/frontend
npm install
npm run dev
# App available at http://localhost:5173
```

Other scripts:

```bash
npm run build         # type-check + production build
npm run lint          # ESLint
npm run format        # Prettier write
npm run type-check    # tsc --noEmit
```

---

## 4. Mock API Setup

API calls are intercepted by **MSW (Mock Service Worker)** — the browser makes real `fetch` calls that MSW handles in a service worker. No mock server process is needed.

- Worker script: `frontend/public/mockServiceWorker.js` (generated via `npx msw init`)
- Handlers: `frontend/src/mocks/handlers/` — one file per resource (`auth`, `projects`, `tasks`)
- In-memory DB + seed data: `frontend/src/mocks/data.ts`
- Worker is started in `src/main.tsx` before React mounts; in production builds, MSW is not loaded.

Endpoints implemented match Appendix A of the assignment (auth, projects, tasks), including `?status=` and `?assignee=` filters on the tasks list endpoint and the documented error response shapes (400 with `fields`, 401, 403, 404).

---

## 5. Test Credentials

Two seed users are available. Use either:

```
Email:    test@example.com
Password: password123
```

```
Email:    jane@example.com
Password: secret123
```

Registration also works — new users are added to the in-memory store for the session.

---

## 6. What I'd Do With More Time

- **Automated tests — the biggest gap before this is production-ready.** The shape I'd ship:
  - Unit tests for Zod schemas, sort/filter helpers, and avatar/date utilities.
  - Integration tests with RTL + MSW for the critical flows — login, project create, task create/edit/delete, status change via drag-and-drop, and the optimistic-update revert path.
  - A small Playwright suite for one golden-path E2E (login → create project → create task → move it across columns → log out).
  - Wire these into CI (GitHub Actions): `lint → type-check → test` on every push, block merges on failure.
- **Real backend + Postgres.** Replace MSW with a Go service behind the same REST contract. No frontend changes needed beyond removing the MSW bootstrap.
- **Persist mock state.** Right now the MSW DB resets on refresh. Writing it to `localStorage` on every mutation would make demo sessions feel real.
- **Real-time updates.** WebSocket or SSE for collaborative task edits. Only meaningful once a real backend exists.
- **More keyboard polish.** Column-to-column task movement via keyboard shortcuts (pairs well with the drag-and-drop accessibility story).
- **Richer task cards.** Task ID label, column quick-add button, column overflow menu, and per-column sort — sketched in `plan.md` Phase 8.
