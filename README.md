# 🦋 Naye Pankh Foundation — Volunteer Registration System

A full-stack MERN application for managing volunteer registrations, built for the Naye Pankh Foundation.

## ✨ Features

### Volunteer Side
- **Account Registration & Login** — JWT-based authentication
- **Multi-step Registration Form** — Personal info, education, skills, interests, availability
- **Volunteer Dashboard** — View registration status and profile summary
- **Profile Updates** — Edit details post-submission

### Admin Side
- **Admin Dashboard** — Key stats, bar charts (monthly registrations), pie chart (status distribution), skills breakdown, top cities
- **Volunteer Management** — Paginated table with search, filter by status/city, inline status update
- **Volunteer Detail View** — Full profile, status management, admin notes
- **CSV Export** — Download filtered volunteer data as CSV
- **Report Summary** — Breakdown by status, gender, education

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Recharts, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Styling | Custom CSS (no UI framework dependency) |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
```

### 3. Create First Admin

After starting the backend, run this once to seed an admin account:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@nayepankh.org","password":"admin123"}'

# Then manually set role to 'admin' in MongoDB:
# db.users.updateOne({email:"admin@nayepankh.org"}, {$set:{role:"admin"}})
```

Or use MongoDB Compass / Atlas to set `role: "admin"` on any user document.

### 4. Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # Uses nodemon for hot reload

# Terminal 2 — Frontend
cd frontend
npm start          # Starts on http://localhost:3000
```

## 📁 Project Structure

```
volunteer-system/
├── backend/
│   ├── models/
│   │   ├── User.js          # Auth user model
│   │   └── Volunteer.js     # Volunteer registration model
│   ├── routes/
│   │   ├── auth.js          # Register, login, /me
│   │   ├── volunteers.js    # Volunteer CRUD (self)
│   │   ├── admin.js         # Admin management + stats
│   │   └── reports.js       # CSV export + summary
│   ├── middleware/
│   │   └── auth.js          # JWT protect + adminOnly
│   ├── server.js
│   └── .env.example
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js   # Global auth state
        ├── pages/
        │   ├── LandingPage.js
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   ├── VolunteerDashboard.js
        │   ├── VolunteerForm.js      # 4-step form
        │   ├── AdminDashboard.js     # Charts & stats
        │   ├── AdminVolunteers.js    # Table with filters
        │   └── AdminVolunteerDetail.js
        ├── components/
        │   └── admin/
        │       └── AdminSidebar.js
        ├── App.js
        └── index.css
```

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user |

### Volunteer (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/volunteers/register` | Submit registration |
| GET | `/api/volunteers/me` | Get my profile |
| PUT | `/api/volunteers/me` | Update my profile |

### Admin (requires auth + admin role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/volunteers` | List all (paginated, filterable) |
| GET | `/api/admin/volunteers/:id` | Get single volunteer |
| PATCH | `/api/admin/volunteers/:id/status` | Update status |
| DELETE | `/api/admin/volunteers/:id` | Delete record |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/reports/csv` | Export as CSV |
| GET | `/api/reports/summary` | Report summary |

## 🌱 Future Enhancements
- Email notifications on status change (Nodemailer)
- PDF certificate generation for active volunteers
- Volunteer activity/event tracking
- WhatsApp/SMS alerts via Twilio
- Deploy: Railway (backend) + Vercel (frontend) + MongoDB Atlas
