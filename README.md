# Vastra AI — Backend

Backend for **Vastra AI**, an AI-powered textile design platform. Built with Node.js, Express, and MongoDB on an MVC architecture. The AI image-generation service is a **separate Django REST Framework** app that communicates with this backend over REST.

> **Status:** Foundation + Authentication. Being built module by module — Materials, Designs, Artisan profiles, and AI integration come in later steps.

## Tech Stack

- **Node.js** / **Express.js** — HTTP server & routing
- **MongoDB** / **Mongoose** — data layer
- **helmet**, **cors** — security hardening
- **morgan** — request logging
- **dotenv** — environment configuration

## Roles

`brand` · `artisan` · `admin`. Brands and artisans self-register; the `admin` role can only be assigned in the database or by an existing admin — never through public signup.

## Folder Structure

```
vastra/
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── server.js                 # Entry point: loads env, connects DB, starts server
    ├── app.js                    # Express app: middleware, routes, health check, errors
    ├── config/
    │   ├── db.js                 # MongoDB connection
    │   └── roles.js              # Role constants (brand/artisan/admin)
    ├── models/
    │   └── User.js               # User schema + bcrypt hashing
    ├── controllers/
    │   └── authController.js     # signup / login / me / admin handlers
    ├── routes/
    │   ├── index.js              # Mounts feature routers under /api
    │   └── authRoutes.js         # /api/auth endpoints
    ├── middleware/
    │   ├── authMiddleware.js     # protect (JWT) + authorize (RBAC)
    │   └── errorMiddleware.js    # 404 + centralized error handler
    └── utils/
        ├── ApiError.js           # Error carrying an HTTP status code
        ├── asyncHandler.js       # Async controller wrapper
        ├── generateToken.js      # JWT signing
        └── validators.js         # Signup/login input validation
```

## Authentication

| Method | Endpoint            | Access          | Description                         |
|--------|---------------------|-----------------|-------------------------------------|
| POST   | `/api/auth/signup`  | Public          | Register a brand or artisan         |
| POST   | `/api/auth/login`   | Public          | Authenticate, returns a JWT         |
| GET    | `/api/auth/me`      | Private (any)   | Current authenticated user          |
| GET    | `/api/auth/admin`   | Private (admin) | Example role-restricted route       |

Authenticated requests send the token in a header:

```
Authorization: Bearer <token>
```

### Examples

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Nova Label","email":"nova@brand.com","password":"secret123","role":"brand"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nova@brand.com","password":"secret123"}'

# Current user (protected)
curl http://localhost:5000/api/auth/me -H "Authorization: Bearer <token>"
```

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
| `JWT_SECRET`     | Secret used to sign JWTs (use a long random)     | `a_long_random_secret`                  |
| `JWT_EXPIRES_IN` | Token lifetime                                   | `7d`                                    |
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
