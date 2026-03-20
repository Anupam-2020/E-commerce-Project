# E-commerce Backend

Lightweight Node.js/Express backend for an E-commerce application.

**Tech stack:** Node.js, Express, MySQL (mysql2), JWT auth

**Project layout**
- `src/server.js` - application entry
- `src/app.js` - Express app setup
- `src/config/db.js` - database connection
- `src/controllers/` - route handlers
- `src/routes/` - API routes
- `sql/schema.sql` - database schema

Requirements
- Node.js 18+ (or compatible)
- MySQL server

Environment variables
- `PORT` — server port (default: 3000)
- `DB_HOST` — MySQL host
- `DB_PORT` — MySQL port (default: 3306)
- `DB_USER` — MySQL user
- `DB_PASSWORD` — MySQL password
- `DB_NAME` — MySQL database name
- `JWT_SECRET` — secret for signing JWTs

Quick start

1. Install dependencies

```
cd backend
npm install
```

2. Create database and tables

Import the schema located at `sql/schema.sql` into your MySQL instance.

3. Create a `.env` file in `backend/` with required variables (see Environment variables).

4. Run in development

```
npm run dev
```

Run production

```
npm start
```

API overview

Routes are defined under `src/routes/` and mapped to controllers in `src/controllers/`.
Key modules:
- Authentication: `src/routes/auth.routes.js`, `src/controllers/auth.controller.js`
- Products: `src/routes/product.routes.js`, `src/controllers/product.controller.js`
- Orders/Inventory/Payments: corresponding files in `routes/` and `controllers/`

Notes
- Use `nodemon` for development (already in `devDependencies`).
- The project uses `mysql2` driver; ensure your `DB_*` env values are correct.
