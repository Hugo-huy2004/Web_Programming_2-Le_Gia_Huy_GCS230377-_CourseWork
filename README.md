# HWJ CourseWork System

## 1) Overview
HWJ CourseWork is a full-stack jewelry web system with:
- Customer-facing website (browse products, valuation, cart, checkout, appointment booking)
- Admin dashboard (manage products, orders, vouchers, settings, support tickets, appointments)
- Role-based authentication:
  - Customer: Google login
  - Admin: username/password login

## 2) Tech Stack
### Frontend
- React 19 + TypeScript + Vite
- Zustand for state management
- React Router for routing
- Axios for API calls
- PayPal React SDK for payment
- Google OAuth for customer login

### Backend
- Node.js + Express (ES modules)
- MongoDB + Mongoose
- JWT authentication
- Cloudinary image upload
- Rate limiting + CORS + cookie-parser

## 3) Project Structure
```text
CourseWork/
|- backend/                  # Express API + MongoDB models/controllers/routes
|- frontend/                 # React app
|- package.json              # Root dependencies (legacy/shared)
`- README.md
```

## 4) Core Features
- Product catalog and product detail pages
- Metal valuation page (gold/silver pricing rules)
- Cart and order confirmation flow
- PayPal-only payment verification on backend
- Appointment booking
- Support ticket submission and admin processing
- Voucher management
- System settings management
- Admin account management

## 5) Authentication and Authorization
- Admin login:
  - Endpoint: `POST /api/auth/admin/login`
  - Returns JWT access token and refresh token cookie
- Customer login:
  - Endpoint: `POST /api/customers/google-login`
  - Verifies Google ID token and upserts customer profile
- Protected routes:
  - `GET /api/user/me` requires valid access token
- Admin API key guard:
  - Many management endpoints require `x-admin-api-key`

## 6) Main API Groups
- `/api/auth`            -> admin auth and profile
- `/api/customers`       -> customer profile + google login + metrics
- `/api/products`        -> product CRUD + sync
- `/api/orders`          -> create order + list + status updates
- `/api/appointments`    -> create/list/update/delete appointments
- `/api/support/tickets` -> support ticket lifecycle
- `/api/vouchers`        -> voucher lifecycle
- `/api/settings`        -> public settings + admin update
- `/api/admins`          -> list/create admin accounts
- `/api/uploads`         -> image upload endpoint
- `/api/health`          -> health check

## 7) Environment Variables
### Backend (`backend/.env`)
Required:
- `MONGODB_URI`
- `JWT_SECRET`

Recommended:
- `PORT` (default: `4000`)
- `CLIENT_ORIGIN` (comma-separated origins)
- `ADMIN_API_KEY`
- `GOOGLE_CLIENT_ID`
- `PAYPAL_MODE` (`sandbox` or `live`)
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Frontend (`frontend/.env`)
Recommended:
- `VITE_API_BASE_URL` (example: `http://localhost:4000/api`)
- `VITE_ADMIN_API_KEY`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_PAYPAL_CLIENT_ID`
- `VITE_SILVER_API_URL`

## 8) Local Setup
## Prerequisites
- Node.js 18+
- npm
- MongoDB instance (local or cloud)

## Install
From project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run backend
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:4000` by default.

## Run frontend
```bash
cd frontend
npm run dev
```
Frontend runs on Vite default port (`http://localhost:5173`).

## 9) Typical Request Flow
1. Frontend sends request to backend (`/api/...`).
2. Backend validates auth/admin key when needed.
3. Controller processes business logic.
4. Data is stored/fetched from MongoDB.
5. Backend returns JSON response (`ok`, `message`, `data fields`).
6. Frontend store updates UI state.

## 10) Notes
- Product images are uploaded through backend and stored via Cloudinary.
- Order creation validates PayPal order before saving.
- Public and admin functionality are split by route guards.

---
If you want, I can also generate:
- a shorter README for quick grading,
- an API-only README,
- or a Vietnamese version of this README.
