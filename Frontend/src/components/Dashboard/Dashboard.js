import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { taskAPI, teamAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch dashboard stats and overdue tasks
        const [statsResponse, tasksResponse] = await Promise.all([
          teamAPI.getDashboardStats(),
          taskAPI.getOverdueTasks(),
        ]);

        setStats(statsResponse.data.stats);
        setOverdueTasks(tasksResponse.data.tasks);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <nav className="navbar">
          <div className="navbar-content">
            <h1>Team Task Manager</h1>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </nav>
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
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

      <div className="dashboard-container">
        <div className="sidebar">
          <ul className="nav-menu">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/teams">Teams</Link></li>
            <li><Link to="/tasks">Tasks</Link></li>
          </ul>
        </div>

        <div className="main-content">
          <h2>Welcome back, {user?.firstName}!</h2>

          {error && <div className="error-message">{error}</div>}

          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.totalTasks}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#28a745' }}>
                  {stats.completedTasks}
                </div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#ffc107' }}>
                  {stats.inProgressTasks}
                </div>
                <div className="stat-label">In Progress</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ color: '#dc3545' }}>
                  {stats.overdueTasks}
                </div>
                <div className="stat-label">Overdue</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalProjects}</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalTeams}</div>
                <div className="stat-label">Teams</div>
              </div>
            </div>
          )}

          <div className="overdue-section">
            <h3>Overdue Tasks</h3>
            {overdueTasks.length === 0 ? (
              <p className="no-data">No overdue tasks!</p>
            ) : (
              <div className="task-list">
                {overdueTasks.map((task) => (
                  <div key={task._id} className="task-item">
                    <div className="task-header">
                      <h4>{task.title}</h4>
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="task-description">{task.description}</p>
                    <div className="task-meta">
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span className="status-badge">{task.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
