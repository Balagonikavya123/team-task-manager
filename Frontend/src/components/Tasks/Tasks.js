import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { projectAPI, taskAPI } from '../../services/api';
import './Tasks.css';

const Tasks = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
  });

  const selectedProject = useMemo(
    () => projects.find((project) => project._id === selectedProjectId),
    [projects, selectedProjectId]
  );

  const selectedProjectAssignees = useMemo(() => {
    if (!selectedProject) {
      return [];
    }

    const users = [];
    const seen = new Set();

    if (selectedProject.owner?._id) {
      users.push(selectedProject.owner);
      seen.add(selectedProject.owner._id);
    }

    selectedProject.team.forEach((member) => {
      if (member?.user?._id && !seen.has(member.user._id)) {
        users.push(member.user);
        seen.add(member.user._id);
      }
    });

    return users;
  }, [selectedProject]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await projectAPI.getAllProjects();
        const projectList = response.data.projects || [];
        setProjects(projectList);
        if (projectList.length > 0) {
          setSelectedProjectId(projectList[0]._id);
        }
      } catch (err) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedProjectId) {
        setTasks([]);
        return;
      }

      try {
        const response = await taskAPI.getTasksByProject(selectedProjectId);
        setTasks(response.data.tasks || []);
      } catch (err) {
        setError('Failed to load tasks');
      }
    };

    fetchTasks();
  }, [selectedProjectId]);

  const onTaskFormChange = (event) => {
    const { name, value } = event.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    if (!selectedProjectId) {
      setError('Please select a project');
      return;
    }

    try {
      setError('');
      const payload = {
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || undefined,
        assignedTo: taskForm.assignedTo ? [taskForm.assignedTo] : [],
      };

      await taskAPI.createTask(selectedProjectId, payload);
      setTaskForm({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: '',
      });
      const response = await taskAPI.getTasksByProject(selectedProjectId);
      setTasks(response.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskAPI.updateTask(taskId, { status });
      setTasks((prev) => prev.map((task) => (task._id === taskId ? { ...task, status } : task)));
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const handleAssign = async (taskId, userId) => {
    if (!userId) {
      return;
    }

    try {
      await taskAPI.assignTask(taskId, { userId });
      const response = await taskAPI.getTasksByProject(selectedProjectId);
      setTasks(response.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign task');
    }
  };

  if (loading) {
    return <div className="tasks-page"><div className="loading">Loading tasks...</div></div>;
  }

  return (
    <div className="tasks-page">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Team Task Manager</h1>
          <div className="user-section">
            <span>{user?.firstName} ({user?.role})</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      <div className="tasks-container">
        <div className="sidebar">
          <ul className="nav-menu">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/teams">Teams</Link></li>
            <li><Link to="/tasks">Tasks</Link></li>
          </ul>
        </div>

        <div className="main-content">
          <div className="tasks-header">
            <h2>Tasks</h2>
            <select
              value={selectedProjectId}
              onChange={(event) => setSelectedProjectId(event.target.value)}
              className="project-select"
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          {selectedProjectId && (
            <form className="task-form" onSubmit={handleCreateTask}>
              <h3>Create Task</h3>
              <input
                type="text"
                name="title"
                value={taskForm.title}
                onChange={onTaskFormChange}
                placeholder="Task title"
                required
              />
              <textarea
                name="description"
                value={taskForm.description}
                onChange={onTaskFormChange}
                placeholder="Task description"
                rows="3"
              />
              <div className="task-form-row">
                <select name="priority" value={taskForm.priority} onChange={onTaskFormChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <input type="date" name="dueDate" value={taskForm.dueDate} onChange={onTaskFormChange} />
                <select name="assignedTo" value={taskForm.assignedTo} onChange={onTaskFormChange}>
                  <option value="">Assign to</option>
                  {selectedProjectAssignees.map((projectUser) => (
                    <option key={projectUser._id} value={projectUser._id}>
                      {projectUser.firstName} {projectUser.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="submit-btn">Create Task</button>
            </form>
          )}

          <div className="task-list">
            {tasks.length === 0 ? (
              <p className="no-data">No tasks for this project yet.</p>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className="task-item">
                  <div className="task-item-header">
                    <h4>{task.title}</h4>
                    <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                  </div>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                    <span>Assignees: {task.assignedTo.map((a) => `${a.firstName} ${a.lastName}`).join(', ') || 'None'}</span>
                  </div>
                  <div className="task-actions">
                    <select value={task.status} onChange={(event) => handleStatusChange(task._id, event.target.value)}>
                      <option value="todo">todo</option>
                      <option value="in-progress">in-progress</option>
                      <option value="review">review</option>
                      <option value="completed">completed</option>
                      <option value="blocked">blocked</option>
                    </select>
                    {user?.role === 'admin' && (
                      <select defaultValue="" onChange={(event) => handleAssign(task._id, event.target.value)}>
                        <option value="">Assign member</option>
                        {selectedProjectAssignees.map((projectUser) => (
                          <option key={projectUser._id} value={projectUser._id}>
                            {projectUser.firstName} {projectUser.lastName}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
