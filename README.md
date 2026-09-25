# EComVerse Multi-Tenant E-Commerce SaaS Platform\n\n🌍 **Live Demo:** [Visit EComVerse](https://your-vercel-link-here.vercel.app) \n*(Note: Replace with your actual Vercel link!)*

A comprehensive multi-vendor e-commerce platform designed to allow independent vendors to open stores, manage inventory, and process orders, while providing customers with a seamless, global shopping experience. 

## 🚀 Latest Updates (v1.1)

We have recently shipped several major improvements to the platform:
- **Transaction ID Tracking:** Exposed Stripe Payment Intent IDs (`payment_reference`) to both the Admin Global Transactions and Vendor Store Orders dashboards for seamless payment tracing.
- **Customer Success Flow:** Built a dedicated `/success` screen post-checkout that displays the transaction ID, payment method, and an estimated delivery date instead of immediately clearing the cart and returning to the homepage.
- **Vendor Catalog Categorization:** Introduced a smart `Category` tagging system. Vendors can now assign categories (e.g., Clothing, Electronics) to their products via the Product Form, which is organized in their inventory lists but kept hidden from the public storefront.
- **Admin UI Security Lockout:** Super Admins are now strictly blocked from acting as customers. The shopping cart is completely hidden from the Admin navigation, the "Add to Cart" button is disabled on product pages, and the checkout flow is fully locked down with a custom error screen.
- **Global Catalog Image Viewer:** Added an interactive "View Image" modal to the Super Admin's Global Product Catalog for quick visual inventory checks.
- **Variant Pricing Fixes:** Upgraded the backend Stripe payment calculation logic to fully support exact-pricing flat variants.

---

## Key Features

- 🛡️ **Role-Based Authentication (Clerk):** Secure authentication with strict role-based access control (`CUSTOMER`, `VENDOR`, `SUPER_ADMIN`).
- 🏪 **Multi-Vendor Architecture:** Isolated vendor dashboards, individual store profiles, and global admin oversight.
- 💳 **Secure Payments (Stripe):** Integrated Stripe checkout for secure credit card processing, complete with transaction IDs and automated customer success flows.
- 💰 **Wallet & Payout System:** Vendors accumulate earnings minus a platform commission (e.g., 5%) and can request payouts from the Super Admin.
- 📦 **Advanced Inventory Management:** Support for product variants (sizes/colors), dynamic stock validation, category tagging, and Cloudinary-powered image uploads.
- 📊 **Real-Time Analytics (Recharts):** Interactive visual dashboards for both vendors and admins to track revenue over time.

---

## Project Structure

- `client/`: React frontend application (Vite, Tailwind CSS v4, Redux Toolkit, React Router)
- `server/`: Node.js/Express backend application
- `database.sql`: Supabase PostgreSQL schema definition

## Setup Instructions

### 1. Database Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and run the SQL provided in `database.sql` and `server/migrate_features.js`.
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
3. Start the server: `node index.js`

### 4. Frontend Setup
1. Navigate to the `client/` directory: `cd client`
2. Create a `.env` file with the following variables:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

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

### Week 2 - Inventory & Store Management (COMPLETED)
- **Day 8:** Store API endpoints (Create & Read operations) with Vendor role protection.
- **Day 9:** Store API endpoints (Update, Delete) and robust Cloudinary image upload setup via `/api/upload`.
- **Day 10:** Product API endpoints (CRUD) with Store ownership verification.
- **Day 11:** Vendor Dashboard Layout (Sidebar/Navbar) & functional Store Settings React UI to create/update stores and upload logos.
- **Day 12:** Product Management UI (Add/Edit products, Upload images, Category tagging).
- **Day 13:** Inventory, Pricing, and Variants Logic Implementation (adding support for exact pricing variants and dynamic stock/pricing in backend and frontend UI).
- **Day 14:** Store & Product Frontend/Backend Integration Testing & Polish.

### Week 3 - Cart, Checkout & Payments (COMPLETED)
- **Day 15:** Public Storefront UI (Home page listing active stores, Storefront grid, and Product Details page with dynamic variant selection).
- **Day 16:** Shopping Cart implementation (Redux Global State, slide-over Cart panel, and live Subtotal calculations).
- **Day 17:** Stripe Integration (Installed Stripe Node SDK, built `/api/payments/create-intent` endpoint).
- **Day 18:** Payment Verification & Webhooks (Built secure `/api/webhooks/stripe` endpoint using `express.raw()` to parse and cryptographically verify Stripe event signatures).
- **Day 20:** Checkout Flow UI (Installed `@stripe/react-stripe-js`, built custom React checkout form and a dedicated Post-Checkout Order Success Screen).
- **Day 21:** Automated order receipts and tracking (Transaction IDs integrated globally across Admin and Vendor tables).

### Week 4 - Analytics, Refinement & Deployment (COMPLETED)
- **Day 22:** Vendor Analytics (Updated Vendor Dashboard to display real-time Total Revenue and Order Count, and implemented Vendor Wallet / Payout Requests).
- **Day 23:** Super Admin Analytics (Built `/api/admin/stats` and `AdminDashboard.jsx` to aggregate total platform metrics, exclusively accessible by users with the `SUPER_ADMIN` role).
- **Day 24:** Chart Integration (Installed `recharts`, updated SQL queries to render interactive Line and Bar charts in Admin and Vendor dashboards).
- **Day 25:** Role Security & Routing (Strict `RequireRole` React router component, plus Admin UI lockout blocking Super Admins from checking out as customers).
- **Day 26:** Production Prep (Built `errorHandler.js` for clean Express API error logging, and wrote a `database_indexes.sql` script to speed up platform queries).
- **Day 27:** CI/CD & Build Configuration (Added Node `start` scripts, Vercel SPA `rewrites` configuration).
- **Day 28:** Final Polish & Live Deployment (Successfully deployed the full platform architecture to production using Vercel for the frontend and Render for the Node.js backend).
