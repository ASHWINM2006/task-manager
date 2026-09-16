# Task Manager — Graduate Support Engineer Trainee Assessment

A simple task management web application built with the MERN stack (MongoDB, Express, React, Node.js) and Google OAuth authentication.

---

## Table of Contents

1. [How to Access and Use the Application](#how-to-access-and-use-the-application)
2. [Login Instructions](#login-instructions)
3. [Setup Instructions](#setup-instructions)
4. [Assumptions Made](#assumptions-made)
5. [Known Limitations](#known-limitations)
6. [Important Notes and Warnings](#important-notes-and-warnings)
7. [AI Usage Summary](#ai-usage-summary)

---

## How to Access and Use the Application

### Application URL

If deployed: `https://<your-deployed-url>`  
If running locally: `http://localhost:5173`

### Features

| Feature | Description |
|---|---|
| Google Sign-In | Authenticate securely with your Google account |
| Create Task | Add a task with a title and optional description |
| View Tasks | See all your tasks, filterable by status |
| Update Status | Change a task's status using the dropdown on each task card |
| Delete Task | Remove a task you no longer need |

### Task Statuses

Each task moves through the following states:

```
Planned → In Progress → Complete
```

You can change status in any order using the dropdown on each task card.

### Using the Dashboard

1. After signing in, you land on the **Dashboard**.
2. The top of the page shows a **summary bar** with counts per status (All / Planned / In Progress / Complete). Click a filter to show only tasks with that status.
3. The **Add New Task** form is at the top. Fill in the title (required) and an optional description, then click **Add Task**.
4. Each task card shows:
   - Title and description
   - A colour-coded status badge (grey = Planned, yellow = In Progress, green = Complete)
   - Creation date
   - A status dropdown to change the status
   - A trash icon to delete the task

---

## Login Instructions

1. Open the application URL in your browser.
2. Click **Sign in with Google**.
3. You will be redirected to Google's consent screen.
4. Choose the Google account you want to use.
5. After successful authentication, you are redirected back to the dashboard.
6. To sign out, click **Sign out** in the top-right corner of the navbar.

> **Note:** The first time you sign in, your account is created automatically. No separate registration is needed.

---

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- A MongoDB Atlas account (free tier works)
- A Google Cloud Console project with OAuth 2.0 credentials

### 1. Clone the Repository

```bash
git clone <repo-url>
cd task-manager
```

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or use an existing one).
3. Navigate to **APIs & Services → Credentials**.
4. Click **Create Credentials → OAuth 2.0 Client ID**.
5. Set Application type to **Web application**.
6. Add the following **Authorized redirect URIs**:
   - For local development: `http://localhost:5000/api/auth/google/callback`
   - For production: `https://<your-backend-url>/api/auth/google/callback`
7. Copy the **Client ID** and **Client Secret**.

### 3. Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free cluster.
3. Create a database user with read/write access.
4. Whitelist your IP (or use `0.0.0.0/0` for development).
5. Copy the **connection string** (replace `<username>` and `<password>`).

### 4. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
JWT_SECRET=a_long_random_secret_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
PORT=5000
```

Install dependencies and start:

```bash
npm install
npm run dev      # development (with nodemon)
# or
npm start        # production
```

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies all `/api` requests to `http://localhost:5000`.

### 6. Running Both Together

Open two terminals:

**Terminal 1 (backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (frontend):**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Assumptions Made

| # | Assumption | Reasoning |
|---|---|---|
| 1 | Tasks are private to each user | The requirements say "users" can create and view tasks — it's reasonable that each user only sees their own tasks. Shared tasks are not mentioned. |
| 2 | Default task status is "Planned" | When a task is first created, it hasn't started yet, so "Planned" is the logical default. |
| 3 | Task deletion is included | The requirements only mention create/view/update-status, but without delete, a user's task list could grow indefinitely with no way to clean up. This improves usability without expanding scope. |
| 4 | Task has title + optional description | Title is required for identification. Description is optional for extra context. This is the minimal useful data model. |
| 5 | Status can be changed in any direction | The requirements do not specify a one-way workflow. Allowing any direction (e.g., reverting from Complete to In Progress) is more flexible and realistic. |
| 6 | JWT stored in localStorage + httpOnly cookie | The cookie provides security for browser-based requests; localStorage is used as a fallback for the OAuth redirect flow. |

---

## Known Limitations

- **No task editing** — You can update the status but not the title or description after creation. This was not in the requirements.
- **No pagination** — All tasks are loaded at once. For large numbers of tasks this could be slow, but it's acceptable for the scope of this assessment.
- **No real-time sync** — If you open the app in two tabs, changes in one tab are not reflected in the other without a refresh.
- **Google OAuth only** — No email/password login. This is intentional per the requirements.
- **Single-user data** — There is no admin view or way to see other users' tasks.
- **No email notifications** — Out of scope for this assessment.

---

## Important Notes and Warnings

- **Keep your `.env` file private.** Never commit it to version control. It contains secrets.
- **JWT_SECRET must be strong.** Use a random string of at least 32 characters in production.
- **MongoDB Atlas free tier** has a 512 MB storage limit and shared compute resources — sufficient for this app.
- **Google OAuth consent screen** may show a warning ("This app isn't verified") during development. Click "Advanced → Go to app" to proceed. To remove the warning, verify the app in Google Cloud Console.
- **CORS** is configured for `CLIENT_URL` only. Update this environment variable when deploying to production.
- The app uses **httpOnly cookies** for security, but `sameSite: 'none'` is required for cross-origin deployment. Make sure `NODE_ENV=production` and HTTPS is enabled in production.

---

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js           # MongoDB connection
│   │   │   └── passport.js     # Google OAuth strategy
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT protect middleware
│   │   ├── models/
│   │   │   ├── User.js         # User schema
│   │   │   └── Task.js         # Task schema
│   │   ├── routes/
│   │   │   ├── auth.js         # /api/auth routes
│   │   │   └── tasks.js        # /api/tasks routes
│   │   └── server.js           # Express entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js        # Axios instance with auth interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx # Global auth state
    │   ├── components/
    │   │   ├── Navbar.jsx      # Top navigation bar
    │   │   ├── CreateTaskForm.jsx
    │   │   ├── TaskCard.jsx    # Single task card
    │   │   └── TaskList.jsx    # Filtered task list
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   └── AuthCallback.jsx # Handles OAuth redirect
    │   ├── App.jsx             # Router + AuthProvider
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/health | No | Health check |
| GET | /api/auth/google | No | Redirect to Google OAuth |
| GET | /api/auth/google/callback | No | OAuth callback |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/auth/logout | Yes | Clear auth cookie |
| GET | /api/tasks | Yes | Get all tasks for user |
| POST | /api/tasks | Yes | Create a new task |
| PATCH | /api/tasks/:id/status | Yes | Update task status |
| DELETE | /api/tasks/:id | Yes | Delete a task |

---

## AI Usage Summary

### AI Tools Used
- **Kiro IDE** (Kiro AI) — Primary development tool used to scaffold and build the entire application

### How They Were Used
- Generating the full project structure (backend models, routes, middleware, and frontend components) based on the assessment requirements
- Setting up boilerplate (Express server, Passport.js OAuth flow, React Router, Tailwind CSS)
- Writing all JSX components and CSS utility classes
- Debugging build errors (Tailwind v4 PostCSS plugin change)

### What Was Reviewed and Verified
- All routes were manually reviewed to ensure tasks are scoped per user (using `user: req.user._id` in all queries)
- Auth middleware was checked to ensure both cookie and Bearer token patterns are handled
- The OAuth redirect flow (backend → frontend token handoff) was traced end-to-end to confirm the token is correctly stored in localStorage
- Error handling was verified for all API endpoints (400 validation, 401 auth, 404 not found, 500 server error)

### Example Prompts Used
- *"Build a MERN stack task management app with Google Auth with these requirements: [assessment document]"*
- *"Fix the Tailwind CSS PostCSS plugin error — it says to use @tailwindcss/postcss"*
