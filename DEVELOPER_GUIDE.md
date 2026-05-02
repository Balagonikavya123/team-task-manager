# Team Task Manager - Developer Guide

## Project Overview

This is a full-stack Team Task Manager application built with:
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Frontend**: React, React Router, Axios
- **Architecture**: RESTful API with React frontend

## Key Files & Their Purpose

### Backend

#### Core Files
- `server.js` - Express server entry point
- `package.json` - Dependencies and scripts
- `.env` - Environment variables
- `.env.example` - Example environment variables

#### Configuration
- `config/database.js` - MongoDB connection setup

#### Database Models
- `models/User.js` - User schema with password hashing
- `models/Project.js` - Project schema with team management
- `models/Task.js` - Task schema with status tracking
- `models/Team.js` - Team schema with member management

#### API Routes
- `routes/auth.js` - Authentication endpoints
- `routes/projects.js` - Project CRUD endpoints
- `routes/tasks.js` - Task CRUD endpoints
- `routes/teams.js` - Team CRUD endpoints

#### Business Logic
- `controllers/authController.js` - Auth logic (signup, login, profile)
- `controllers/projectController.js` - Project management logic
- `controllers/taskController.js` - Task management logic
- `controllers/teamController.js` - Team management logic

#### Security & Validation
- `middleware/auth.js` - JWT token verification
- `middleware/roleCheck.js` - Role-based authorization
- `utils/validators.js` - Input validation logic

### Frontend

#### Core Files
- `src/index.js` - React app entry point
- `src/App.js` - Main app component with routing
- `src/App.css` - Global styles
- `package.json` - Dependencies and scripts
- `public/index.html` - HTML template

#### State Management
- `src/context/AuthContext.js` - Global auth state with hooks

#### API Integration
- `src/services/api.js` - Axios instance and API calls

#### Components
- `src/components/Auth/`
  - `Login.js` - Login form component
  - `Signup.js` - Signup form component
  - `Auth.css` - Auth page styles

- `src/components/Dashboard/`
  - `Dashboard.js` - Main dashboard component
  - `Dashboard.css` - Dashboard styles

- `src/components/Projects/`
  - `Projects.js` - Projects list and creation
  - `Projects.css` - Projects page styles

- `src/components/Teams/`
  - `Teams.js` - Teams list and creation
  - `Teams.css` - Teams page styles

- `src/components/Tasks/` - (Placeholder for task components)
- `src/components/PrivateRoute.js` - Route protection component

#### Utilities
- `src/utils/` - (Ready for utility functions)

### Documentation
- `README.md` - Full project documentation
- `SETUP.md` - Quick start guide
- `API_DOCUMENTATION.md` - API reference
- `.gitignore` - Git ignore patterns
- `package.json` (root) - Script to run both frontend & backend

## Data Flow

### Authentication Flow
```
User Input (Login/Signup)
  ↓
Frontend Component (Login/Signup)
  ↓
Axios API Call
  ↓
Backend Route Handler
  ↓
Auth Controller
  ↓
MongoDB User Model
  ↓
JWT Token Generated
  ↓
Token Stored in localStorage
  ↓
User Redirected to Dashboard
```

### Project Creation Flow
```
User Input (Project Form)
  ↓
Projects Component
  ↓
API Call with Token
  ↓
Auth Middleware (Verify Token)
  ↓
Project Controller
  ↓
Project Model Validation
  ↓
MongoDB Insert
  ↓
Response with Created Project
  ↓
Update Frontend State
  ↓
UI Rerender
```

## Important Concepts

### Models & Relationships

**User**
- Has many Projects (as owner)
- Has many Teams (as owner)
- Has many Tasks (as creator or assignee)

**Project**
- Belongs to User (owner)
- Has many Team members
- Has many Tasks

**Task**
- Belongs to Project
- Created by User
- Assigned to multiple Users
- Has many Comments

**Team**
- Belongs to User (owner)
- Has many Members
- Has many Projects

### Authentication & Authorization

1. **JWT Tokens**: Used for stateless authentication
2. **Role-Based Access**: Admin vs Member roles
3. **Resource Ownership**: Users can only modify their own resources
4. **Middleware Chain**: Request → Auth Middleware → Role Middleware → Controller

