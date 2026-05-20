# newwww Backend

This folder contains the Express + MongoDB API powering the `newwww` frontend. It exposes REST resources for products, categories, banners, special offers, custom products/orders and user authentication.

## Getting started

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment variables**
   - Copy `.env.example` to `.env` and adjust values (especially `MONGO_URI`).
   - `JWT_SECRET` should be changed for production.
   - Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` for the admin account (used by login and seeder).

3. **Seed admin user (recommended once)**
   ```bash
   npm run seed:admin
   ```
   Creates or updates the admin in MongoDB from `.env` credentials.

4. **Run the server**
   ```bash
   npm run dev   # uses nodemon
   # or
   npm start     # production mode
   ```

   The API will listen on `PORT` (default `5000`).

5. **Uploads**
   Files uploaded through the UI are stored under `backend/uploads` and served
   from `/uploads`.

6. **Frontend configuration**
   Set `VITE_API_BASE_URL` in the frontend `.env` (e.g. `http://localhost:5000`).

## Endpoints overview

- `POST /api/auth/login` – admin login (JWT)
- `GET/POST/PUT/DELETE /api/products`
- `GET/POST/PUT/DELETE /api/categories`
- `GET/POST/PUT/DELETE /api/subcategories`
- `GET/POST/PUT/DELETE /api/banners`
- `GET/POST/PUT/DELETE /api/special-offers`
- `GET/POST/PUT/DELETE /api/custom-products`
- `GET/POST/PUT /api/custom-orders`
- `POST /api/upload` – multipart image upload

Protected routes require `Authorization: Bearer <token>` header.

## Notes

- The admin login route will auto-create a user if one does not exist and the
  credentials match the `ADMIN_EMAIL`/`ADMIN_PASSWORD` vars.
- The schema and controllers are intentionally simple to match the existing
  frontend data shapes.
