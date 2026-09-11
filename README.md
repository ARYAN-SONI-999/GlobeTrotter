# 🌍 GlobeTrotter — Smart AI Tourism & Itinerary Planning Platform

GlobeTrotter is a production-grade, commercial tourism web application powered by React, Express.js, and SQLite. It provides AI-driven day-by-day travel planning, interactive OpenStreetMap route mapping, live satellite weather radar, transit connectivity hubs, hotel price estimators, audio guides, group expense splitters, and digital passport gamification.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 2. Backend Setup & Database Seeding
```bash
# Navigate to backend folder
cd globetrotter/backend

# Install dependencies
npm install

# Seed the database with 30+ destinations, 500+ curated places & admin credentials
npm run seed

# Start the Express API server (runs on http://localhost:5000)
npm start
```

### 3. Frontend Setup & Run
```bash
# Navigate to frontend folder
cd globetrotter/frontend

# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## 🌟 Key Features Overview (21 Modules)

1. 🗺️ **Interactive Route Maps**: Leaflet + OpenStreetMap day-wise polylines & Google Maps navigation links.
2. 📄 **1-Click PDF Itinerary Export**: Printable travel guide formatted with daily spend breakdown & emergency helplines.
3. 📅 **Google Calendar Sync**: 1-Click `.ics` calendar export for mobile calendar integration.
4. ☀️ **Live Weather Radar**: Open-Meteo satellite feed with 7-day temperature forecast & travel advisories.
5. 🚆 **Indian Transit Hub**: IRCTC train station codes, flight routes & highway distances from metros.
6. 🏨 **Hotel Price Estimator**: Tiered hotel pricing (Budget, 3-Star, 5-Star Luxury) + MakeMyTrip deep links.
7. ⭐ **User Review System**: SQLite database backed reviews with star distributions & photo uploads.
8. 🚨 **Safety Cards & Helplines**: National helplines (112, 108, 1363), local hospital info & cultural etiquette.
9. 🎧 **AI Audio Tour Guide**: Monument voice narration via Web Speech Synthesis API.
10. 📲 **WhatsApp & QR Sharing**: Scannable QR code & 1-click formatted WhatsApp itinerary sharing.
11. 💰 **Group Expense Splitter**: Split bills among companions & calculate net settlements in ₹ INR.
12. 🎯 **"Find My Vibe" Quiz**: 3-step interactive holiday destination recommendation quiz.
13. 🎤 **Voice AI Planner**: Microphone speech recognition for travel inputs.
14. 🥽 **360° VR Previews**: Interactive virtual monument previews & historical facts.
15. 🌐 **Multi-Language Support**: Header language selector for English, Hindi (हिंदी), and Marathi (मराठी).
16. 📊 **Budget Donut Chart**: Visual SVG spend breakdown for Stay, Food, Transit & Tickets.
17. 👗 **Outfit Recommender**: Weather-tailored clothing & gear packing checklist.
18. 🛣️ **Multi-City Circuit Planner**: Chained road trips (Golden Triangle, Maharashtra Green Circuit).
19. 📘 **Digital Passport Stamps**: Gamified state travel stamps & badges on user profiles.
20. 💱 **Multi-Currency Converter**: Convert ₹ INR estimates to USD, EUR, GBP, AED.
21. 📱 **PWA App Support**: Native mobile app install capability (`manifest.json`).

---

## 🌐 Production Cloud Deployment

See the detailed **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for:
- **1-Click Full-Stack Deploy on Render** via [`render.yaml`](./render.yaml).
- **Split Deploy**: Frontend on **Vercel** + Backend API on **Render**.
- **Admin Credentials**: `admin@globetrotter.com` / `admin123`.
