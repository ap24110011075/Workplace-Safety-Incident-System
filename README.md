# Workplace Safety Incident & Compliance Manager

This is a full stack MERN application built with a strict 3-tier architecture:

- Frontend: React + Vite + Tailwind CSS + PWA support
- Backend: Node.js + Express + MVC structure
- Database: MongoDB + Mongoose

The project is designed for a college project viva, so the code is intentionally clean, readable, and beginner-friendly.

## Features

- JWT authentication with role-based access
- Roles: Worker, Supervisor, Admin
- Incident creation with image/video upload
- Offline-first incident submission using local storage queue
- Automatic sync when the internet returns
- Role-based dashboard analytics
- Supervisor action assignment workflow
- Deadline tracking with overdue escalation
- Notifications for assignments, updates, and missed deadlines
- Report generation in PDF and JSON format
- Search, filters, and pagination for incidents
- PWA support for installable offline-friendly frontend

## Folder Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  uploads/
  server.js

frontend/
  public/
  src/
    components/
    context/
    hooks/
    pages/
    routes/
    services/
    utils/
    App.jsx
```

## Backend Setup

1. Open a terminal in [backend](C:\Projects\workplace_project\backend)
2. Install dependencies:

```bash
npm install
```

3. Create `.env` using [backend/.env.example](C:\Projects\workplace_project\backend\.env.example)
4. Start MongoDB locally
5. Run the backend:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`.

## Frontend Setup

1. Open a terminal in [frontend](C:\Projects\workplace_project\frontend)
2. Install dependencies:

```bash
npm install
```

3. Create `.env` using [frontend/.env.example](C:\Projects\workplace_project\frontend\.env.example)
4. Start the frontend:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

## Default API Flow

Frontend flow:

- Login / Register
- Dashboard
- Incident Upload

Backend flow:

- Auth Controller
- Auth Middleware
- Dashboard Controller
- Incident Controller

Database:

- MongoDB using Mongoose models

## Roles Summary

- Worker: create incidents, view own incidents, update assigned actions
- Supervisor: view all incidents, assign actions, monitor workflows
- Admin: view analytics, generate reports, monitor compliance

## Offline-first Logic

- When the app is offline, incident form data is stored in browser local storage
- If a file is attached, it is converted to a base64 string for temporary local storage
- When the browser comes online again, the app automatically syncs queued incidents to the backend

## Important Notes

- Uploaded media is stored locally inside `backend/uploads/`
- Generated reports are stored inside `backend/uploads/reports/`
- The report page is protected and only visible to admins
- The user listing API for assigning actions is protected for supervisors and admins

## Suggested Viva Explanation

You can explain the application like this:

1. The frontend is a React PWA that works even during internet loss.
2. The backend follows MVC and exposes REST APIs with JWT-protected routes.
3. MongoDB stores users, incidents, actions, reports, and notifications.
4. Workers report incidents, supervisors assign actions, and admins monitor compliance reports.
5. Offline incidents are stored locally and synced automatically when connectivity returns.
