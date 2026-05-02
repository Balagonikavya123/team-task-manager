const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide task title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'completed', 'blocked'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    dueDate: Date,
    estimatedHours: Number,
    actualHours: Number,
    tags: [String],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: [String], // URLs
    isOverdue: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for quick queries
taskSchema.index({ project: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });

// Middleware to check if task is overdue
taskSchema.pre('save', function (next) {
  if (this.dueDate && new Date() > this.dueDate && this.status !== 'completed') {
    this.isOverdue = true;
  } else {
    this.isOverdue = false;
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
