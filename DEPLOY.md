# Deploy: Vercel (frontend) + Render (backend)

## Prerequisites

1. **MongoDB Atlas** — [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a free cluster → Database Access (user) → Network Access (allow `0.0.0.0/0` for Render)
   - Copy connection string → use as `MONGO_URI`

2. **GitHub repo** with this project pushed

3. Optional: Cloudinary, OpenAI, Google Maps API keys

---

## 1. Deploy API on Render

### Option A — Blueprint (`render.yaml`)

1. [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**
2. Connect your GitHub repo (root must contain `render.yaml`)
3. Set secret env vars when prompted:
   - `MONGO_URI` — Atlas connection string
   - `CLIENT_URL` — leave blank for now; set after Vercel deploy
   - Cloudinary keys (if using uploads)
4. Click **Apply** → wait for deploy
5. Copy your service URL, e.g. `https://fixmycity-api.onrender.com`

### Option B — Manual Web Service

| Setting | Value |
|---------|--------|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

**Environment variables (Render → Environment):**

| Key | Example |
|-----|---------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb+srv://...` |
| `JWT_SECRET` | long random string |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | `https://your-app.vercel.app` |
| `CLOUDINARY_*` | optional |
| `OPENAI_API_KEY` | optional |

### Seed production database (optional)

Render Dashboard → your service → **Shell**:

```bash
npm run seed
```

### Verify API

```bash
curl https://YOUR-SERVICE.onrender.com/api/health
```

---

## 2. Deploy frontend on Vercel

1. [vercel.com/new](https://vercel.com/new) → Import GitHub repo
2. **Root Directory** → set to `client` (important)
3. Framework should auto-detect **Vite** (`vercel.json` is included)
4. **Environment Variables:**

| Key | Value |
|-----|--------|
| `VITE_API_BASE_URL` | `https://YOUR-SERVICE.onrender.com/api` |
| `VITE_GOOGLE_MAPS_API_KEY` | your Google Maps key |

5. **Deploy**

6. Copy your Vercel URL, e.g. `https://fixmycity.vercel.app`

---

## 3. Link frontend ↔ backend

1. **Render** → Environment → set `CLIENT_URL` to your Vercel URL (no trailing slash)  
   For preview deployments too:
   ```
   https://fixmycity.vercel.app,https://fixmycity-git-main-you.vercel.app
   ```
2. **Redeploy** Render service (or wait for auto-redeploy)
3. **Google Cloud Console** → Maps API → restrict HTTP referrers to your Vercel domain

---

## 4. Post-deploy checklist

- [ ] `GET https://YOUR-API.onrender.com/api/health` returns `{ "status": "ok" }`
- [ ] Login works from Vercel URL
- [ ] Submit complaint (with/without media)
- [ ] Admin dashboard loads for `admin@fixmycity.com`

---

## Notes

- **Render free tier** — service sleeps after ~15 min idle; first request may take 30–60s (cold start).
- **CORS** — only origins listed in `CLIENT_URL` are allowed in production.
- **Vercel previews** — add each preview URL to `CLIENT_URL` on Render, comma-separated.
- **Do not commit** `.env` files; use platform secret managers only.
