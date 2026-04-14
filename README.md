# COMP1842 Coursework - Web Programming 2

This coursework project develops a full-stack web application for HWJ jewelry business operations. The system supports customer shopping flows (browse, cart, order) and admin management flows (products, orders, appointments, customers, support), with a focus on secure API design, maintainable architecture, and responsive user experience.

## Student Information
- Name: Le Gia Huy
- Student ID: GCS230377
- Module: COMP1842 - Web Programming 2

## Project Overview
This project is a full-stack web application for jewelry business operations (HWJ), including:
- customer product browsing
- cart and order flow
- admin product/order/customer/support management
- appointment and support features

The project is split into 2 parts:
- `frontend/`: React + TypeScript + Vite
- `backend/`: Node.js + Express + MongoDB

## Tech Stack
- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB, JWT
- Integrations: Google OAuth, PayPal, Cloudinary (optional)

## Libraries Used
### Frontend dependencies
- react, react-dom, react-router-dom
- zustand
- axios
- framer-motion
- lucide-react
- sonner
- @mui/material, @mui/icons-material, @emotion/react, @emotion/styled
- react-hook-form, @hookform/resolvers
- @react-oauth/google
- @paypal/react-paypal-js
- jspdf, jspdf-autotable
- react-dropzone
- three, @types/three
- tailwindcss, @tailwindcss/vite, tailwind-merge

### Frontend dev dependencies
- typescript, vite, @vitejs/plugin-react
- eslint, typescript-eslint, prettier, prettier-plugin-tailwindcss

### Backend dependencies
- express
- mongoose
- jsonwebtoken
- bcrypt
- cors, cookie-parser, dotenv
- nodemailer
- multer
- cloudinary
- googleapis
- pdfkit
- nodemon

Note: Full and latest dependency versions are defined in `frontend/package.json` and `backend/package.json`.

## 1) Clone Project From GitHub
```bash
git clone https://github.com/Hugo-huy2004/Web_Programming_2-Le_Gia_Huy_GCS230377-_CourseWork.git
cd Web_Programming_2-Le_Gia_Huy_GCS230377-_CourseWork
```

## 2) Prerequisites
Install these tools first:
- Node.js 18+ (recommended LTS)
- npm
- MongoDB (local or cloud)

## Install All Project Libraries (One Command)
Run from project root to install all backend + frontend dependencies:
```bash
npm install --prefix backend && npm install --prefix frontend
```

Or run step by step:
```bash
cd backend && npm install
cd ../frontend && npm install
```

## 3) Language/Runtime Installation
This project uses JavaScript/TypeScript on Node.js.

Install Node.js (includes npm):
- Download from: https://nodejs.org/
- Recommended version: Node.js 18 LTS or newer

Verify installation:
```bash
node -v
npm -v
```

Install TypeScript globally (optional, useful for development):
```bash
npm install -g typescript
tsc -v
```

## 4) Backend Setup
Go to backend folder and install dependencies:
```bash
cd backend
npm install
```

Create environment file:
```bash
cp .env.example .env
```

Edit `backend/.env` with your values:
```env
PORT=4000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/hwj
JWT_SECRET=replace_with_strong_secret
ADMIN_API_KEY=replace_with_admin_api_key

CLIENT_ORIGIN=http://localhost:5173,http://localhost:5174

GOOGLE_CLIENT_ID=

API_RATE_LIMIT_WINDOW_MS=60000
API_RATE_LIMIT_MAX=120
AUTH_RATE_LIMIT_WINDOW_MS=60000
AUTH_RATE_LIMIT_MAX=8

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
```

Run backend:
```bash
npm run dev
```
Backend default URL: `http://localhost:4000`

## 5) Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

Create environment file:
```bash
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_ADMIN_API_KEY=replace_with_same_value_as_backend_ADMIN_API_KEY
VITE_GOOGLE_CLIENT_ID=
VITE_PAYPAL_CLIENT_ID=sb
```

Run frontend:
```bash
npm run dev
```
Frontend default URL: `http://localhost:5173`

## 6) Useful Commands
### Backend
```bash
npm run dev
npm start
```

### Frontend
```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm run typecheck
```

## 7) Recommended Start Order
1. Start MongoDB
2. Start backend (`backend`: `npm run dev`)
3. Start frontend (`frontend`: `npm run dev`)
4. Open browser at `http://localhost:5173`

## 8) Troubleshooting
- If frontend cannot call API, check `VITE_API_BASE_URL`.
- If admin actions fail, make sure `VITE_ADMIN_API_KEY` equals backend `ADMIN_API_KEY`.
- If login/token issues happen, verify `JWT_SECRET` and backend server logs.

## License
This repository is submitted as coursework for COMP1842.
