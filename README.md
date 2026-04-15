# Web Programming 2 Coursework

## Introduction

This project is a full-stack jewelry e-commerce coursework application built for Web Programming 2.

Main features include:

- Product management (admin)
- Customer login with Google OAuth
- Secure API access with JWT
- Order and checkout flow with PayPal integration
- Image upload and storage with Cloudinary
- Appointment and support ticket modules

The system uses a separate frontend and backend architecture:

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + MongoDB

## Student Information

- Name: Lê Gia Huy
- Student ID: GCS230377

## 1. Prerequisites

Before running the project, install:

- Node.js 18+ (Node.js 20 LTS recommended)
- npm 9+
- MongoDB (local or MongoDB Atlas)
- Git

Quick check:

```bash
node -v
npm -v
```

## 2. Clone the project

```bash
git clone https://github.com/Hugo-huy2004/Web_Programming_2-Le_Gia_Huy_GCS230377-_CourseWork.git
cd Web_Programming_2-Le_Gia_Huy_GCS230377-_CourseWork
```

## 3. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

## 4. Configure environment variables

### Backend

Create `.env` from template:

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and set required values:

- `PORT=4000`
- `MONGODB_URI=mongodb://127.0.0.1:27017/hwj`
- `CLIENT_ORIGIN=http://localhost:5174`
- `JWT_SECRET=your_strong_secret`
- `ADMIN_API_KEY=your_admin_key`
- `GOOGLE_CLIENT_ID=...`
- `PAYPAL_CLIENT_ID=...`
- `PAYPAL_CLIENT_SECRET=...`
- `CLOUDINARY_CLOUD_NAME=...` (if image upload is used)
- `CLOUDINARY_API_KEY=...` (if image upload is used)
- `CLOUDINARY_API_SECRET=...` (if image upload is used)

### Frontend

Create `.env` from template:

```bash
cd ../frontend
cp .env.example .env
```

Open `frontend/.env` and set:

- `VITE_API_BASE_URL=/api`
- `VITE_PAYPAL_CLIENT_ID=...`
- `VITE_GOOGLE_CLIENT_ID=...`
- `VITE_ADMIN_API_KEY=...` (optional, based on your setup)

## 5. Run the project (2 terminals)

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

Backend default URL: `http://localhost:4000`

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

Frontend default URL: `http://localhost:5174`

## 6. Production build

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

### Backend

```bash
cd backend
npm start
```

## 7. Common issues

### 1) `Failed to fetch`

- Make sure backend is running (`npm run dev` in `backend`)
- Check `CLIENT_ORIGIN` in `backend/.env`
- Check `VITE_API_BASE_URL` in `frontend/.env`

### 2) MongoDB connection error

- Make sure MongoDB is running
- Check `MONGODB_URI`

### 3) Google login not working

- Check `GOOGLE_CLIENT_ID` in backend
- Check `VITE_GOOGLE_CLIENT_ID` in frontend
- Check Authorized JavaScript Origins in Google Cloud Console

### 4) PayPal button not showing

- Check `PAYPAL_CLIENT_ID` in backend
- Check `VITE_PAYPAL_CLIENT_ID` in frontend

## 8. Quick project structure

```text
CourseWork/
  backend/
    src/
    .env.example
    package.json
  frontend/
    src/
    .env.example
    package.json
```

## 9. Useful commands

```bash
# Run frontend lint
cd frontend && npm run lint

# Run backend in development
cd backend && npm run dev

# Run frontend in development
cd frontend && npm run dev
```
