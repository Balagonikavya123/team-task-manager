const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All project routes require authentication
router.use(auth);

// Project CRUD
router.post('/', roleCheck(['admin']), projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:projectId', projectController.getProjectById);
router.put('/:projectId', roleCheck(['admin']), projectController.updateProject);
router.delete('/:projectId', roleCheck(['admin']), projectController.deleteProject);

// Team member management
router.post('/:projectId/members', roleCheck(['admin']), projectController.addTeamMember);
router.delete('/:projectId/members/:userId', roleCheck(['admin']), projectController.removeTeamMember);

module.exports = router;
