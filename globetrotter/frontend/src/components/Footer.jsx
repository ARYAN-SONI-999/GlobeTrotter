import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div className="footer-brand">
          <span style={{ fontSize: '1.5rem' }}>🌍</span>
          <strong>GlobeTrotter</strong>
          <span className="footer-tagline">Smart AI Travel Planning</span>
        </div>

        <nav className="footer-nav-groups">
          <div className="footer-nav-group">
            <h4>Explore</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/planner">AI Planner</Link>
            <Link to="/places">Places</Link>
            <Link to="/activities">Activities</Link>
            <Link to="/community">Community</Link>
          </div>
          <div className="footer-nav-group">
            <h4>My Travel</h4>
            <Link to="/trips">My Trips</Link>
            <Link to="/trips/new">Create Trip</Link>
            <Link to="/city-search">City Search</Link>
            <Link to="/profile">Profile</Link>
          </div>
          <div className="footer-nav-group">
            <h4>Info &amp; Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </nav>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} GlobeTrotter — Made with ❤️ for travelers everywhere.
          </p>
          <div className="footer-badges">
            <span className="footer-badge">🇮🇳 India</span>
            <span className="footer-badge">🔒 Secure</span>
            <span className="footer-badge">⚡ Fast</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
