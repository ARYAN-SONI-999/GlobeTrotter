# 🌐 GlobeTrotter Production Deployment Guide

This guide provides step-by-step instructions for deploying the **GlobeTrotter** full-stack travel platform to public production servers.

---

## 🛠️ Tech Stack Overview

- **Frontend**: React (Vite), React Router v6, Axios, Custom CSS & KaTeX
- **Backend**: Node.js, Express, SQLite via `sql.js` (WebAssembly with auto-seed on boot)
- **APIs**: Open-Meteo Weather API, QR Server API, Unsplash Travel Imagery

---

## 🚀 Deployment Option 1: 1-Click Full-Stack Deploy on Render (Recommended)

Render uses the included [`render.yaml`](./render.yaml) Infrastructure-as-Code Blueprint to deploy both the Express API and the Vite Frontend in a single step.

1. Push this repository to **GitHub**.
2. Log into [Render.com](https://render.com/).
3. Click **"New"** → **"Blueprint"**.
4. Connect your GitHub repository. Render will automatically detect `render.yaml`.
5. Click **"Apply"**.
6. Render will:
   - Build and launch the `globetrotter-backend` service on Node.js (runs `npm run seed && node server.js`).
   - Automatically generate a secure `JWT_SECRET`.
   - Build and launch the `globetrotter-frontend` static site, automatically pointing `VITE_API_BASE_URL` to your backend.

---

## 🚀 Deployment Option 2: Split Deploy (Vercel Frontend + Render Backend)

### Step 1: Deploy Backend to Render
1. In [Render.com](https://render.com/), click **"New"** → **"Web Service"**.
2. Connect your repository and select the **`globetrotter/backend`** root directory.
3. Configure the settings:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run seed && node server.js`
   - **Plan**: Free
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `JWT_SECRET`: `a_very_long_random_secure_secret_key_32_chars`
   - `CORS_ORIGIN`: `*` (or your Vercel frontend URL once known)
5. Click **"Create Web Service"**.
6. Note your backend URL (e.g., `https://globetrotter-backend-xxxx.onrender.com`).

### Step 2: Deploy Frontend to Vercel
1. Log into [Vercel.com](https://vercel.com/) and click **"Add New"** → **"Project"**.
2. Import your GitHub repository.
3. In the project setup:
   - **Root Directory**: Click edit and select `globetrotter/frontend`.
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://globetrotter-backend-xxxx.onrender.com/api`
   *(Note: Thanks to our auto-normalizer in `axios.js`, entering either `https://...onrender.com` or `https://...onrender.com/api` will automatically work!)*
5. Click **"Deploy"**.

---

## 🔑 Demo & Admin Credentials

When the backend boots for the first time, it automatically seeds the database with all 30+ destinations, 500+ curated places, and this administrator account:

- **Email**: `admin@globetrotter.com`
- **Password**: `admin123`

You can also register any new account instantly on the [Signup page](http://localhost:5173/signup).

---

## 🧪 Verification & Live Smoke Test Checklist

Once deployed, run through this quick checklist:
1. **Health Check**: Open `https://your-backend.onrender.com/api/health` in your browser. It should return `{"status":"ok", ...}`.
2. **Landing Page**: Visit your frontend URL. Verify the hero section, feature cards, and popular destinations load smoothly.
3. **Authentication**: Log in with `admin@globetrotter.com` / `admin123`, or sign up a new user.
4. **AI Auto-Planner**: Navigate to `/planner`, select any destination (e.g. *Matheran*, *Manali*, or *Goa*), and click **"Generate AI Itinerary"**.
5. **Interactive Map**: View attractions mapped out with Leaflet OpenStreetMap markers and route paths.
6. **Tour Booking**: Click **"Book Tour"** on any place or dashboard card to test the verified voucher e-ticket generator and QR code.
7. **PDF / Calendar Export**: Export a PDF travel guide and `.ics` Google Calendar file from an itinerary view.

---

🎉 *Your GlobeTrotter platform is completely configured and ready for production!*
