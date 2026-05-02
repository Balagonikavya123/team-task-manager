const Project = require('../models/Project');
const User = require('../models/User');
const { validateProjectData } = require('../utils/validators');

// Create project
exports.createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, priority, tags } = req.body;
    const userId = req.userId;

    // Validate
    const validation = validateProjectData({ name, startDate, endDate });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    // Create project
    const project = new Project({
      name,
      description,
      owner: userId,
      startDate,
      endDate,
      priority,
      tags,
      team: [
        {
          user: userId,
          role: 'admin',
        },
      ],
    });

    await project.save();
    await project.populate('owner', 'firstName lastName email');
    await project.populate('team.user', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all projects for user
exports.getAllProjects = async (req, res) => {
  try {
    const userId = req.userId;
    const projects = await Project.find({
      $or: [{ owner: userId }, { 'team.user': userId }],
    })
      .populate('owner', 'firstName lastName email')
      .populate('team.user', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId)
      .populate('owner', 'firstName lastName email')
      .populate('team.user', 'firstName lastName email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check access
    const hasAccess =
      project.owner._id.toString() === userId ||
      project.team.some((t) => t.user._id.toString() === userId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;
    const { name, description, status, priority, startDate, endDate, tags } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is project admin
    const isAdmin = req.userRole === 'admin' || project.owner.toString() === userId;
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized - only admin can update',
      });
    }

    // Update fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (status) project.status = status;
    if (priority) project.priority = priority;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
    if (tags) project.tags = tags;

    await project.save();
    await project.populate('owner', 'firstName lastName email');
    await project.populate('team.user', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add team member to project
exports.addTeamMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, role } = req.body;
    const userId = req.userId;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check authorization
    if (req.userRole !== 'admin' && project.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already a member
    const alreadyMember = project.team.some((t) => t.user.toString() === user._id.toString());
    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a team member',
      });
    }

    // Add member
    project.team.push({
      user: user._id,
      role: role || 'member',
    });

    await project.save();
    await project.populate('owner', 'firstName lastName email');
    await project.populate('team.user', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Team member added successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove team member
exports.removeTeamMember = async (req, res) => {
  try {
    const { projectId, userId: memberIdToRemove } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (req.userRole !== 'admin' && project.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    project.team = project.team.filter((t) => t.user.toString() !== memberIdToRemove);

    await project.save();
    await project.populate('owner', 'firstName lastName email');
    await project.populate('team.user', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Team member removed successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (req.userRole !== 'admin' && project.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await Project.findByIdAndDelete(projectId);

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
