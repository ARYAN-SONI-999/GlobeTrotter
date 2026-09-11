import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import TripCard from '../components/TripCard';

function tripStatus(trip) {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (now < start) return 'Upcoming';
  if (now > end) return 'Completed';
  return 'Ongoing';
}

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groupBy, setGroupBy] = useState('status');

  const loadTrips = async () => {
    setLoading(true);
    try {
      const res = await api.get('/trips');
      setTrips(res.data);
    } catch (err) {
      setError('Could not load trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleDelete = async (tripId) => {
    if (!window.confirm('Delete this trip? This cannot be undone.')) return;
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete trip.');
    }
  };

  const grouped = useMemo(() => {
    if (groupBy !== 'status') return null;
    const order = ['Ongoing', 'Upcoming', 'Completed'];
    const groups = { Ongoing: [], Upcoming: [], Completed: [] };
    trips.forEach((trip) => groups[tripStatus(trip)].push(trip));
    return order.map((label) => ({ label, items: groups[label] })).filter((g) => g.items.length > 0);
  }, [trips, groupBy]);

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading your trips...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1>My Trips ({trips.length})</h1>
          <p className="page-subtitle">Manage, view, and build your itineraries.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/planner" className="btn btn-hero-primary">⚡ AI Auto-Planner</Link>
          <Link to="/trips/new" className="btn btn-primary">+ New Trip</Link>
        </div>
      </div>

      {/* Highlights Bar */}
      {trips.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Total Estimated Budget</span>
            <strong style={{ fontSize: '18px', color: '#16a34a' }}>
              ₹{trips.reduce((sum, t) => sum + (t.budget || 0), 0).toLocaleString()}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Upcoming Adventures</span>
            <strong style={{ fontSize: '18px', color: '#2563eb' }}>
              {trips.filter(t => new Date(t.endDate) >= new Date()).length} Trips
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Shared Public Itineraries</span>
            <strong style={{ fontSize: '18px', color: '#7c3aed' }}>
              {trips.filter(t => t.isPublic).length} Trips
            </strong>
          </div>
        </div>
      )}

      {trips.length > 0 && (
        <div className="search-controls">
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="status">Group by: Status</option>
            <option value="none">Group by: None</option>
          </select>
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      {trips.length === 0 ? (
        <div className="empty-state-card">
          <span className="empty-state-icon">🧳</span>
          <h3>No trips found</h3>
          <p>You haven't created any trips yet. Start planning now!</p>
          <Link to="/trips/new" className="btn btn-primary" style={{ marginTop: '14px' }}>+ Create First Trip</Link>
        </div>
      ) : groupBy === 'status' ? (
        grouped.map((group) => (
          <section key={group.label} className="builder-section">
            <h2>{group.label} <span className="page-subtitle" style={{ display: 'inline', fontSize: '0.9rem' }}>({group.items.length})</span></h2>
            <div className="trip-grid">
              {group.items.map((trip) => (
                <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="trip-grid">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
