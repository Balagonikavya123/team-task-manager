import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teamAPI } from '../../services/api';
import './Teams.css';

const Teams = () => {
  const { user, logout } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await teamAPI.getAllTeams();
      setTeams(response.data.teams);
    } catch (err) {
      setError('Failed to load teams');
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
      await teamAPI.createTeam(formData);
      setFormData({ name: '', description: '' });
      setShowForm(false);
      await fetchTeams();
    } catch (err) {
      setError('Failed to create team');
      console.error(err);
    }
  };

  const handleDelete = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamAPI.deleteTeam(teamId);
        await fetchTeams();
      } catch (err) {
        setError('Failed to delete team');
      }
    }
  };

  if (loading) {
    return (
      <div className="teams-page">
        <nav className="navbar">
          <div className="navbar-content">
            <h1>Team Task Manager</h1>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </nav>
        <div className="loading">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="teams-page">
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

      <div className="teams-container">
        <div className="sidebar">
          <ul className="nav-menu">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/teams">Teams</Link></li>
            <li><Link to="/tasks">Tasks</Link></li>
          </ul>
        </div>
        <div className="main-content">
        <div className="teams-header">
          <h2>Teams</h2>
          <button
            className="create-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ New Team'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="team-form">
            <h3>Create New Team</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Team Name *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter team name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter team description"
                  rows="4"
                />
              </div>

              <button type="submit" className="submit-btn">
                Create Team
              </button>
            </form>
          </div>
        )}

        <div className="teams-grid">
          {teams.length === 0 ? (
            <p className="no-data">No teams yet. Create your first team!</p>
          ) : (
            teams.map((team) => (
              <div key={team._id} className="team-card">
                <div className="team-header">
                  <h3>{team.name}</h3>
                </div>
                <p className="team-description">{team.description}</p>
                <div className="team-meta">
                  <span className="member-count">Members: {team.members.length}</span>
                  <span className="project-count">Projects: {team.projects.length}</span>
                </div>
                <div className="team-members">
                  <strong>Team Lead:</strong>
                  <div className="member-item">
                    {team.owner.firstName} {team.owner.lastName}
                  </div>
                </div>
                <div className="team-actions">
                  <button className="btn-primary">Manage</button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(team._id)}
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

export default Teams;
