# Team Task Manager - Full Stack Application

A comprehensive web application for managing projects, teams, and tasks with role-based access control.

## Features

✅ **Authentication System**
- User Signup/Login with email verification
- JWT-based authentication
- Password hashing with bcryptjs
- Profile management

✅ **Project Management**
- Create, read, update, delete projects
- Project status tracking (planning, active, completed, archived)
- Priority levels (low, medium, high)
- Team member management per project

✅ **Task Management**
- Create and assign tasks to team members
- Task status tracking (todo, in-progress, review, completed, blocked)
- Priority levels (low, medium, high, critical)
- Due date tracking and overdue detection
- Task comments and collaboration
- Time estimation and tracking

✅ **Team Management**
- Create teams and manage members
- Role-based team members (admin, member)
- Add/remove team members
- Associate projects with teams

✅ **Dashboard**
- Real-time statistics
- Task overview
- Project summary
- Overdue task alerts
- Quick navigation

✅ **Role-Based Access Control**
- Admin role with full permissions
- Member role with limited access
- Project-level access control
- Team-level permissions

## Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: bcryptjs
- **Validation**: Joi, Express Validator
- **Middleware**: CORS, Express JSON

### Frontend
- **Library**: React 18
- **Router**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS3

## Project Structure

```
Team-Task-Manager/
├── Backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Project.js           # Project schema
│   │   ├── Task.js              # Task schema
│   │   └── Team.js              # Team schema
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── projects.js          # Project endpoints
│   │   ├── tasks.js             # Task endpoints
│   │   └── teams.js             # Team endpoints
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── projectController.js # Project logic
│   │   ├── taskController.js    # Task logic
│   │   └── teamController.js    # Team logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── roleCheck.js         # Role verification
│   ├── utils/
│   │   └── validators.js        # Input validation
│   ├── server.js                # Server entry point
│   ├── package.json
│   └── .env.example
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   ├── Login.js
    │   │   │   ├── Signup.js
    │   │   │   └── Auth.css
    │   │   ├── Dashboard/
    │   │   │   ├── Dashboard.js
    │   │   │   └── Dashboard.css
    │   │   ├── Projects/
    │   │   │   ├── Projects.js
    │   │   │   └── Projects.css
    │   │   ├── Tasks/
    │   │   │   ├── Tasks.js
    │   │   │   └── Tasks.css
    │   │   ├── Teams/
    │   │   │   ├── Teams.js
    │   │   │   └── Teams.css
    │   │   └── PrivateRoute.js
    │   ├── context/
    │   │   └── AuthContext.js    # Global auth state
    │   ├── services/
    │   │   └── api.js            # API client
    │   ├── utils/
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to Backend folder:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret:
```env
MONGODB_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to Frontend folder:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:projectId` - Get project details
- `PUT /api/projects/:projectId` - Update project
- `DELETE /api/projects/:projectId` - Delete project
- `POST /api/projects/:projectId/members` - Add team member
- `DELETE /api/projects/:projectId/members/:userId` - Remove member

### Tasks
- `POST /api/tasks/:projectId/tasks` - Create task
- `GET /api/tasks/:projectId/tasks` - Get project tasks
- `GET /api/tasks/task/:taskId` - Get task details
- `PUT /api/tasks/task/:taskId` - Update task
- `DELETE /api/tasks/task/:taskId` - Delete task
- `POST /api/tasks/task/:taskId/assign` - Assign task
- `DELETE /api/tasks/task/:taskId/assign/:userId` - Unassign task
- `POST /api/tasks/task/:taskId/comment` - Add comment

### Teams
- `POST /api/teams` - Create team
- `GET /api/teams` - Get all teams
- `GET /api/teams/:teamId` - Get team details
- `PUT /api/teams/:teamId` - Update team
- `DELETE /api/teams/:teamId` - Delete team
- `POST /api/teams/:teamId/members` - Add member
- `DELETE /api/teams/:teamId/members/:userId` - Remove member
- `POST /api/teams/:teamId/projects` - Add project
- `GET /api/teams/user/dashboard-stats` - Get dashboard stats

## Usage Guide

### 1. Sign Up
- Go to `/signup`
- Enter first name, last name, email, and password
- Click "Sign Up"

### 2. Login
- Go to `/login`
- Enter email and password
- Click "Login"

### 3. Create Project
- Navigate to Projects page
- Click "+ New Project"
- Fill in project details
- Click "Create Project"

### 4. Create Team
- Navigate to Teams page
- Click "+ New Team"
- Fill in team details
- Click "Create Team"

### 5. Manage Tasks
- Go to Projects
- Select a project
- Create tasks and assign to team members
- Track task status and progress

## Key Features Implementation

### Role-Based Access Control
```javascript
// Implemented via middleware
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
  };
};
```

### Task Status Tracking
- todo
- in-progress
- review
- completed
- blocked

### Priority Levels
**Tasks**: low, medium, high, critical
**Projects**: low, medium, high

### Overdue Detection
Automatically marks tasks as overdue if:
- Due date is before current date
- Task status is not "completed"

## Validation Rules

### User Registration
- First name & Last name: Required, non-empty
- Email: Valid format, unique
- Password: Minimum 6 characters

### Project Creation
- Name: Required, max 100 characters
- End date must be after start date

### Task Creation
- Title: Required, max 200 characters
- Valid status and priority values

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": { /* validation errors */ }
}
```

## Security Features

✅ JWT-based authentication
✅ Password hashing with bcryptjs
✅ CORS protection
✅ Role-based access control
✅ Input validation and sanitization
✅ Protected routes

## Database Schema

### Users
- firstName, lastName, email, password
- role (admin/member)
- avatar, isActive, lastLogin
- timestamps

### Projects
- name, description, owner, team
- status, priority, startDate, endDate
- tags, isActive
- timestamps

### Tasks
- title, description, project, createdBy
- assignedTo (array), status, priority
- dueDate, estimatedHours, actualHours
- tags, comments, attachments
- isOverdue flag
- timestamps

### Teams
- name, description, owner
- members (array with roles)
- projects (array of project IDs)
- isActive
- timestamps

## Future Enhancements

- [ ] Task attachments upload
- [ ] Email notifications
- [ ] Real-time updates with WebSockets
- [ ] Project analytics and reports
- [ ] Task templates
- [ ] Time tracking integration
- [ ] Mobile app
- [ ] Advanced search filters
- [ ] User mentions in comments
- [ ] Activity logs
- [ ] Recurring tasks

## Troubleshooting

### Backend won't connect to MongoDB
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify connection string format

### CORS errors
- Check CORS_ORIGIN in backend .env
- Ensure frontend URL matches

### Authentication failing
- Verify JWT_SECRET is set
- Check token expiry
- Clear browser localStorage and try again

### Frontend can't reach backend
- Ensure backend is running on port 5000
- Check proxy setting in frontend package.json
- Verify firewall settings

## Contributing

Feel free to fork and submit pull requests with improvements!

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.

---

**Happy Task Managing! 🚀**
