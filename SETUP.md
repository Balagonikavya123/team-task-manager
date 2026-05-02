# Team Task Manager - Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** (optional) - [Download](https://git-scm.com/)

## Installation Steps

### Step 1: MongoDB Setup

**Option A: Local MongoDB**
```bash
# On Windows
mongod

# On Mac/Linux
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Replace `MONGODB_URI` in `.env` with your connection string

### Step 2: Backend Setup

```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# The .env file is already configured with default values
# For production, update the following in .env:
# - JWT_SECRET: Change to a strong secret
# - MONGODB_URI: Your MongoDB connection string
# - CORS_ORIGIN: Your frontend URL

# Start the backend server
npm start
# or for development with auto-reload:
npm run dev
```

✅ Backend will start on `http://localhost:5000`

Verify it's running:
```bash
curl http://localhost:5000/api/health
# Expected: {"success": true, "message": "Server is running"}
```

### Step 3: Frontend Setup

```bash
# Open a new terminal
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

✅ Frontend will open automatically at `http://localhost:3000`

If it doesn't open automatically, visit `http://localhost:3000` in your browser.

## First Time Usage

### 1. Create an Account
- Click "Sign Up" on the login page
- Fill in your details (First Name, Last Name, Email, Password)
- Click "Sign Up"

### 2. Login
- Use your credentials to login
- You'll be redirected to the Dashboard

### 3. Create Your First Project
- Navigate to "Projects" in the sidebar
- Click "+ New Project"
- Fill in the project details
- Click "Create Project"

### 4. Create a Team
- Navigate to "Teams" in the sidebar
- Click "+ New Team"
- Fill in the team details
- Click "Create Team"

### 5. Add Tasks
- Go to your project
- Create tasks and assign them to team members
- Track progress from the Dashboard

## Environment Variables

### Backend (.env)

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/team-task-manager

# JWT secret key (change this in production!)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# JWT expiration time
JWT_EXPIRE=7d

# Server port
PORT=5000

# Environment mode
NODE_ENV=development

# Frontend URL for CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend

Create `.env` file in the Frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Common Commands

### Backend

```bash
# Start server
npm start

# Start with auto-reload (requires nodemon)
npm run dev

# Run tests
npm test
```

### Frontend

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test

# Eject from create-react-app (not recommended)
npm eject
```

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Ensure MongoDB is running
- Check your MONGODB_URI is correct
- If using MongoDB Atlas, whitelist your IP address

### Issue: "CORS error when accessing backend"
**Solution:**
- Backend must be running on port 5000
- Ensure CORS_ORIGIN in .env matches your frontend URL
- Check browser console for specific error

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# On Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# On Mac/Linux
lsof -ti:5000 | xargs kill -9

# Or change the port in .env
PORT=5001
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# On Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# On Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: "npm install fails"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: "ENOTFOUND localhost"
**Solution:**
- Ensure backend is running before frontend
- Check firewall settings
- Try using 127.0.0.1 instead of localhost

## Testing the APIs

Use Postman or curl to test APIs:

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Create Project (requires token)
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "My Project",
    "description": "Project description",
    "priority": "high"
  }'
```

## Deployment

### Backend Deployment (Heroku)

1. Install Heroku CLI
2. Create Procfile:
```
web: node server.js
```
3. Push to Heroku:
```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)

```bash
# Build the frontend
cd Frontend
npm run build

# Deploy using Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

## Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Review the API endpoints documentation
- Check browser console for error messages
- Ensure both backend and frontend are running

## Next Steps

1. ✅ Create a few test projects and teams
2. ✅ Understand the UI and features
3. ✅ Read through the code structure
4. ✅ Explore implementing new features
5. ✅ Deploy to production

---

**Happy coding! 🚀**
