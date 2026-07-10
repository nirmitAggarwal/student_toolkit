# Student Toolkit

A production-ready Student Toolkit dashboard application for engineering students with OAuth authentication, academic calculators, and productivity tools.

## ✨ Features

### 🔐 Authentication
- GitHub OAuth login  
- JWT-based sessions
- Persistent authentication

### 📚 Academic Tools
- **CGPA Calculator** - Dynamic semester tracking
- **SGPA Calculator** - Semester-specific GPA
- **Percentage Calculator** - Quick percentage computations
- **Attendance Tracker** - Track attendance with skip day calculations

### 🎯 Productivity
- **Dashboard** - Exam countdowns, calendars, today's schedule
- **Time Table Manager** - Weekly schedule planner
- **QR Code Generator** - Generate QR codes (PNG/SVG)
- **QR Code Scanner** - Scan QR codes via webcam

### 🛠 Utilities
- **PDF Merger** - Combine PDFs (client-side)
- **Image Compressor** - Reduce image file sizes
- **Unit Converter** - Length, weight, temperature, volume, etc.

### 📊 Dashboard Widgets
- Exam countdown tracker
- Academic calendar with events
- Holiday calendar
- Today's class schedule
- Quick action cards

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- GitHub OAuth credentials

### Installation

**Frontend:**
```bash
cd client
npm install
npm run dev
```

**Backend:**
```bash
cd server
npm install
npm run dev
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions with OAuth configuration.

## 📁 Project Structure

```
StudentToolkit/
├── client/                 # React Vite frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── store/         # Zustand state management
│   │   ├── services/      # API service layer
│   │   └── styles/        # Global styles
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API routes
│   │   ├── models/        # Mongoose schemas
│   │   ├── middleware/    # Auth & error handling
│   │   ├── services/      # Background services
│   │   ├── config/        # Database config
│   │   └── app.js         # App entry point
│   └── package.json
│
├── SETUP_GUIDE.md
└── README.md
```

## 🎨 Tech Stack

**Frontend:**
- React 19 + Vite
- TailwindCSS
- Zustand
- React Router v7
- Framer Motion
- React Hook Form
- Google & GitHub OAuth

**Backend:**
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Node Cron
- Multer (file uploads)

## 📖 API Documentation

### Authentication
- `POST /api/auth/github/callback` - GitHub OAuth callback

### Health Check
- `GET /api/health` - Server status

## 🔧 Configuration

Create `.env` files:

**Frontend (.env.local):**
```env
VITE_GOOGLE_CLIENT_ID=xxx
VITE_GITHUB_CLIENT_ID=xxx
VITE_API_BASE_URL=http://localhost:4000/api
```

**Backend (.env):**
```env
PORT=4000
MONGODB_URI=mongodb://localhost/student-toolkit
JWT_SECRET=your_secret
```

## 🎯 Future Enhancements

- Cloud data persistence
- Advanced notifications
- Automated study reminders
- Notes manager
- Assignment tracker
- Resume builder
- Placement tracker

## 📝 License

This project is built for IEEE MSIT student community.
