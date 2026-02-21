# Deploy Sattva Clinic (frontend only)

No backend required. Data is stored in the browser (localStorage).

## Build

```bash
npm install
npm run build
```

Output: `build/` (static files).

## Deploy to Vercel

1. Push repo and connect to Vercel (or use Vercel CLI: `npx vercel`).
2. **Root Directory:** `frontend` (if repo root is parent) or leave default if you’re inside `frontend`.
3. **Build Command:** `npm run build`
4. **Output Directory:** `build`
5. Deploy. Routes like `/admin/login` work via `vercel.json` rewrites.

## Admin login (after deploy)

- URL: `https://your-domain.com/admin/login`
- **Username:** `adminSattva`
- **Password:** `Sattva#2026`

Change these in `src/services/localStorageApi.js` (DEFAULT_ADMIN) and rebuild if needed.
