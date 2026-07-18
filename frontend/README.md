# Vastra AI — Frontend

React + Bootstrap 5 frontend for **Vastra AI**, the AI-powered textile design
platform. It talks to the Express/MongoDB backend in this repo's root and (in
future) the separate Django AI image-generation service.

## Tech Stack

- **React 18** + **Vite** — app & dev server
- **Bootstrap 5** — layout & components, themed with an Indian-textile palette
- **React Router 6** — routing (public + protected routes)
- **Axios** — API client with JWT auth interceptors
- **Context API** — authentication state (`AuthContext`)

## Getting Started

```bash
cd frontend
cp .env.example .env      # optional; dev works with the built-in proxy
npm install
npm run dev               # http://localhost:5173
```

The dev server proxies `/api` and `/health` to the backend on
`http://localhost:5000`, so run the backend too:

```bash
# from the repo root, in a separate terminal
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to point at a deployed API instead of the
proxy. `npm run build` produces a static bundle in `dist/`.

## What's wired to the backend today

| Feature | Status |
|---|---|
| **Register / Login / Session** | ✅ Live against `/api/auth` (JWT stored in `localStorage`) |
| **Material Explorer** | ✅ Live against `/api/materials` (filters + pagination) |
| **Design Studio generation** | 🟡 Mocked in `services/designService.js` until the Django AI service is connected |
| **Community, Subscription** | 🟡 In-memory mock services (future backend modules) |
| **Encyclopedia, Marketplace, Heritage** | 🟡 Static data in `src/data/` (curated content) |

### Auth reconciliation with the backend

The backend's signup accepts `name`, `email`, `password`, and an optional
`role` of **`brand`** or **`artisan`** only. Accordingly:

- The Register form offers **Brand** and **Artisan** roles.
- `phone` is collected in the UI but not yet persisted (no backend field).
- A "Free User" tier is represented in the UI/plans but maps to a `brand`
  account today; add a dedicated backend role when that tier ships.

## Structure

```
src/
├── assets/            # images, icons, logo (placeholders)
├── components/        # Navbar, Footer, Cards, Buttons, Forms, Loader, Sidebar, Modal, common
├── pages/             # Home, Login, Register, Dashboard, DesignStudio, Community,
│                      #   Encyclopedia, Marketplace, Materials, Pricing, Subscription, Profile, Admin
├── services/          # apiClient + auth/material/design/community/subscription services
├── context/           # AuthContext (Context API)
├── hooks/             # useAuth
├── routes/            # AppRoutes + ProtectedRoute
├── data/              # heritage, encyclopedia, community, artisans, plans (mock/curated)
├── utils/             # formatters, constants
├── styles/theme.css   # design tokens + Bootstrap overrides
└── App.jsx / main.jsx
```

## Design theme

- **Primary:** Deep Indigo `#1E3A8A` · **Secondary:** Saffron `#F59E0B` ·
  **Accent:** Emerald `#10B981` · **Background:** Warm off-white `#F8F5F2`
- **Headings:** Poppins · **Body:** Inter (loaded from Google Fonts; falls back
  to system fonts offline)

## Signature feature — Heritage Inspiration

Selecting a pattern in the Design Studio surfaces a **Heritage Inspiration**
panel with that craft's history, authentic colours, recommended materials and
motifs, plus a deep link into the Textile Encyclopedia — connecting the AI
generator, material recommendations and encyclopedia into one educational flow.

## Build order (per the product plan)

Phase 1 (Landing, Auth, Dashboard, Navbar/Footer) and the Design Studio are
built out. Community, Encyclopedia, Marketplace, Pricing, Subscription, Profile
and Admin ship as functional, styled pages ready to be wired to their APIs as
those backend modules land.
