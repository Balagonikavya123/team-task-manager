const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;

const validateEmail = (email) => {
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 chars, one uppercase, one lowercase, one number
  return password && password.length >= 6;
};

const validateProjectData = (data) => {
  const errors = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Project name is required';
  }

  if (data.name && data.name.length > 100) {
    errors.name = 'Project name cannot exceed 100 characters';
  }

  if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
    errors.date = 'End date must be after start date';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateTaskData = (data) => {
  const errors = {};

  if (!data.title || data.title.trim() === '') {
    errors.title = 'Task title is required';
  }

  if (data.title && data.title.length > 200) {
    errors.title = 'Task title cannot exceed 200 characters';
  }

  const validStatuses = ['todo', 'in-progress', 'review', 'completed', 'blocked'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.status = 'Invalid status';
  }

  const validPriorities = ['low', 'medium', 'high', 'critical'];
  if (data.priority && !validPriorities.includes(data.priority)) {
    errors.priority = 'Invalid priority';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateProjectData,
  validateTaskData,
};
