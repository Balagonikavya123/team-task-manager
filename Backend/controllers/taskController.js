const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { validateTaskData } = require('../utils/validators');

// Create task
exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedTo, priority, dueDate, estimatedHours, tags } = req.body;
    const userId = req.userId;

    // Validate
    const validation = validateTaskData({ title, priority });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    // Check project access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const hasAccess =
      project.owner.toString() === userId ||
      project.team.some((t) => t.user.toString() === userId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    // Create task
    const task = new Task({
      title,
      description,
      project: projectId,
      createdBy: userId,
      assignedTo: assignedTo || [],
      priority,
      dueDate,
      estimatedHours,
      tags,
    });

    await task.save();
    await task.populate('createdBy', 'firstName lastName email');
    await task.populate('assignedTo', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get tasks by project
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;
    const { status, priority, assignedTo } = req.query;

    // Check project access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const hasAccess =
      project.owner.toString() === userId ||
      project.team.some((t) => t.user.toString() === userId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    // Build filter
    let filter = { project: projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.userId;

    const task = await Task.findById(taskId)
      .populate('createdBy', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName email')
      .populate('project');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const project = await Project.findById(task.project._id);
    const hasAccess =
      req.userRole === 'admin' ||
      project.owner.toString() === userId ||
      project.team.some((t) => t.user.toString() === userId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.userId;
    const { title, description, status, priority, dueDate, estimatedHours, actualHours, tags } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check project access
    const project = await Project.findById(task.project);
    const hasProjectAccess =
      req.userRole === 'admin' ||
      project.owner.toString() === userId ||
      project.team.some((t) => t.user.toString() === userId);

    if (!hasProjectAccess) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    const isTaskOwner = task.createdBy.toString() === userId;
    const isAssignee = task.assignedTo.some((id) => id.toString() === userId);
    const isProjectAdmin = req.userRole === 'admin' || project.owner.toString() === userId;

    if (!isProjectAdmin && !isTaskOwner && !isAssignee) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized - you can only update your assigned tasks',
      });
    }

    // Update fields
    if (title && isProjectAdmin) task.title = title;
    if (description && isProjectAdmin) task.description = description;
    if (status) task.status = status;
    if (priority && isProjectAdmin) task.priority = priority;
    if (dueDate && isProjectAdmin) task.dueDate = dueDate;
    if (estimatedHours !== undefined && isProjectAdmin) task.estimatedHours = estimatedHours;
    if (actualHours !== undefined) task.actualHours = actualHours;
    if (tags && isProjectAdmin) task.tags = tags;

    await task.save();
    await task.populate('createdBy', 'firstName lastName email');
    await task.populate('assignedTo', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Assign task
exports.assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId: memberIdToAssign } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const project = await Project.findById(task.project);
    const canAssign = req.userRole === 'admin' || project.owner.toString() === req.userId;
    if (!canAssign) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const isProjectMember =
      project.owner.toString() === memberIdToAssign ||
      project.team.some((t) => t.user.toString() === memberIdToAssign);
    if (!isProjectMember) {
      return res.status(400).json({
        success: false,
        message: 'User is not part of this project',
      });
    }

    // Check if user is already assigned
    if (task.assignedTo.some((id) => id.toString() === memberIdToAssign)) {
      return res.status(400).json({
        success: false,
        message: 'User is already assigned to this task',
      });
    }

    task.assignedTo.push(memberIdToAssign);
    await task.save();
    await task.populate('createdBy', 'firstName lastName email');
    await task.populate('assignedTo', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Task assigned successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Unassign task
exports.unassignTask = async (req, res) => {
  try {
    const { taskId, userId: memberIdToUnassign } = req.params;

    const task = await Task.findById(taskId);
    const project = await Project.findById(task.project);
    const canUnassign = req.userRole === 'admin' || project.owner.toString() === req.userId;
    if (!canUnassign) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.assignedTo = task.assignedTo.filter((id) => id.toString() !== memberIdToUnassign);
    await task.save();
    await task.populate('createdBy', 'firstName lastName email');
    await task.populate('assignedTo', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Task unassigned successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add comment to task
exports.addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty',
      });
    }

    const task = await Task.findById(taskId);
    const project = await Project.findById(task.project);
    const hasAccess =
      req.userRole === 'admin' ||
      project.owner.toString() === userId ||
      project.team.some((t) => t.user.toString() === userId);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.comments.push({
      user: userId,
      text,
    });

    await task.save();
    await task.populate('createdBy', 'firstName lastName email');
    await task.populate('assignedTo', 'firstName lastName email');
    await task.populate('comments.user', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Comment added successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's overdue tasks
exports.getOverdueTasks = async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({
      assignedTo: userId,
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() },
    })
      .populate('createdBy', 'firstName lastName email')
      .populate('project')
      .sort({ dueDate: 1 });

    if (tasks.length > 0) {
      await Task.updateMany(
        { _id: { $in: tasks.map((task) => task._id) } },
        { $set: { isOverdue: true } }
      );
    }

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.userId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Only creator can delete
    if (task.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
