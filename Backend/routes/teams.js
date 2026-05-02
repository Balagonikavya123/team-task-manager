const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All team routes require authentication
router.use(auth);

// Team CRUD
router.post('/', roleCheck(['admin']), teamController.createTeam);
router.get('/', teamController.getAllTeams);
router.get('/:teamId', teamController.getTeamById);
router.put('/:teamId', roleCheck(['admin']), teamController.updateTeam);
router.delete('/:teamId', roleCheck(['admin']), teamController.deleteTeam);

// Team member management
router.post('/:teamId/members', roleCheck(['admin']), teamController.addTeamMember);
router.delete('/:teamId/members/:userId', roleCheck(['admin']), teamController.removeTeamMember);

// Team projects
router.post('/:teamId/projects', roleCheck(['admin']), teamController.addProjectToTeam);

// Dashboard stats
router.get('/user/dashboard-stats', teamController.getDashboardStats);

module.exports = router;
