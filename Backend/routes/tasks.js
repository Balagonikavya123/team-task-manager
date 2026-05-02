const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All task routes require authentication
router.use(auth);

// Tasks for a project
router.post('/:projectId/tasks', taskController.createTask);
router.get('/:projectId/tasks', taskController.getTasksByProject);

// Individual task operations
router.get('/task/:taskId', taskController.getTaskById);
router.put('/task/:taskId', taskController.updateTask);
router.delete('/task/:taskId', roleCheck(['admin']), taskController.deleteTask);

// Task assignment
router.post('/task/:taskId/assign', roleCheck(['admin']), taskController.assignTask);
router.delete('/task/:taskId/assign/:userId', roleCheck(['admin']), taskController.unassignTask);

// Task comments
router.post('/task/:taskId/comment', taskController.addComment);

// Get user's overdue tasks
router.get('/user/overdue-tasks', taskController.getOverdueTasks);

module.exports = router;
