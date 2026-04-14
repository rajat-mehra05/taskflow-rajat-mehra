# TaskFlow Frontend

---

## 1. Overview

TaskFlow is a lightweight task manager where small teams can spin up projects, break work into tasks and track progress on a Kanban board. It's a frontend-only build against a mocked REST API that mirrors a realistic backend contract end to end.

**Features**

- Email/password auth (register, login, logout) with session persistence
- Projects list with create and delete
- Project detail page with a three-column Kanban (Todo · In Progress · Done)
- Task create / edit / delete modal with title, description, status, priority, assignee and due date
- Filter tasks by status and assignee (state persisted in URL)
- Responsive layout (375px and 1280px), light/dark mode
- Loading, error and empty states on every data-driven view

**Tech stack**

- React 19 + TypeScript (strict), Vite
- React Router 7 for navigation
- TanStack Query for server state + cache
- React Hook Form + Zod for forms and validation
- Tailwind CSS 4 + shadcn-style components built on Base UI primitives
- MSW (Mock Service Worker) for the API
- `@dnd-kit` for drag-and-drop status changes on the Kanban board (mouse, touch and keyboard)

---

## 2. Architecture Decisions

**Mock API over a real backend.** This is a frontend-only build, so MSW intercepts `fetch` in the browser and returns from an in-memory DB (`src/mocks/data.ts`). This keeps the app a single process, makes the code testable without network and mirrors a realistic REST contract. The tradeoff: state resets on page reload. Acceptable for a demo and documented below under "What I'd Do With More Time."

**Server state lives in TanStack Query, UI state lives in components / URL.** Data fetching, caching and invalidation are all handled by React Query. Filter state (status, assignee) is stored in URL search params instead of component state. The URL is shareable, survives refresh and is a natural fit for "which slice of the data am I looking at." React Context is reserved for truly cross-cutting concerns (auth, theme).

**Forms are Zod-validated at the boundary.** Every form defines a Zod schema and `z.infer<typeof schema>` produces the TypeScript type. One source of truth for validation and types. Server-side validation errors map back to field-level errors.

**Component library: shadcn/ui on Base UI.** Source-owned components (not an npm dependency tree). This gives us full design control while keeping keyboard, focus and ARIA handling correct. Customisation is plain Tailwind + React with no theme-provider gymnastics.

**Strict TypeScript with no escape hatches.** `strict: true`, `noUncheckedIndexedAccess: true`, `no-explicit-any` and `no-non-null-assertion` as ESLint errors. Discriminated unions for prop shapes with multiple modes (e.g. `TaskModal` create vs. edit) so that mutually exclusive fields are enforced at the type level instead of via runtime checks.

**What I intentionally left out**

- Backend. Not required for the frontend role
- Real-time updates. No backend to source events from
- Automated test suite. See "What I'd Do With More Time" for the shape I'd ship in production

---

## 3. Running Locally

### Option A: Docker (recommended, zero setup)

Docker Desktop is the only prerequisite.

```bash
git clone https://github.com/rajat-mehra05/taskflow-rajat-mehra-fe.git
cd taskflow-rajat-mehra-fe
cp .env.example .env
docker compose up --build
# App available at http://localhost:3000
```

The frontend is built in a Node 20 stage and served from a minimal Nginx alpine runtime (multi-stage Dockerfile in `frontend/Dockerfile`). Nginx is configured for SPA fallback, gzip and cache headers (`frontend/nginx.conf`). The host port is configurable via `FRONTEND_PORT` in `.env` (default `3000`).

### Option B: Local dev server

Node 20+ required.

```bash
git clone https://github.com/rajat-mehra05/taskflow-rajat-mehra-fe.git
cd taskflow-rajat-mehra-fe/frontend
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

API calls are intercepted by **MSW (Mock Service Worker)**. The browser makes real `fetch` calls that MSW handles in a service worker. No mock server process is needed.

- Worker script: `frontend/public/mockServiceWorker.js` (generated via `npx msw init`)
- Handlers: `frontend/src/mocks/handlers/` with one file per resource (`auth`, `projects`, `tasks`)
- In-memory DB + seed data: `frontend/src/mocks/data.ts`
- Worker is started in `src/main.tsx` before React mounts. In production builds MSW is not loaded.

The handlers cover the full REST surface the app uses (auth, projects, tasks) including `?status=` and `?assignee=` filters on the tasks list endpoint and realistic error response shapes (400 with `fields`, 401, 403, 404).

---

## 5. Test Credentials

```
Email:    test@example.com
Password: password123
```

The login screen also has a **Continue as Test User** button that fills in and submits these credentials in one click.

Registration also works. New users are added to the in-memory store for the session.

---

## 6. What I'd Do With More Time

Honest list of shortcuts I took and what I'd tackle next, roughly in priority order.

**Testing is the biggest gap before this is production-ready**

This build was time-boxed and I prioritised breadth of features over a test suite. The shape I'd ship:

- Unit tests for Zod schemas, filter/sort helpers and date/avatar utilities (fast, high value).
- Integration tests with React Testing Library + MSW for the critical flows: login, project create/delete, task create/edit/delete, Kanban drag-and-drop and the optimistic-update revert path.
- One Playwright E2E covering the golden path (login then create project then create task then drag across columns then logout).
- CI on GitHub Actions running `lint` then `type-check` then `test` then `build`, blocking merges on failure.

**Real backend**

Replace MSW with a Go + Postgres service behind the exact same REST contract. Removing the MSW bootstrap in `main.tsx` is the only frontend change required.

**Persist the mock DB across reloads**

Today the in-memory MSW store resets on refresh. Sessions survive (auth is in `localStorage`) but created projects and tasks don't. Mirroring mutations to `localStorage` would make demo sessions feel like a real app without needing a backend.

**Real-time collaboration**

WebSocket or SSE for live task updates across clients. Only meaningful once a real backend exists, so deferred.

**Accessibility polish beyond DnD**

Keyboard shortcuts for column-to-column task movement, a live region announcing status changes and a full `axe-core` pass. The drag-and-drop is already keyboard-accessible via `@dnd-kit`. The rest of the app deserves the same rigour.

**Richer task cards and board**

Short task IDs on cards, per-column quick-add, a column overflow menu (rename/clear-done) and per-column sort (priority or due date).

**Error and offline UX**

A global toast system for mutation failures (instead of per-component error states), a retry affordance on failed fetches and a proper offline banner when MSW or the real API is unreachable.

**Observability hooks**

Even for a demo, wiring Sentry plus a lightweight analytics shim behind an env flag would make it trivial to debug issues reported by reviewers.
