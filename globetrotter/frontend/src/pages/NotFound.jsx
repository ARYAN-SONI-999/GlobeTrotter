import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      className="page-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '48px 24px'
      }}
    >
      <span style={{ fontSize: '5rem', marginBottom: '16px' }}>🗺️</span>
      <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
        404 — Lost in Transit
      </h1>
      <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '420px', marginBottom: '28px' }}>
        Looks like this route doesn't exist on our map. Head back to the dashboard to plan your next adventure.
      </p>
      <Link
        to="/"
        className="btn btn-primary"
        style={{ borderRadius: '20px', padding: '10px 24px', fontWeight: 800, textDecoration: 'none' }}
      >
        ✈️ Back to Dashboard
      </Link>
    </div>
  );
}
