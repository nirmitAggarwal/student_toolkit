#!/bin/bash

# Student Toolkit - Quick Development Commands

# ===========================================
# BACKEND SETUP AND RUN
# ===========================================

echo "🔧 Backend Setup Commands"
echo "========================"
echo "First time setup:"
echo "  cd server"
echo "  npm install"
echo "  Create .env file with values from .env.example"
echo ""
echo "Run development server:"
echo "  npm run dev"
echo ""
echo "Server runs on: http://localhost:4000"
echo ""

# ===========================================
# FRONTEND SETUP AND RUN
# ===========================================

echo "🎨 Frontend Setup Commands"
echo "========================="
echo "First time setup:"
echo "  cd client"
echo "  npm install"
echo "  Create .env.local file with values from .env.example"
echo ""
echo "Run development server:"
echo "  npm run dev"
echo ""
echo "Build for production:"
echo "  npm run build"
echo ""
echo "Server runs on: http://localhost:5173"
echo ""

# ===========================================
# ENVIRONMENT VARIABLES
# ===========================================

echo "🔐 Environment Variables to Set"
echo "==============================="
echo ""
echo "BACKEND (.env):"
echo "  PORT=4000"
echo "  MONGODB_URI=mongodb://localhost:27017/student-toolkit"
echo "  JWT_SECRET=your_secret_key"
echo "  GITHUB_CLIENT_SECRET=from_github_settings"
echo "  GITHUB_CLIENT_ID=from_github_settings"
echo ""
echo "FRONTEND (.env.local):"
echo "  VITE_API_BASE_URL=http://localhost:4000/api"
echo "  VITE_GITHUB_CLIENT_ID=from_github_settings"
echo ""

# ===========================================
# GETTING OAUTH CREDENTIALS
# ===========================================

echo "📝 Getting OAuth Credentials"
echo "============================"
echo ""
echo "GitHub OAuth:"
echo "  1. Go to GitHub Settings > Developer Settings > OAuth Apps"
echo "  2. Create new OAuth App"
echo "  3. Authorization callback URL: http://localhost:5173/auth/github/callback"
echo "  4. Copy Client ID and Client Secret"
echo ""

# ===========================================
# TESTING
# ===========================================

echo "✅ Testing the Application"
echo "=========================="
echo ""
echo "1. Start backend: cd server && npm run dev"
echo "2. Start frontend: cd client && npm run dev"
echo "3. Open browser: http://localhost:5173"
echo "4. Click 'Sign in with Google' or 'Sign in with GitHub'"
echo "5. Test a tool from the sidebar"
echo ""

# ===========================================
# USEFUL LINKS
# ===========================================

echo "📚 Useful Links"
echo "==============="
echo "Google Console:        https://console.cloud.google.com"
echo "GitHub Settings:       https://github.com/settings/developers"
echo "MongoDB Atlas:        https://www.mongodb.com/cloud/atlas"
echo "React Docs:            https://react.dev"
echo "Express Docs:          https://expressjs.com"
echo "TailwindCSS Docs:      https://tailwindcss.com"
echo ""
