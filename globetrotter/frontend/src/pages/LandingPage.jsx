import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const FEATURES = [
  { icon: '⚡', title: 'AI Auto-Planner', desc: 'Generate complete day-by-day itineraries instantly — just pick a destination, dates, and budget. Our intelligent planner handles the rest.', color: '#eff6ff', border: '#bfdbfe', accent: '#2563eb' },
  { icon: '📍', title: '500+ Curated Places', desc: 'Discover hand-picked attractions, hidden gems, restaurants, and experiences across 30+ Indian cities and international destinations.', color: '#ecfdf5', border: '#a7f3d0', accent: '#059669' },
  { icon: '🌐', title: 'Travel Community', desc: 'Share your itineraries publicly, discover trips from fellow travelers, and get inspired by real travel stories from around the world.', color: '#f5f3ff', border: '#ddd6fe', accent: '#7c3aed' },
  { icon: '💰', title: 'Smart Budget Tracker', desc: 'Track expenses, split bills with travel companions, and visualize your budget with real-time charts and currency conversion.', color: '#fffbeb', border: '#fde68a', accent: '#d97706' },
  { icon: '🗺️', title: 'Interactive Maps', desc: 'Plot your journey on an interactive Leaflet map. View driving routes, transit options, and nearby attractions at a glance.', color: '#fef2f2', border: '#fecaca', accent: '#dc2626' },
  { icon: '🎒', title: 'Packing & Safety', desc: 'Smart packing checklists, outfit recommender by climate, emergency contact cards, and offline-ready safety guides for every trip.', color: '#f0fdf4', border: '#bbf7d0', accent: '#16a34a' },
];

const DESTINATIONS = [
  { name: 'Goa', tag: '🏖️ Beach', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80' },
  { name: 'Manali', tag: '🏔️ Mountains', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80' },
  { name: 'Jaipur', tag: '🏰 Heritage', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80' },
  { name: 'Matheran', tag: '🌿 Hill Station', img: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&q=80' },
  { name: 'Varanasi', tag: '🕌 Spiritual', img: 'https://images.unsplash.com/photo-1561361058-c24e01c57832?w=600&q=80' },
  { name: 'Lonavala', tag: '⛰️ Monsoon', img: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=600&q=80' },
];

const STATS = [
  { num: '30+', label: 'Destinations' },
  { num: '500+', label: 'Curated Places' },
  { num: '∞', label: 'Trip Plans' },
  { num: '3', label: 'Languages' },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading GlobeTrotter...</p>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-brand">
            <span className="landing-brand-icon">🌍</span>
            <span>GlobeTrotter</span>
          </Link>
          <div className="landing-nav-actions">
            <Link to="/login" className="landing-nav-link">Log in</Link>
            <Link to="/signup" className="btn btn-primary landing-cta-btn">Sign up free →</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-hero-badge">
            <span>✈️</span>
            <span>AI-Powered Smart Travel Planning Platform</span>
          </div>
          <h1 className="landing-hero-title">
            Plan Your Dream Trip<br />
            <span className="landing-hero-gradient">in Seconds, Not Hours</span>
          </h1>
          <p className="landing-hero-sub">
            GlobeTrotter’s AI Auto-Planner builds complete, personalized itineraries with activities,
            hotels, transit, and budget — everything — for any destination, instantly.
          </p>
          <div className="landing-hero-actions">
            <Link to="/signup" className="btn landing-btn-hero-primary">🚀 Start Planning Free</Link>
            <Link to="/login" className="btn landing-btn-hero-secondary">Log in to Dashboard →</Link>
          </div>
          <div className="landing-stats-row">
            {STATS.map((s) => (
              <div key={s.label} className="landing-stat-item">
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="landing-hero-globe" aria-hidden="true">🌍</div>
      </section>

      {/* Destinations Grid */}
      <section className="landing-destinations-section">
        <div className="landing-section-header">
          <h2>Explore Iconic Destinations</h2>
          <p>From misty hill stations to vibrant temple cities — plan your next adventure</p>
        </div>
        <div className="landing-dest-grid">
          {DESTINATIONS.map((d) => (
            <Link to="/signup" key={d.name} className="landing-dest-card">
              <div className="landing-dest-img-wrap">
                <img src={d.img} alt={d.name} className="landing-dest-img" loading="lazy" />
                <div className="landing-dest-overlay">
                  <span className="landing-dest-tag">{d.tag}</span>
                  <strong className="landing-dest-name">{d.name}</strong>
                  <span className="landing-dest-cta">Plan Trip →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="landing-features-section">
        <div className="landing-section-header">
          <h2>Everything You Need to Travel Smart</h2>
          <p>One platform, all the tools — plan, track, share, and discover</p>
        </div>
        <div className="landing-features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="landing-feature-card" style={{ background: f.color, borderColor: f.border }}>
              <div className="landing-feature-icon" style={{ color: f.accent }}>{f.icon}</div>
              <h3 style={{ color: f.accent }}>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-how-section">
        <div className="landing-section-header">
          <h2>Plan a Trip in 3 Steps</h2>
          <p>No stress. No confusion. Just travel.</p>
        </div>
        <div className="landing-steps-row">
          <div className="landing-step">
            <div className="landing-step-num">1</div>
            <h3>Pick a Destination</h3>
            <p>Search from 30+ curated Indian cities or any global destination via live geocoding.</p>
          </div>
          <div className="landing-step-arrow">→</div>
          <div className="landing-step">
            <div className="landing-step-num">2</div>
            <h3>Set Dates &amp; Budget</h3>
            <p>Choose your travel dates, group size, travel style, and maximum budget.</p>
          </div>
          <div className="landing-step-arrow">→</div>
          <div className="landing-step">
            <div className="landing-step-num">3</div>
            <h3>Get Your Itinerary</h3>
            <p>AI generates a complete day-by-day plan — save it, share it, or customize it.</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="landing-cta-section">
        <div className="landing-cta-inner">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of travelers who plan smarter with GlobeTrotter</p>
          <div className="landing-cta-actions">
            <Link to="/signup" className="btn landing-btn-hero-primary">🌍 Create Free Account</Link>
            <Link to="/login" className="landing-cta-link">Already a member? Log in →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <div className="app-footer-inner">
          <div className="footer-brand">
            <span>🌍</span>
            <strong>GlobeTrotter</strong>
          </div>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} GlobeTrotter. Made with ❤️ for travelers everywhere.
          </div>
        </div>
      </footer>
    </div>
  );
}
