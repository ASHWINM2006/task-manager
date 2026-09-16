# TaskFlow — User Documentation

**Application:** TaskFlow Task Manager  
**Stack:** MongoDB · Express · React · Node.js (MERN)  
**Version:** 1.0.0  
**Date:** September 2026

---

## Table of Contents

1. [How to Access and Use the Application](#1-how-to-access-and-use-the-application)
2. [Login Instructions](#2-login-instructions)
3. [Important Assumptions Made](#3-important-assumptions-made)
4. [Known Limitations](#4-known-limitations)
5. [Important Notes and Warnings](#5-important-notes-and-warnings)
6. [Setup Instructions](#6-setup-instructions)

---

## 1. How to Access and Use the Application

### Accessing the Application

| Environment | URL |
|---|---|
| Local (development) | http://localhost:5173 |
| Deployed (production) | Your deployed frontend URL |

Open the URL in any modern browser (Chrome, Firefox, Edge, Safari).

---

### Using the Application

#### Dashboard Overview

After signing in, you land on the **Dashboard**. It contains:

| Section | Description |
|---|---|
| Greeting | Welcomes you by first name with total task progress |
| Progress ring | Shows % of tasks marked Complete |
| Add New Task form | Create a new task with a title and optional description |
| Filter bar | Filter tasks by status: All / Planned / In Progress / Complete |
| Task list | All your tasks displayed as cards |

---

#### Creating a Task

1. Find the **"Add New Task"** form at the top of the dashboard
2. Enter a **Title** (required, max 200 characters)
3. Optionally enter a **Description** (max 1000 characters)
4. Click **"+ Add Task"**
5. The task appears instantly at the top of your list with status **"Planned"**

---

#### Viewing Tasks

- All your tasks are listed below the filter bar
- Click a filter button (**All / Planned / In Progress / Complete**) to show only tasks of that status
- Each task card shows:
  - Task title
  - Description (if added)
  - Colour-coded status badge
  - Creation date
  - Status dropdown
  - Delete button

| Status | Badge Colour |
|---|---|
| Planned | Grey |
| In Progress | Yellow |
| Complete | Green |

---

#### Updating a Task Status

1. Find the task card you want to update
2. Click the **status dropdown** on the bottom right of the card
3. Select the new status: **Planned**, **In Progress**, or **Complete**
4. The card updates instantly — no page reload needed

---

#### Deleting a Task

1. Click the **trash icon** on the bottom right of the task card
2. A confirmation dialog appears — click **OK** to confirm
3. The task is permanently removed

---

#### Profile Menu

1. Click your **profile picture** or **name** in the top-right navbar
2. A dropdown opens showing:
   - Your profile photo
   - Full name
   - Email address
   - Sign out button

---

## 2. Login Instructions

### How to Sign In

1. Open the application URL in your browser
2. You will see the **TaskFlow** login page
3. Click **"Sign in with Google"**
4. Google's authentication screen opens — select your Google account
5. Grant the requested permissions (profile and email)
6. You are redirected back to the **Dashboard** automatically

> Your account is created automatically on first sign-in. No separate registration is needed.

---

### How to Sign Out

1. Click your profile picture or name in the top-right corner
2. The profile dropdown opens
3. Click **"Sign out"**
4. You are redirected back to the login page

---

### Session Duration

- Your login session lasts **7 days**
- After 7 days you will be automatically signed out and need to sign in again

---

## 3. Important Assumptions Made

| # | Assumption | Reason |
|---|---|---|
| 1 | **Tasks are private per user** | The requirements mention "users" creating tasks — it is assumed each user can only see their own tasks. Shared or team tasks are not mentioned. |
| 2 | **Default task status is "Planned"** | When a task is created it has not started yet, so "Planned" is the most logical default state. |
| 3 | **Task deletion is included** | The requirements only list create, view, and update-status. However, without a delete feature a user's list grows indefinitely with no way to clean up, which harms usability. Delete was added as a minimal, necessary UX improvement. |
| 4 | **Task has title + optional description** | A title alone is the minimum useful identifier. An optional description allows users to add context without making it mandatory. |
| 5 | **Status can be changed in any direction** | The requirements do not specify a one-way workflow. Allowing any transition (e.g. reverting Complete → In Progress) is more realistic and flexible. |
| 6 | **Google OAuth is the only login method** | The requirements explicitly state "Sign in using Google Authentication." No email/password login was added to keep scope minimal. |
| 7 | **First-time users are auto-registered** | When a user signs in with Google for the first time, an account is created automatically. There is no separate registration screen. |

---

## 4. Known Limitations

| Limitation | Details |
|---|---|
| **No task editing** | Once a task is created, the title and description cannot be edited. Only the status can be changed. This was not in the requirements. |
| **No pagination** | All tasks are fetched and displayed at once. With a very large number of tasks this could be slow. Acceptable for the scope of this assessment. |
| **No real-time sync** | If the same account is open in two browser tabs, changes in one tab do not reflect in the other without a manual page refresh. |
| **Google OAuth only** | No email/password or other social login. Only Google accounts are supported. |
| **No task priority or due dates** | Tasks have no priority levels, due dates, or categories. These were not part of the requirements. |
| **No search or sort** | Tasks cannot be searched by keyword or sorted by date/status beyond the filter bar. |
| **No offline support** | The application requires an active internet connection to both the backend server and MongoDB Atlas. |
| **Test users only (development)** | While the Google OAuth app is in "Testing" mode, only Gmail addresses added as test users in Google Cloud Console can sign in. |

---

## 5. Important Notes and Warnings

### Security

> ⚠️ **Never commit your `.env` file to version control.** It contains your MongoDB password, Google OAuth secret, and JWT secret. Add `.env` to `.gitignore` before pushing to GitHub.

> ⚠️ **Use a strong JWT_SECRET in production.** It should be a random string of at least 32 characters. The one in development is for local use only.

### Google OAuth — "App Not Verified" Warning

When signing in during development, Google may show:

> *"This app isn't verified"*

This is normal for apps in testing mode. To proceed:
1. Click **"Advanced"**
2. Click **"Go to TaskFlow (unsafe)"**
3. Sign in normally

To remove this warning permanently, verify the app in Google Cloud Console (requires domain ownership).

### Google OAuth — Test Users

While the OAuth consent screen is in **Testing** mode, only Gmail addresses added under **Audience → Test Users** in Google Cloud Console can sign in. Anyone else will see an **"Access blocked"** error.

To allow any Google account to sign in, publish the app by changing the consent screen status from **Testing** to **In production**.

### MongoDB Atlas Free Tier

- Free tier has **512 MB** storage limit
- Shared compute resources — occasional slowness is normal
- The cluster may **pause after 60 days of inactivity** on the free tier — if the app cannot connect, log in to MongoDB Atlas and resume the cluster

### CORS in Production

If deploying the backend and frontend to different domains, update the `CLIENT_URL` in `backend/.env` to match the deployed frontend URL, and update `GOOGLE_CALLBACK_URL` to match the deployed backend URL.

---

## 6. Setup Instructions

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | v18 or higher |
| npm | v9 or higher |
| MongoDB Atlas account | Free tier |
| Google Cloud Console project | With OAuth 2.0 credentials |

---

### Step 1 — Clone the Repository

```bash
git clone <your-repo-url>
cd task-manager
```

---

### Step 2 — Set Up Google OAuth Credentials

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create or select a project
3. Go to **APIs & Services → OAuth consent screen**
   - User type: **External**
   - Fill in App name, support email, developer email
   - Save and continue through all steps
4. Go to **APIs & Services → Credentials**
5. Click **+ Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: `Task Manager`
   - Authorized redirect URIs:
     - Development: `http://localhost:5000/api/auth/google/callback`
     - Production: `https://<your-backend-domain>/api/auth/google/callback`
6. Copy the **Client ID** and **Client Secret**

---

### Step 3 — Set Up MongoDB Atlas

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user (username + password)
4. Under **Network Access**, whitelist your IP (or `0.0.0.0/0` for development)
5. Go to **Connect → Drivers** and copy the connection string
6. Replace `<password>` with your database user's password

---

### Step 4 — Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in all values:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority

GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_secret

GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

JWT_SECRET=use_a_long_random_string_at_least_32_chars
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
NODE_ENV=development
PORT=5000
```

---

### Step 5 — Install and Run the Backend

```bash
cd backend
npm install
npm run dev        # development (with auto-restart)
# or
npm start          # production
```

The backend starts on **http://localhost:5000**

---

### Step 6 — Install and Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**

---

### Step 7 — Open the Application

Open **http://localhost:5173** in your browser and sign in with Google.

---

### Running Both Together (Two Terminals)

**Terminal 1 — Backend:**
```bash
cd task-manager/backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd task-manager/frontend
npm run dev
```

---

### Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # MongoDB connection
│   │   │   └── passport.js        # Google OAuth strategy
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT auth middleware
│   │   ├── models/
│   │   │   ├── User.js            # User schema
│   │   │   └── Task.js            # Task schema (Planned/In Progress/Complete)
│   │   ├── routes/
│   │   │   ├── auth.js            # /api/auth routes
│   │   │   └── tasks.js           # /api/tasks routes
│   │   └── server.js              # Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # Axios instance + interceptors
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state
    │   ├── components/
    │   │   ├── Navbar.jsx         # Top nav with profile dropdown
    │   │   ├── CreateTaskForm.jsx # New task form
    │   │   ├── TaskCard.jsx       # Individual task card
    │   │   └── TaskList.jsx       # Filtered task list
    │   ├── pages/
    │   │   ├── LoginPage.jsx      # Google sign-in page
    │   │   ├── DashboardPage.jsx  # Main task dashboard
    │   │   └── AuthCallback.jsx   # OAuth redirect handler
    │   ├── App.jsx                # Router + auth guard
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

---

### API Reference

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/api/health` | No | Server health check |
| GET | `/api/auth/google` | No | Initiate Google OAuth |
| GET | `/api/auth/google/callback` | No | OAuth callback handler |
| GET | `/api/auth/me` | Yes | Get current user info |
| POST | `/api/auth/logout` | Yes | Sign out, clear cookie |
| GET | `/api/tasks` | Yes | Get all tasks for user |
| POST | `/api/tasks` | Yes | Create a new task |
| PATCH | `/api/tasks/:id/status` | Yes | Update task status |
| DELETE | `/api/tasks/:id` | Yes | Delete a task |

---

*Documentation prepared for Graduate Support Engineer Trainee Assessment — Kovai.co*
