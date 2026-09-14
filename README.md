# OmniStore (Zaalima Multi-Tenant E-Commerce Platform)

This repository contains the Zaalima Project 1 Multi-Tenant E-Commerce Platform.

## Project Structure

- `client/`: React frontend application (Vite, Tailwind CSS v4, Redux Toolkit, React Router)
- `server/`: Node.js/Express backend application
- `database.sql`: Supabase PostgreSQL schema definition

## Setup Instructions

### 1. Database Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and run the SQL provided in `database.sql`.
3. Obtain your database URL and API keys.

### 2. Authentication Setup
1. Create a new application on [Clerk](https://clerk.com).
2. Configure authentication options.
3. Obtain your publishable key and secret key.

### 3. Backend Setup
1. Navigate to the `server/` directory: `cd server`
2. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   DATABASE_URL=your_supabase_postgresql_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   STRIPE_SECRET_KEY=your_stripe_test_secret_key
   CLOUDINARY_URL=your_cloudinary_url
   ```
3. Start the server: `node index.js` (or `npm run dev` if nodemon is configured)

### 4. Frontend Setup
1. Navigate to the `client/` directory: `cd client`
2. Create a `.env` file with the following variables:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:5000/api
   ```
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Roles
The system supports three roles: `SUPER_ADMIN`, `VENDOR`, `CUSTOMER`.
A user's role is stored in the database. When a user authenticates, their Clerk ID is matched with the database record to determine their access level.

---

## Progress Report

### Week 1 - Architecture & Core Authentication (COMPLETED)
- **Day 1:** Project setup & GitHub repository initialization.
- **Day 2:** Database architecture & schema creation (Supabase PostgreSQL).
- **Day 3:** Node.js/Express backend scaffolding & folder structure creation.
- **Day 4:** Clerk authentication integration (Backend setup & `POST /api/auth/sync` API).
- **Day 5:** Role-based access middleware (`requireRole`) & protected base APIs.
- **Day 6:** React frontend setup with Vite, Tailwind CSS v4, Redux Toolkit, and React Router.
- **Day 7:** Login/Register UI flows, Role-based dashboards scaffold, and Redux User State synchronization.

### Week 2 - Inventory & Store Management
- **Day 8:** Store API endpoints (Create & Read operations) with Vendor role protection.
- **Day 9:** Store API endpoints (Update, Delete) and robust Cloudinary image upload setup via `/api/upload`.
