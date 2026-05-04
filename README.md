# Pomodoro Focus

Offline-first Pomodoro timer (similar to [Pomofocus](https://pomofocus.io/)) built with **Next.js 16**, **React 19**, **Dexie (IndexedDB)**, and **Serwist** for installable PWA support.

## Features

- Pomodoro / short break / long break with customizable durations
- Tasks linked to the timer (estimates, completed pomodoros, reorder)
- Local history and charts (today, week, total, streak)
- PWA: install on Android (Chrome) and iOS (Safari → Add to Home Screen)
- Settings: sounds, ticking, notifications, theme, auto-switch / auto-start
- Wake lock during focus sessions; keyboard **Space** toggles start/pause (when not typing in a field)

## Scripts

Use the app at [http://localhost:3000/](http://localhost:3000/) (there is no locale prefix; `/en` redirects to `/`).

```bash
npm run dev      # next dev --webpack (required for Serwist in dev)
npm run build    # next build --webpack
npm run start
npm run lint
npm test         # Vitest (timer logic)
npm run icons    # regenerate PNG icons in public/icons (sharp)
```

## Tech notes

- **Webpack** is used for `dev`/`build` because `@serwist/next` injects a webpack configuration (Turbopack is the default in Next 16).
- Service worker is **disabled in development** (`disable: process.env.NODE_ENV === "development"` in `next.config.ts`); test install/offline with `npm run build && npm start`.
- Timer runtime state is mirrored to `localStorage`; tasks, sessions, and settings live in **IndexedDB**.

## Privacy

All data stays in the browser. There is no backend or sync in v1.