### Database Indexes

For performance optimization, these indexes are already added:
- User: unique on email
- Project: on owner, team.user
- Task: on project, assignedTo, status
- Team: on owner, members.user

## Development Workflow

### Adding a New Feature

1. **Backend**:
   - Add route in `routes/`
   - Add controller logic in `controllers/`
   - Add/update model in `models/`
   - Add validation in `utils/validators.js`

2. **Frontend**:
   - Create component in `components/`
   - Add API call in `services/api.js`
   - Add route in `App.js`
   - Create CSS for styling

3. **Testing**:
   - Use Postman for API testing
   - Test in browser for UI

### Common Tasks

#### Create a New API Endpoint
```javascript
// 1. Add to controller
exports.newFunction = async (req, res) => {
  try {
    // Logic here
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Add to routes
router.post('/endpoint', auth, newFunction);

// 3. Call from frontend
const response = await api.post('/endpoint', data);
```

#### Add New Field to Model
```javascript
// 1. Update Schema
const schema = new mongoose.Schema({
  newField: String,
});

// 2. Update Controller (if needed)
// 3. Update Validation (if needed)
// 4. Update Frontend UI
```

#### Protect Route with Role
```javascript
// Use roleCheck middleware
router.post('/admin-only', auth, roleCheck(['admin']), controller.handler);
```

## Common Commands

### Development
```bash
# Install all dependencies
npm run install-all

# Start both backend and frontend
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client
```

### Production
```bash
# Build frontend
npm run build

# Start backend (production)
NODE_ENV=production npm start
```

## Debugging Tips

### Backend Debug
```javascript
// Add console logs
console.log('Debug:', variable);

// Use try-catch
try {
  // code
} catch (error) {
  console.error('Error:', error);
}
```

### Frontend Debug
```javascript
// React DevTools
// Redux DevTools (if using Redux)
// Browser console for errors
// Network tab to check API calls
```

### Common Issues

1. **CORS Error**: Check CORS_ORIGIN in .env
2. **JWT Error**: Verify token format and JWT_SECRET
3. **404 Error**: Check route path and method
4. **Validation Error**: Check request body format
5. **State Not Updating**: Check React Context provider

## Performance Considerations

1. **Database Queries**:
   - Use indexes for frequently queried fields
   - Use populate() selectively
   - Limit fields in select()

2. **Frontend**:
   - Use React.memo for components
   - Implement pagination for lists
   - Lazy load routes if needed

3. **API**:
   - Implement caching
   - Add request rate limiting
   - Use pagination for large datasets

## Security Best Practices

✅ JWT for stateless authentication
✅ Password hashing with bcrypt
✅ CORS protection
✅ Input validation
✅ Role-based access control

**Todo for Production:**
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Implement refresh tokens
- [ ] Add API versioning
- [ ] Add request sanitization
- [ ] Implement audit logging
- [ ] Add two-factor authentication

## Testing Checklist

- [ ] Test signup with valid data
- [ ] Test login with correct credentials
- [ ] Test creating projects
- [ ] Test adding team members
- [ ] Test creating tasks
- [ ] Test assigning tasks
- [ ] Test deleting resources
- [ ] Test error handling
- [ ] Test unauthorized access
- [ ] Test role-based access

## Deployment Checklist

- [ ] Update .env with production values
- [ ] Change JWT_SECRET to strong value
- [ ] Set NODE_ENV=production
- [ ] Setup MongoDB for production
- [ ] Setup CORS for production domain
- [ ] Build frontend: npm run build
- [ ] Setup backend hosting (Heroku, AWS, etc)
- [ ] Setup frontend hosting (Netlify, Vercel, etc)
- [ ] Setup SSL certificates
- [ ] Configure logging and monitoring
- [ ] Setup automated backups

## Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [JWT Introduction](https://jwt.io/introduction)
- [RESTful API Best Practices](https://restfulapi.net/)

## Support

For issues or questions:
1. Check the README.md
2. Review API_DOCUMENTATION.md
3. Check your browser console for errors
4. Look at server logs

---

**Happy Coding! 🚀**
