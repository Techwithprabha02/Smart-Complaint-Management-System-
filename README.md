<<<<<<< HEAD
# Smart Complaint Management System

Civic tech web app for reporting and tracking local infrastructure complaints.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB
- **Auth:** JWT + bcrypt
- **Maps:** Google Maps API
- **Storage:** Cloudinary
- **AI:** OpenAI (complaint priority)

## Quick Start (Backend)

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MongoDB URI and secrets.

2. Install and run server:
   ```bash
   cd server
   npm install
   npm run seed    # optional: admin + sample data
   npm run dev
   ```

3. API base: `http://localhost:5000/api`

### Seed credentials

| Role  | Email                 | Password   |
|-------|-----------------------|------------|
| Admin | admin@fixmycity.com   | Admin@123  |
| User  | user@fixmycity.com    | User@123   |

## API Routes

### Auth `/api/auth`
- `POST /register` — Register user
- `POST /login` — Login (returns JWT)
- `GET /me` — Current user (Bearer token)

### Complaints `/api/complaints` (protected)
- `GET /` — Own complaints (user) or all (admin)
- `POST /` — Submit complaint (multipart: `media` files)
- `GET /:id` — Complaint detail
- `PATCH /:id/status` — Update status (admin)
- `DELETE /:id` — Delete (admin)

### Admin `/api/admin` (admin only)
- `GET /stats` — Dashboard statistics
- `GET /complaints?status=&category=&priority=` — Filtered list

## Quick Start (Frontend)

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173` (proxies `/api` to backend).

## Run Full Stack

1. Start MongoDB and configure root `.env`
2. Terminal 1: `cd server && npm run dev`
3. Terminal 2: `cd client && npm run dev`

## Deployment (Vercel + Render)

| Platform | What | Config |
|----------|------|--------|
| **Render** | Express API | [`render.yaml`](./render.yaml) |
| **Vercel** | React app | [`client/vercel.json`](./client/vercel.json) |

Full step-by-step guide: **[DEPLOY.md](./DEPLOY.md)**

Quick summary:
1. Deploy `server/` to **Render** (MongoDB Atlas required)
2. Deploy `client/` to **Vercel** with `VITE_API_BASE_URL=https://your-api.onrender.com/api`
3. Set Render `CLIENT_URL` to your Vercel domain for CORS

## Project Structure

```
complaint-system/
├── client/          # React + Vite (Vercel)
│   └── vercel.json
├── server/          # Express API (Render)
├── render.yaml      # Render Blueprint
├── DEPLOY.md
└── .env
```
=======
# Smart-Complaint-Management-System-
>>>>>>> 36f3ce96c06bc0c691add45dc296a6076de2d6ef
