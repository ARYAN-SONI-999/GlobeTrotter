import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [userError, setUserError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setUserError(err.response?.data?.message || 'Could not load users.');
    }
  };

  useEffect(() => {
    if (!user?.isAdmin) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
        await loadUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load admin stats.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const startEdit = (u) => {
    setEditingId(u.id);
    setEditForm({ name: u.name, email: u.email });
    setUserError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', email: '' });
  };

  const saveEdit = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}`, { name: editForm.name, email: editForm.email });
      cancelEdit();
      loadUsers();
    } catch (err) {
      setUserError(err.response?.data?.message || 'Could not update user.');
    }
  };

  const toggleAdmin = async (u) => {
    try {
      await api.put(`/admin/users/${u.id}`, { isAdmin: !u.isAdmin });
      loadUsers();
    } catch (err) {
      setUserError(err.response?.data?.message || 'Could not update admin access.');
    }
  };

  const deleteUser = async (u) => {
    if (!window.confirm(`Delete ${u.name} (${u.email})? This removes their trips too.`)) return;
    try {
      await api.delete(`/admin/users/${u.id}`);
      loadUsers();
    } catch (err) {
      setUserError(err.response?.data?.message || 'Could not delete user.');
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="page-container">
        <h1>Admin Panel</h1>
        <p className="form-error">You don't have access to this page.</p>
      </div>
    );
  }

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading platform analytics...</p></div>;
  if (error) return <div className="page-container"><p className="form-error">{error}</p></div>;

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1>⚡ Admin & Analytics Console</h1>
          <p className="page-subtitle">Platform adoption, destination popularity, and traveler management.</p>
        </div>
      </div>

      <div className="dashboard-highlights">
        <div className="highlight-card">
          <div className="highlight-icon">👥</div>
          <div className="highlight-info">
            <span className="highlight-number">{stats.userCount}</span>
            <span className="highlight-label">Registered Travelers</span>
          </div>
        </div>
        <div className="highlight-card">
          <div className="highlight-icon">✈️</div>
          <div className="highlight-info">
            <span className="highlight-number">{stats.tripCount}</span>
            <span className="highlight-label">Total Itineraries</span>
          </div>
        </div>
        <div className="highlight-card">
          <div className="highlight-icon">🌐</div>
          <div className="highlight-info">
            <span className="highlight-number">{stats.publicTripCount}</span>
            <span className="highlight-label">Community Shared</span>
          </div>
        </div>
        <div className="highlight-card">
          <div className="highlight-icon">🎯</div>
          <div className="highlight-info">
            <span className="highlight-number">{stats.activityCount}</span>
            <span className="highlight-label">Planned Activities</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header-row">
          <div>
            <h2>Top Visited Destinations</h2>
            <p className="section-subtitle">Most frequently added cities across all itineraries</p>
          </div>
        </div>
        {stats.popularCities.length === 0 ? (
          <p className="empty-state-small">No trip stop data yet.</p>
        ) : (
          <div className="city-chip-list">
            {stats.popularCities.map((c) => (
              <div className="city-chip" key={c.name}>
                <span className="city-chip-icon">🏙️</span>
                <div className="city-chip-info">
                  <strong>{c.name}</strong>
                  <span>{c.country}</span>
                </div>
                <span className="city-chip-popularity">{c.count} trips</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <div className="section-header-row">
          <div>
            <h2>Top Planned Activities</h2>
            <p className="section-subtitle">Most popular things to do among travelers</p>
          </div>
        </div>
        {stats.popularActivities.length === 0 ? (
          <p className="empty-state-small">No activity data yet.</p>
        ) : (
          <div className="city-chip-list">
            {stats.popularActivities.map((a) => (
              <div className="city-chip" key={a.name}>
                <span className="city-chip-icon">🎪</span>
                <div className="city-chip-info">
                  <strong>{a.name}</strong>
                </div>
                <span className="city-chip-popularity">{a.count}× planned</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <div className="section-header-row">
          <div>
            <h2>User Account Management</h2>
            <p className="section-subtitle">Manage travelers, modify profile details, and control administrator roles</p>
          </div>
        </div>

        {userError && <p className="form-error">{userError}</p>}

        <div className="daily-budget-table-wrap">
          <div className="daily-budget-table" style={{ minWidth: '760px' }}>
            <div className="daily-budget-row daily-budget-row-head" style={{ gridTemplateColumns: '1.4fr 1.6fr 0.8fr 0.8fr 1.6fr' }}>
              <span>Name</span>
              <span>Email</span>
              <span>Trips</span>
              <span>Role</span>
              <span>Actions</span>
            </div>
            {users.map((u) => (
              <div className="daily-budget-row" key={u.id} style={{ gridTemplateColumns: '1.4fr 1.6fr 0.8fr 0.8fr 1.6fr' }}>
                {editingId === u.id ? (
                  <>
                    <input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} style={{ padding: '6px 8px', fontSize: '0.85rem' }} />
                    <input value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} style={{ padding: '6px 8px', fontSize: '0.85rem' }} />
                    <span>{u.tripCount}</span>
                    <span>{u.isAdmin ? 'Admin' : 'User'}</span>
                    <span style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-small btn-primary" onClick={() => saveEdit(u.id)}>Save</button>
                      <button className="btn btn-small btn-outline" onClick={cancelEdit}>Cancel</button>
                    </span>
                  </>
                ) : (
                  <>
                    <strong>{u.name}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{u.email}</span>
                    <span>{u.tripCount}</span>
                    <span>
                      {u.isAdmin ? <span className="badge badge-public">Admin</span> : <span className="badge badge-private">User</span>}
                    </span>
                    <span style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-small btn-outline" onClick={() => startEdit(u)}>Edit</button>
                      <button className="btn btn-small btn-outline" onClick={() => toggleAdmin(u)} disabled={u.id === user.id}>
                        {u.isAdmin ? 'Revoke' : 'Make Admin'}
                      </button>
                      <button className="btn btn-small btn-danger" onClick={() => deleteUser(u)} disabled={u.id === user.id}>Delete</button>
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
