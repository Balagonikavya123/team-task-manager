# Team Task Manager - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

### 2. Login
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

### 3. Get Current User
**GET** `/auth/me`

Get currently authenticated user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "member",
    "avatar": null,
    "isActive": true,
    "lastLogin": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Update Profile
**PUT** `/auth/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe Updated",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

---

## Project Endpoints

### 1. Create Project
**POST** `/projects`

Create a new project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "priority": "high",
  "startDate": "2024-02-01",
  "endDate": "2024-03-01",
  "tags": ["web", "backend"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "project": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "New Project",
    "description": "Project description",
    "owner": { /* user object */ },
    "team": [
      {
        "user": { /* user object */ },
        "role": "admin"
      }
    ],
    "status": "planning",
    "priority": "high",
    "startDate": "2024-02-01",
    "endDate": "2024-03-01",
    "tags": ["web", "backend"],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get All Projects
**GET** `/projects`

Get all projects for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "projects": [ /* array of projects */ ]
}
```

### 3. Get Project by ID
**GET** `/projects/:projectId`

Get specific project details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "project": { /* project object */ }
}
```

### 4. Update Project
**PUT** `/projects/:projectId`

Update project details (owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "active",
  "priority": "medium",
  "startDate": "2024-02-01",
  "endDate": "2024-04-01",
  "tags": ["updated", "tag"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "project": { /* updated project object */ }
}
```

### 5. Delete Project
**DELETE** `/projects/:projectId`

Delete a project (owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### 6. Add Team Member to Project
**POST** `/projects/:projectId/members`

Add a user to project team.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "member@example.com",
  "role": "member"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Team member added successfully",
  "project": { /* updated project */ }
}
```

### 7. Remove Team Member
**DELETE** `/projects/:projectId/members/:userId`

Remove a member from project team.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Team member removed successfully",
  "project": { /* updated project */ }
}
```

---

## Task Endpoints

### 1. Create Task
**POST** `/tasks/:projectId/tasks`

Create a new task in a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task description",
  "assignedTo": ["userId1", "userId2"],
  "priority": "high",
  "dueDate": "2024-02-20",
  "estimatedHours": 8,
  "tags": ["feature", "urgent"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Task Title",
    "description": "Task description",
    "project": "projectId",
    "createdBy": { /* user object */ },
    "assignedTo": [ /* array of user objects */ ],
    "status": "todo",
    "priority": "high",
    "dueDate": "2024-02-20",
    "estimatedHours": 8,
    "actualHours": null,
    "tags": ["feature", "urgent"],
    "comments": [],
    "isOverdue": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get Tasks by Project
**GET** `/tasks/:projectId/tasks`

Get all tasks for a project with optional filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status (todo, in-progress, review, completed, blocked)
- `priority` - Filter by priority (low, medium, high, critical)
- `assignedTo` - Filter by assigned user ID

**Example:**
```
GET /tasks/projectId/tasks?status=in-progress&priority=high
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "tasks": [ /* array of tasks */ ]
}
```

### 3. Get Task by ID
**GET** `/tasks/task/:taskId`

Get specific task details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "task": { /* task object */ }
}
```

### 4. Update Task
**PUT** `/tasks/task/:taskId`

Update task details.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "medium",
  "dueDate": "2024-02-25",
  "estimatedHours": 10,
  "actualHours": 5,
  "tags": ["updated"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": { /* updated task object */ }
}
```

### 5. Assign Task
**POST** `/tasks/task/:taskId/assign`

Assign task to a user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "userId"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task assigned successfully",
  "task": { /* updated task object */ }
}
```

### 6. Unassign Task
**DELETE** `/tasks/task/:taskId/assign/:userId`

Remove user assignment from task.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task unassigned successfully",
  "task": { /* updated task object */ }
}
```

### 7. Add Comment
**POST** `/tasks/task/:taskId/comment`

Add a comment to a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "text": "This is a comment"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "task": { /* updated task with new comment */ }
}
```

### 8. Get Overdue Tasks
**GET** `/tasks/user/overdue-tasks`

Get all overdue tasks assigned to current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "tasks": [ /* array of overdue tasks */ ]
}
```

### 9. Delete Task
**DELETE** `/tasks/task/:taskId`

Delete a task (creator only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Team Endpoints

### 1. Create Team
**POST** `/teams`

Create a new team.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Development Team",
  "description": "Team for development projects"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Team created successfully",
  "team": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Development Team",
    "description": "Team for development projects",
    "owner": { /* user object */ },
    "members": [
      {
        "user": { /* user object */ },
        "role": "admin",
        "joinedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "projects": [],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get All Teams
**GET** `/teams`

Get all teams for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "teams": [ /* array of teams */ ]
}
```

### 3. Get Team by ID
**GET** `/teams/:teamId`

Get specific team details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "team": { /* team object */ }
}
```

### 4. Update Team
**PUT** `/teams/:teamId`

Update team details (owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Team Name",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Team updated successfully",
  "team": { /* updated team object */ }
}
```

### 5. Delete Team
**DELETE** `/teams/:teamId`

Delete a team (owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Team deleted successfully"
}
```

### 6. Add Team Member
**POST** `/teams/:teamId/members`

Add a user to team.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "member@example.com",
  "role": "member"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Team member added successfully",
  "team": { /* updated team */ }
}
```

### 7. Remove Team Member
**DELETE** `/teams/:teamId/members/:userId`

Remove a member from team.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Team member removed successfully",
  "team": { /* updated team */ }
}
```

### 8. Add Project to Team
**POST** `/teams/:teamId/projects`

Add a project to team.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "projectId": "projectId"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project added to team successfully",
  "team": { /* updated team */ }
}
```

### 9. Get Dashboard Stats
**GET** `/teams/user/dashboard-stats`

Get dashboard statistics for current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalTasks": 10,
    "completedTasks": 4,
    "inProgressTasks": 3,
    "overdueTasks": 2,
    "totalProjects": 5,
    "totalTeams": 2
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding in production.

## Pagination

Currently no pagination is implemented. Consider adding for large datasets.

## CORS

CORS is enabled for `http://localhost:3000` in development. Update `CORS_ORIGIN` in `.env` for other domains.

---

**API Documentation Version: 1.0**
