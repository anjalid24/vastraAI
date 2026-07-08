# Vastra AI — Backend

Production-ready Node.js + Express + MongoDB REST API for **Vastra AI**, built on an MVC architecture with JWT authentication and role-based access control.

## Tech Stack

- **Node.js** / **Express** — HTTP server & routing
- **MongoDB** / **Mongoose** — data layer
- **JWT** (`jsonwebtoken`) — stateless authentication
- **bcryptjs** — password hashing
- **helmet**, **cors**, **express-rate-limit** — security hardening
- **morgan** — request logging

## Roles

| Role      | Description                                        |
|-----------|----------------------------------------------------|
| `brand`   | Fashion brands — create/manage designs & materials |
| `artisan` | Craftspeople — manage artisan profiles & materials |
| `admin`   | Full access — manage users and all resources       |

## Folder Structure

```
vastra/
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── server.js              # Entry point (loads env, connects DB, starts server)
    ├── app.js                 # Express app, middleware, route mounting
    ├── config/
    │   ├── db.js              # MongoDB connection
    │   └── roles.js          # Role constants
    ├── models/
    │   ├── User.js
    │   ├── Artisan.js
    │   ├── Material.js
    │   └── Design.js
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── artisanController.js
    │   ├── materialController.js
    │   └── designController.js
    ├── routes/
    │   ├── index.js
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── artisanRoutes.js
    │   ├── materialRoutes.js
    │   └── designRoutes.js
    ├── middleware/
    │   ├── authMiddleware.js   # protect + authorize (RBAC)
    │   └── errorMiddleware.js  # 404 + centralized error handler
    └── utils/
        ├── generateToken.js
        └── asyncHandler.js
```

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local instance or MongoDB Atlas)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable         | Description                                   | Example                                   |
|------------------|-----------------------------------------------|-------------------------------------------|
| `PORT`           | Port the server listens on                    | `5000`                                    |
| `NODE_ENV`       | Environment                                   | `development`                             |
| `MONGO_URI`      | MongoDB connection string                     | `mongodb://127.0.0.1:27017/vastra_ai`     |
| `JWT_SECRET`     | Secret used to sign JWTs (use a long random)  | `a_long_random_secret`                    |
| `JWT_EXPIRES_IN` | Token lifetime                                | `7d`                                      |
| `CORS_ORIGIN`    | Allowed origins (comma-separated, or `*`)     | `*`                                       |

### 3. Run the server

```bash
# development (auto-reload)
npm run dev

# production
npm start
```

Verify it's up:

```bash
curl http://localhost:5000/health
```

## API Reference

Base URL: `http://localhost:5000/api`

Authenticated requests require a header:

```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint         | Access  | Description               |
|--------|------------------|---------|---------------------------|
| POST   | `/auth/register` | Public  | Register (brand/artisan)  |
| POST   | `/auth/login`    | Public  | Login, returns JWT        |
| GET    | `/auth/me`       | Private | Current user profile      |

> Note: The `admin` role cannot be self-assigned at registration. Promote a user via the admin `PUT /users/:id` route (or seed one directly in the database).

### Users (Admin only)

| Method | Endpoint      | Description        |
|--------|---------------|--------------------|
| GET    | `/users`      | List all users     |
| GET    | `/users/:id`  | Get one user       |
| PUT    | `/users/:id`  | Update role/status |
| DELETE | `/users/:id`  | Delete a user      |

### Artisans

| Method | Endpoint         | Access                  |
|--------|------------------|-------------------------|
| GET    | `/artisans`      | Public                  |
| GET    | `/artisans/:id`  | Public                  |
| POST   | `/artisans`      | Artisan, Admin          |
| PUT    | `/artisans/:id`  | Owner Artisan, Admin    |
| DELETE | `/artisans/:id`  | Owner Artisan, Admin    |

### Materials

| Method | Endpoint          | Access                 |
|--------|-------------------|------------------------|
| GET    | `/materials`      | Public (`?type=`)      |
| GET    | `/materials/:id`  | Public                 |
| POST   | `/materials`      | Brand, Artisan, Admin  |
| PUT    | `/materials/:id`  | Owner, Admin           |
| DELETE | `/materials/:id`  | Owner, Admin           |

### Designs

| Method | Endpoint        | Access                          |
|--------|-----------------|---------------------------------|
| GET    | `/designs`      | Public (`?status=`, `?category=`) |
| GET    | `/designs/:id`  | Public                          |
| POST   | `/designs`      | Brand, Admin                    |
| PUT    | `/designs/:id`  | Owner Brand, Admin              |
| DELETE | `/designs/:id`  | Owner Brand, Admin              |

## Example Requests

**Register:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Nova Label","email":"nova@brand.com","password":"secret123","role":"brand"}'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nova@brand.com","password":"secret123"}'
```

**Create a design (authenticated):**

```bash
curl -X POST http://localhost:5000/api/designs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Handloom Saree","category":"saree","status":"draft"}'
```

## Response Shape

All responses follow a consistent envelope:

```json
{ "success": true, "data": { } }
```

Errors:

```json
{ "success": false, "message": "..." }
```

## License

MIT
