# Vastra AI — Backend

Backend for **Vastra AI**, an AI-powered textile design platform. Built with Node.js, Express, and MongoDB on an MVC architecture. The AI image-generation service is a **separate Django REST Framework** app that communicates with this backend over REST.

> **Status:** Foundation only. Being built module by module — models, routes, controllers, and JWT auth are added in later steps.

## Tech Stack

- **Node.js** / **Express.js** — HTTP server & routing
- **MongoDB** / **Mongoose** — data layer
- **helmet**, **cors** — security hardening
- **morgan** — request logging
- **dotenv** — environment configuration

## Planned Roles

`brand` · `artisan` · `admin` (introduced when the auth module is added).

## Folder Structure

```
vastra/
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── server.js               # Entry point: loads env, connects DB, starts server
    ├── app.js                  # Express app: middleware, health check, error handling
    ├── config/
    │   └── db.js               # MongoDB connection
    └── middleware/
        └── errorMiddleware.js  # 404 + centralized error handler
```

As modules are added, this grows to include `models/`, `controllers/`, `routes/`, and `utils/`.

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

| Variable         | Description                                      | Example                                 |
|------------------|--------------------------------------------------|-----------------------------------------|
| `PORT`           | Port the server listens on                       | `5000`                                  |
| `NODE_ENV`       | Environment                                      | `development`                           |
| `MONGO_URI`      | MongoDB connection string                        | `mongodb://127.0.0.1:27017/vastra_ai`   |
| `CORS_ORIGIN`    | Allowed origins (comma-separated, or `*`)        | `*`                                     |
| `AI_SERVICE_URL` | Base URL of the Django AI image-generation service | `http://127.0.0.1:8000`               |

### 3. Run

```bash
npm run dev   # development (auto-reload via nodemon)
npm start     # production
```

### 4. Verify

```bash
curl http://localhost:5000/health
```

```json
{
  "success": true,
  "service": "vastra-ai-backend",
  "message": "API is running",
  "timestamp": "2026-07-08T00:00:00.000Z"
}
```

## License

MIT
