import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [cityList, setCityList] = useState([]);
  const [externalResults, setExternalResults] = useState([]);
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const searchRef = useRef(null);
  const [bellDismissed, setBellDismissed] = useState(() => localStorage.getItem('gt_bell_dismissed') === 'true');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    api.get('/cities').then(res => setCityList(res.data || [])).catch(() => {});
  }, []);

  // Debounced live geocoding search for worldwide destinations
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setExternalResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/external/geocode?q=${encodeURIComponent(searchQuery.trim())}`);
        if (Array.isArray(res.data)) {
          setExternalResults(res.data.slice(0, 4));
        }
      } catch (err) {
        // graceful ignore
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDrop(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      // Focus search on '/' key press unless already in an input
      if (e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        document.getElementById('navbar-search')?.focus();
      }
      // Close on Escape
      if (e.key === 'Escape') setShowSearchDrop(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const localMatches = searchQuery.length >= 2
    ? cityList.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.region || '').toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  // Combine local matches + live geocoding results (deduplicating by name)
  const searchResults = [
    ...localMatches,
    ...externalResults.filter(ext => !localMatches.some(loc => loc.name.toLowerCase() === ext.name.toLowerCase()))
  ].slice(0, 6);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const initials = (user.name || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="navbar-container">
      <nav className="navbar">
        <Link to="/dashboard" className="navbar-brand">
          <span className="navbar-brand-icon">🌍</span>
          <span className="navbar-brand-text">{t('brand')}</span>
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
            {t('dashboard')}
          </Link>
          <Link to="/planner" className={`nav-link planner-nav-highlight ${isActive('/planner') ? 'active' : ''}`}>
            {t('aiPlanner')}
          </Link>
          <Link to="/places" className={`nav-link ${isActive('/places') ? 'active' : ''}`}>
            {t('placesToVisit')}
          </Link>
          <Link to="/trips" className={`nav-link ${isActive('/trips') && !isActive('/trips/new') ? 'active' : ''}`}>
            {t('myTrips')}
          </Link>
          <Link to="/activities" className={`nav-link ${isActive('/activities') ? 'active' : ''}`}>
            {t('activities')}
          </Link>
          <Link to="/community" className={`nav-link ${isActive('/community') ? 'active' : ''}`}>
            {t('community')}
          </Link>
          {user.isAdmin && (
            <Link to="/admin" className={`nav-link admin-nav-link ${isActive('/admin') ? 'active' : ''}`}>
              ⚡ Admin
            </Link>
          )}
        </div>

        {/* Mobile Search Toggle Button */}
        <button
          className="mobile-search-toggle"
          onClick={() => setMobileSearchOpen(prev => !prev)}
          title="Search destinations"
          aria-label="Toggle Search"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.1rem',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'none'
          }}
        >
          🔍
        </button>

        <div
          className={`navbar-search-wrap ${mobileSearchOpen ? 'mobile-search-open' : ''}`}
          style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          ref={searchRef}
        >
          <input
            id="navbar-search"
            type="text"
            placeholder="🔍 Search destinations... (/)"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSearchDrop(true); }}
            onFocus={() => setShowSearchDrop(true)}
            className="navbar-search-input"
            style={{
              padding: '7px 14px',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem',
              width: '210px',
              outline: 'none',
              background: '#f8fafc',
              transition: 'all 0.2s ease'
            }}
          />
          {showSearchDrop && searchResults.length > 0 && (
            <div
              className="navbar-search-dropdown"
              style={{
                position: 'absolute', top: '40px', left: 0, width: '280px',
                background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0',
                boxShadow: '0 12px 30px rgba(0,0,0,0.14)', zIndex: 9999, overflow: 'hidden'
              }}
            >
              {searchResults.map(city => (
                <div
                  key={city.id || city.name}
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDrop(false);
                    setMobileSearchOpen(false);
                    // Navigate to planner with destination pre-filled
                    navigate(`/planner?dest=${encodeURIComponent(city.name)}`);
                  }}
                  style={{
                    padding: '10px 14px', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9',
                    fontSize: '0.85rem', color: '#0f172a'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <span>📍</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{city.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{city.region || city.country}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>⚡ Plan →</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => { setBellDismissed(true); localStorage.setItem('gt_bell_dismissed', 'true'); }}
            title="What's new in GlobeTrotter"
            style={{
              position: 'relative', background: 'transparent', border: 'none',
              cursor: 'pointer', fontSize: '1.2rem', padding: '4px', lineHeight: 1
            }}
          >
            🔔
            {!bellDismissed && (
              <span style={{
                position: 'absolute', top: '-2px', right: '-2px',
                background: '#ef4444', color: 'white', fontSize: '9px',
                fontWeight: 800, padding: '1px 4px', borderRadius: '8px', lineHeight: 1.2
              }}>New</span>
            )}
          </button>

          {/* Language Selector */}
          <select
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              background: 'white',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#334155'
            }}
            onChange={(e) => setLang(e.target.value)}
            value={lang}
          >
            <option value="en">🌐 EN</option>
            <option value="hi">🇮🇳 हिंदी</option>
            <option value="gu">🪔 ગુજરાતી</option>
          </select>

          <Link to="/trips/new" className="btn btn-primary btn-nav-cta">
            <span>{t('planNewTrip')}</span>
          </Link>

          <Link to="/profile" className="nav-profile-pill" title="View Profile">
            {user.photoUrl ? (
              <img src={user.photoUrl} alt="Avatar" className="nav-avatar-img" />
            ) : (
              <div className="nav-avatar-fallback">{initials}</div>
            )}
            <span className="nav-profile-name">{user.name?.split(' ')[0]}</span>
          </Link>

          <button className="navbar-logout-btn" onClick={handleLogout} title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar for Small Mobile Screens */}
      <div className="mobile-bottom-nav">
        <Link to="/dashboard" className={`mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
          <span className="mobile-nav-icon">🏠</span>
          <span className="mobile-nav-label">Home</span>
        </Link>
        <Link to="/planner" className={`mobile-nav-item ${isActive('/planner') ? 'active' : ''}`}>
          <span className="mobile-nav-icon">⚡</span>
          <span className="mobile-nav-label">Planner</span>
        </Link>
        <Link to="/places" className={`mobile-nav-item ${isActive('/places') ? 'active' : ''}`}>
          <span className="mobile-nav-icon">📍</span>
          <span className="mobile-nav-label">Places</span>
        </Link>
        <Link to="/activities" className={`mobile-nav-item ${isActive('/activities') ? 'active' : ''}`}>
          <span className="mobile-nav-icon">🎯</span>
          <span className="mobile-nav-label">Activities</span>
        </Link>
        <Link to="/trips" className={`mobile-nav-item ${isActive('/trips') && !isActive('/trips/new') ? 'active' : ''}`}>
          <span className="mobile-nav-icon">🧳</span>
          <span className="mobile-nav-label">Trips</span>
        </Link>
        <Link to="/community" className={`mobile-nav-item ${isActive('/community') ? 'active' : ''}`}>
          <span className="mobile-nav-icon">🌐</span>
          <span className="mobile-nav-label">Social</span>
        </Link>
      </div>
    </header>
  );
}
