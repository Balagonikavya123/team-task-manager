import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { projectAPI } from '../../services/api';
import './Projects.css';

const Projects = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await projectAPI.getAllProjects();
      setProjects(response.data.projects);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await projectAPI.createProject(formData);
      setFormData({ name: '', description: '', priority: 'medium' });
      setShowForm(false);
      await fetchProjects();
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.deleteProject(projectId);
        await fetchProjects();
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="projects-page">
        <nav className="navbar">
          <div className="navbar-content">
            <h1>Team Task Manager</h1>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </nav>
        <div className="loading">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Team Task Manager</h1>
          <div className="user-section">
            <span>Welcome, {user?.firstName}!</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="projects-container">
        <div className="sidebar">
          <ul className="nav-menu">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/teams">Teams</Link></li>
            <li><Link to="/tasks">Tasks</Link></li>
          </ul>
        </div>
        <div className="main-content">
        <div className="projects-header">
          <h2>Projects</h2>
          <button
            className="create-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="project-form">
            <h3>Create New Project</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Project Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter project name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter project description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button type="submit" className="submit-btn">
                Create Project
              </button>
            </form>
          </div>
        )}

        <div className="projects-grid">
          {projects.length === 0 ? (
            <p className="no-data">No projects yet. Create your first project!</p>
          ) : (
            projects.map((project) => (
              <div key={project._id} className="project-card">
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <span className={`priority-badge priority-${project.priority}`}>
                    {project.priority}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-meta">
                  <span className="status-badge">{project.status}</span>
                  <span className="team-count">Team: {project.team.length}</span>
                </div>
                <div className="project-actions">
                  <button className="btn-primary">View Details</button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </button>
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

export default Projects;
