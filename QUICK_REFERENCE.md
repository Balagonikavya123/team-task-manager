# Quick Reference & Commands

## 🚀 Getting Started - 5 Minutes

```bash
# 1. Install all dependencies
npm run install-all

# 2. Start MongoDB (if local)
mongod

# 3. Start backend
cd Backend && npm start

# 4. Start frontend (in new terminal)
cd Frontend && npm start

# 5. Open browser
http://localhost:3000
```

## 📋 Useful Commands

### Backend Commands

```bash
# Install dependencies
cd Backend && npm install

# Start server
npm start

# Start with hot reload (dev mode)
npm run dev

# Run tests (when added)
npm test
```

### Frontend Commands

```bash
# Install dependencies
cd Frontend && npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests (when added)
npm test
```

### Root Directory Commands

```bash
# Install dependencies for both backend and frontend
npm run install-all

# Start both backend and frontend concurrently
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build frontend for production
npm run build
```

## 🐛 Debugging

### Backend Debug
```bash
# Add DEBUG=* to any command for verbose logging
DEBUG=* npm run dev

# Debug with node inspector
node --inspect server.js
```

### Frontend Debug
```bash
# Browser DevTools
- Ctrl+Shift+I (Windows)
- Cmd+option+I (Mac)

# React DevTools
- Install React DevTools browser extension

# Redux DevTools (if using Redux)
- Install Redux DevTools extension
```

## 🔧 Common Issues & Fixes

### Port Already in Use

```bash
# Windows: Find and kill process on port
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Mac/Linux: Kill process on port
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Alternative: Change port in .env
PORT=5001
```

### MongoDB Connection Error

```bash
# Verify MongoDB is running
mongosh

# If not running:
# - Windows: Use MongoDB installation
# - Mac: brew services start mongodb-community
# - Linux: sudo systemctl start mongod

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/team-task-manager
```

### CORS Error

```bash
# Update .env with correct frontend URL
CORS_ORIGIN=http://localhost:3000

# Or for production:
CORS_ORIGIN=https://yourdomain.com
```

### Npm Install Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 🌐 API Testing

### Using curl

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

# Get current user (replace TOKEN)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import API endpoints into Postman
2. Set up authorization header with token
3. Test endpoints individually

## 📁 File Structure Quick Reference

```
Team-Task-Manager/
├── Backend/
│   ├── config/          # Database config
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth & roleCheck
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── utils/           # Validators
│   ├── server.js        # Entry point
│   ├── package.json
│   ├── .env
│   └── .env.example
├── Frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # State management
│   │   ├── services/    # API calls
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── Documentation files
└── package.json (root)
```

## 🔑 Default Credentials (Development)

After signup, use any test account:
```
Email: test@example.com
Password: testpass123
```

## 🌍 Environment Variables Reference

### Backend (.env)

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/team-task-manager

# JWT Security
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env) - Optional

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Complete project overview |
| SETUP.md | Installation guide |
| API_DOCUMENTATION.md | API reference |
| DEVELOPER_GUIDE.md | Development guide |
| PROJECT_SUMMARY.md | Feature summary |
| This File | Quick reference |

## ✅ Pre-Deployment Checklist

- [ ] Test all features locally
- [ ] Update .env with production values
- [ ] Change JWT_SECRET to strong value
- [ ] Verify CORS_ORIGIN for production
- [ ] Setup MongoDB Atlas
- [ ] Build frontend: `npm run build`
- [ ] Test build in production mode
- [ ] Setup SSL certificates
- [ ] Configure logging
- [ ] Setup monitoring
- [ ] Configure backups
- [ ] Document deployment process

## 🚢 Deployment Steps

### Backend (Heroku Example)

```bash
# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Frontend (Netlify Example)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

## 🔍 Useful Resources

- API Documentation: `API_DOCUMENTATION.md`
- Setup Guide: `SETUP.md`
- Developer Guide: `DEVELOPER_GUIDE.md`
- MongoDB Docs: https://docs.mongodb.com/
- Express Docs: https://expressjs.com/
- React Docs: https://react.dev/

## 💬 Quick Support

**Question**: Backend not connecting to frontend?
**Answer**: Ensure CORS_ORIGIN in .env matches frontend URL

**Question**: Login not working?
**Answer**: Check JWT_SECRET is set in .env

**Question**: Tasks not showing?
**Answer**: Verify API endpoint is correct and token is valid

**Question**: Need to reset database?
**Answer**: Connect to MongoDB and drop the database, then restart

## 📞 Getting Help

1. Check the documentation files
2. Review API_DOCUMENTATION.md
3. Check browser console for errors
4. Check server logs
5. Verify all environment variables
6. Ensure MongoDB is running
7. Try restarting services

---

## Keyboard Shortcuts

### Terminal
```
Ctrl+C    - Stop running process
Ctrl+L    - Clear screen
Ctrl+A    - Go to beginning of line
Ctrl+E    - Go to end of line
```

### Development
```
Ctrl+Shift+I  - Open DevTools (Windows)
Cmd+Option+I  - Open DevTools (Mac)
Ctrl+Shift+R  - Hard refresh (clear cache)
F12           - Toggle DevTools
```

---

**Last Updated**: 2024
**Version**: 1.0.0
