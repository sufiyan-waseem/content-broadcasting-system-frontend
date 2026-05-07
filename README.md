# Content Broadcasting System — Frontend

**Author:** Sufiyan Waseem

A fully functional frontend for a Content Broadcasting System built with React.js, Tailwind CSS, and shadcn/ui. Designed for educational environments where teachers upload content, principals approve it, and students view it live.

## 🚀 Live Demo

> _Add deployment link here after deploying_

---

## ✨ Features

### 🔐 Authentication
- Email & password login with form validation (Zod + React Hook Form)
- JWT token stored in localStorage
- Auto-redirect based on role (teacher / principal)
- Protected routes — unauthenticated users redirected to login

### 🎓 Teacher
- **Dashboard** — Stats: Total, Pending, Approved, Rejected uploads
- **Upload Content** — Drag-and-drop image upload with preview, scheduling fields
- **My Content** — View all uploads with status badges and rejection reasons

### 👨‍💼 Principal
- **Dashboard** — System-wide content statistics
- **Pending Approvals** — Review, approve, or reject content (with mandatory reason modal)
- **All Content** — Searchable, filterable table of all system content

### 📺 Public Live Broadcast
- Route: `/live/:teacherId` — No login required
- Shows currently active content with Live Now / Scheduled / Expired status
- Auto-refreshes every 30 seconds
- Empty state when no active content

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | React.js (Vite) |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router DOM v6 |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack Query (React Query) |
| HTTP Client | Axios |
| Icons | Lucide React |

---

## 📦 Setup & Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

App runs at: **http://localhost:5173**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 🎓 Teacher | `teacher1@test.com` | `password123` |
| 🎓 Teacher 2 | `teacher2@test.com` | `password123` |
| 👨‍💼 Principal | `principal1@test.com` | `password123` |

---

## 🗂 Project Structure

```
src/
├── components/        # Reusable UI components + route guards
├── context/           # AuthContext, ThemeContext
├── hooks/             # Custom hooks (use-toast)
├── layouts/           # AppLayout (sidebar + topbar)
├── lib/               # Axios instance, utility functions
├── mocks/             # Mock database (localStorage-backed)
├── pages/
│   ├── auth/          # LoginPage
│   ├── teacher/       # Dashboard, Upload, MyContent
│   ├── principal/     # Dashboard, Approvals, AllContent
│   └── public/        # LiveBroadcastPage
└── services/          # API service layer (replaceable with real backend)
    ├── auth.service.js
    ├── content.service.js
    └── approval.service.js
```

---

## 🔌 API Integration

The app uses a **mock service layer** backed by localStorage, making it fully independent of any backend. To connect a real backend:

1. Update `BASE_URL` in `src/lib/axios.js`
2. Replace mock logic in `src/services/*.js` with real axios calls — **component code stays unchanged**

---

## 🎨 UI/UX Highlights

- 🌙 Dark / Light mode toggle (persisted)
- ⬆️ Drag-and-drop file upload with image preview
- 💀 Skeleton loaders on all data-fetching pages
- 🔔 Toast notifications for all actions
- 📱 Responsive design with collapsible mobile sidebar
- 🚦 Empty states on all list pages

---

## 📄 Documentation

See [`Frontend-notes.txt`](./Frontend-notes.txt) for detailed notes on:
- Project architecture
- Authentication flow
- Role-based routing
- API integration approach
- State management decisions
- Assumptions made
