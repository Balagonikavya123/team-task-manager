const Team = require('../models/Team');
const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');

// Create team
exports.createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.userId;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Team name is required',
      });
    }

    const team = new Team({
      name,
      description,
      owner: userId,
      members: [
        {
          user: userId,
          role: 'admin',
        },
      ],
    });

    await team.save();
    await team.populate('owner', 'firstName lastName email');
    await team.populate('members.user', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all teams for user
exports.getAllTeams = async (req, res) => {
  try {
    const userId = req.userId;

    const teams = await Team.find({
      $or: [{ owner: userId }, { 'members.user': userId }],
    })
      .populate('owner', 'firstName lastName email')
      .populate('members.user', 'firstName lastName email')
      .populate('projects')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.userId;

    const team = await Team.findById(teamId)
      .populate('owner', 'firstName lastName email')
      .populate('members.user', 'firstName lastName email')
      .populate('projects');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    // Check access
    const hasAccess =
      team.owner._id.toString() === userId ||
      team.members.some((m) => m.user._id.toString() === userId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    res.json({
      success: true,
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update team
exports.updateTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.userId;
    const { name, description } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    if (req.userRole !== 'admin' && team.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized - only owner can update',
      });
    }

    if (name) team.name = name;
    if (description) team.description = description;

    await team.save();
    await team.populate('owner', 'firstName lastName email');
    await team.populate('members.user', 'firstName lastName email');
    await team.populate('projects');

    res.json({
      success: true,
      message: 'Team updated successfully',
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add member to team
exports.addTeamMember = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { email, role } = req.body;
    const userId = req.userId;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    if (req.userRole !== 'admin' && team.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const alreadyMember = team.members.some((m) => m.user.toString() === user._id.toString());
    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a team member',
      });
    }

    team.members.push({
      user: user._id,
      role: role || 'member',
    });

    await team.save();
    await team.populate('owner', 'firstName lastName email');
    await team.populate('members.user', 'firstName lastName email');
    await team.populate('projects');

    res.json({
      success: true,
      message: 'Team member added successfully',
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove member from team
exports.removeTeamMember = async (req, res) => {
  try {
    const { teamId, userId: memberIdToRemove } = req.params;
    const userId = req.userId;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    if (req.userRole !== 'admin' && team.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    team.members = team.members.filter((m) => m.user.toString() !== memberIdToRemove);

    await team.save();
    await team.populate('owner', 'firstName lastName email');
    await team.populate('members.user', 'firstName lastName email');
    await team.populate('projects');

    res.json({
      success: true,
      message: 'Team member removed successfully',
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add project to team
exports.addProjectToTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { projectId } = req.body;
    const userId = req.userId;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    if (req.userRole !== 'admin' && team.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (team.projects.includes(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Project is already in the team',
      });
    }

    team.projects.push(projectId);

    await team.save();
    await team.populate('owner', 'firstName lastName email');
    await team.populate('members.user', 'firstName lastName email');
    await team.populate('projects');

    res.json({
      success: true,
      message: 'Project added to team successfully',
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user's tasks
    const tasks = await Task.find({ assignedTo: userId });
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
    const overdueTasks = tasks.filter((t) => t.isOverdue && t.status !== 'completed').length;

    // Get user's projects
    const projects = await Project.countDocuments({
      $or: [{ owner: userId }, { 'team.user': userId }],
    });

    // Get user's teams
    const teams = await Team.countDocuments({
      $or: [{ owner: userId }, { 'members.user': userId }],
    });

    res.json({
      success: true,
      stats: {
        totalTasks: tasks.length,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        totalProjects: projects,
        totalTeams: teams,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete team
exports.deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.userId;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    if (req.userRole !== 'admin' && team.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await Team.findByIdAndDelete(teamId);

    res.json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
