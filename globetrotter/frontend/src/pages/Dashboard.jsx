import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import TravelQuizModal from '../components/TravelQuizModal';
import TravelReelsModal from '../components/TravelReelsModal';
import TourBookingModal from '../components/TourBookingModal';
import LocalGuidesWidget from '../components/LocalGuidesWidget';
import LiveTransitTicker from '../components/LiveTransitTicker';
import UploadReelModal from '../components/UploadReelModal';
import WeatherWidget from '../components/WeatherWidget';
import CurrencyConverterWidget from '../components/CurrencyConverterWidget';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showReelModal, setShowReelModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [tripsRes, citiesRes, savedRes] = await Promise.all([
          api.get('/trips').catch(() => ({ data: [] })),
          api.get('/cities?sortBy=popularity').catch(() => ({ data: [] })),
          api.get('/saved').catch(() => ({ data: [] }))
        ]);
        setTrips(Array.isArray(tripsRes.data) ? tripsRes.data : []);
        const rawCities = Array.isArray(citiesRes.data) ? citiesRes.data : [];
        setCities(rawCities.slice(0, 8));
        setSavedCount(Array.isArray(savedRes.data) ? savedRes.data.length : 0);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const now = new Date();
  const upcoming = trips.filter((tr) => new Date(tr.endDate) >= now).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const nextTrip = upcoming.length > 0 ? upcoming[0] : null;
  const sharedCount = trips.filter((tr) => tr.isPublic).length;

  // Compute trip streak: consecutive months in which at least 1 trip was created
  const tripStreak = (() => {
    if (trips.length === 0) return 0;
    const monthsWithTrips = new Set(
      trips.map(tr => {
        const d = new Date(tr.createdAt || tr.startDate);
        return `${d.getFullYear()}-${d.getMonth()}`;
      })
    );
    let streak = 0;
    const now = new Date();
    let y = now.getFullYear(), m = now.getMonth();
    while (monthsWithTrips.has(`${y}-${m}`)) {
      streak++;
      m--; if (m < 0) { m = 11; y--; }
    }
    return streak;
  })();

  const totalBudgetINR = trips.reduce((sum, tr) => sum + (Number(tr.budget) || 0), 0);

  // Traveler Gamification Computations
  const totalTripDays = trips.reduce((acc, tr) => {
    const s = new Date(tr.startDate);
    const e = new Date(tr.endDate);
    const days = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
    return acc + (isNaN(days) ? 1 : days);
  }, 0);

  const travelerScore = trips.length * 150 + totalTripDays * 40 + sharedCount * 100;
  let rankTitle = '🐣 Novice Explorer';
  let nextRankTitle = '🥉 Bronze Adventurer';
  let progressPercent = 30;

  if (travelerScore >= 1000) {
    rankTitle = '👑 Master GlobeTrotter';
    nextRankTitle = '🌟 Legendary Nomad';
    progressPercent = 95;
  } else if (travelerScore >= 600) {
    rankTitle = '🥇 Gold Voyager';
    nextRankTitle = '👑 Master GlobeTrotter';
    progressPercent = Math.min(90, Math.floor(((travelerScore - 600) / 400) * 100));
  } else if (travelerScore >= 300) {
    rankTitle = '🥈 Silver Pathfinder';
    nextRankTitle = '🥇 Gold Voyager';
    progressPercent = Math.min(90, Math.floor(((travelerScore - 300) / 300) * 100));
  } else if (travelerScore >= 100) {
    rankTitle = '🥉 Bronze Adventurer';
    nextRankTitle = '🥈 Silver Pathfinder';
    progressPercent = Math.min(90, Math.floor(((travelerScore - 100) / 200) * 100));
  }

  // Next trip countdown calculation
  const getDaysUntilNextTrip = () => {
    if (!nextTrip) return null;
    const diffMs = new Date(nextTrip.startDate) - now;
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Ongoing Now!';
    if (days === 0) return 'Starts Today!';
    return `In ${days} day${days > 1 ? 's' : ''}`;
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Preparing your travel dashboard...</p></div>;

  return (
    <div className="page-container dashboard-advanced-page">
      {/* Hero Banner Header */}
      <div className="dashboard-hero" style={{ borderRadius: '24px', padding: '36px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0284c7 100%)', color: 'white', marginBottom: '24px', boxShadow: '0 20px 40px rgba(15,23,42,0.18)' }}>
        <div className="hero-content">
          <div className="hero-badge" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            ✈️ {t('travelHq')} · AI Intelligent Command Center
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 10px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {t('welcome')}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.05rem', color: 'rgba(241, 245, 249, 0.95)', margin: '0 0 20px', maxWidth: '640px' }}>
            Track your trips, monitor live transit rates, unlock AI travel recommendations, and share your adventures with fellow globetrotters.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/planner" className="btn" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', fontWeight: 800, padding: '10px 20px', borderRadius: '30px', textDecoration: 'none', border: 'none', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)' }}>
              ⚡ {t('aiAutoPlannerBtn')}
            </Link>
            <button
              type="button"
              className="btn"
              onClick={() => setShowReelModal(true)}
              style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white', fontWeight: 800, padding: '10px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(236, 72, 153, 0.3)' }}
            >
              🎬 Watch Reels
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setShowUploadModal(true)}
              style={{ background: '#0284c7', color: 'white', fontWeight: 800, padding: '10px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer' }}
            >
              📹 Upload Reel
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setShowBookingModal(true)}
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: 800, padding: '10px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer' }}
            >
              🎟️ Book Tour
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setShowQuizModal(true)}
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 800, padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
            >
              🎯 {t('travelVibeQuizBtn')}
            </button>
          </div>
        </div>
      </div>

      {/* Live Flight & Train Fare Ticker Bar */}
      <LiveTransitTicker />

      {error && <p className="form-error">{error}</p>}

      {/* Advanced Dashboard Widgets Grid */}
      <div className="dashboard-command-grid">
        
        {/* 🏆 Traveler Gamification & Rank Card */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '22px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>🏆 Traveler Level &amp; Badges</span>
              <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '16px', fontWeight: 800, fontSize: '0.8rem' }}>{travelerScore} XP Points</span>
            </div>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{rankTitle}</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 16px' }}>{totalTripDays} total travel days recorded across {trips.length} itineraries.</p>
            
            {/* Progress Bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                <span>Next Tier: {nextRankTitle}</span>
                <span>{progressPercent}%</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #2563eb)', borderRadius: '10px', transition: 'width 0.5s ease' }}></div>
              </div>
            </div>
          </div>

          {/* Badges Row */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #fde68a' }}>🇮🇳 India Scout</span>
            <span style={{ background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #a7f3d0' }}>🏰 Heritage Hunter</span>
            <span style={{ background: '#fdf2f8', color: '#be185d', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #fbcfe8' }}>⚡ AI Planner Pro</span>
          </div>
        </div>

        {/* 🗺️ Saved vs Visited Exploration Radar Card */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '22px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>🗺️ Exploration Radar</span>
              <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 12px', borderRadius: '16px', fontWeight: 800, fontSize: '0.8rem' }}>{trips.length + savedCount} Total</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '8px 0' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
                {(() => {
                  const total = Math.max(trips.length + savedCount, 1);
                  const visitedDash = (trips.length / total) * 251;
                  const savedDash = (savedCount / total) * 251;
                  return (
                    <>
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="13" strokeDasharray={`${savedDash} 251`} />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="13" strokeDasharray={`${visitedDash} 251`} strokeDashoffset={`-${savedDash}`} />
                    </>
                  );
                })()}
              </svg>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }}></span>
                  <span style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 700 }}>{trips.length} Trips Explored</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }}></span>
                  <span style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 700 }}>{savedCount} Saved Sights</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
            <Link to="/places" style={{ flex: 1, textAlign: 'center', background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
              📍 Browse Sights
            </Link>
            <Link to="/trips" style={{ flex: 1, textAlign: 'center', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '8px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
              🧳 View All Trips
            </Link>
          </div>
        </div>

        {/* ✈️ Next Upcoming Trip Countdown Ticker */}
        <div style={{ background: nextTrip ? 'linear-gradient(135deg, #0f172a, #1e293b)' : 'white', color: nextTrip ? 'white' : '#0f172a', padding: '24px', borderRadius: '22px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
          {nextTrip ? (
            <>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>⏳ Upcoming Departure</span>
                  <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 12px', borderRadius: '16px', fontWeight: 800, fontSize: '0.8rem' }}>{getDaysUntilNextTrip()}</span>
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.35rem', fontWeight: 800, color: 'white' }}>{nextTrip.name}</h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '0 0 16px' }}>
                  📅 {new Date(nextTrip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(nextTrip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link to={`/trips/${nextTrip.id}`} style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #38bdf8, #0284c7)', color: '#0f172a', fontWeight: 800, padding: '10px 14px', borderRadius: '14px', textDecoration: 'none', fontSize: '0.84rem' }}>
                  Open Itinerary &rarr;
                </Link>
                <Link to={`/places?search=${encodeURIComponent(nextTrip.name)}`} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 700, padding: '10px 14px', borderRadius: '14px', textDecoration: 'none', fontSize: '0.84rem' }}>
                  📍 Explore Sights
                </Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '10px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <span style={{ fontSize: '2.4rem', display: 'block', marginBottom: '8px' }}>🚀</span>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 800 }}>No Upcoming Trips Scheduled</h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 14px' }}>Use the AI Auto-Planner to generate your next holiday in seconds!</p>
              <Link to="/planner" className="btn btn-primary" style={{ borderRadius: '16px', padding: '10px 18px', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}>
                ⚡ Auto-Plan a Trip Now
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Standard Stat Highlights */}
      <div className="dashboard-highlights">
        <div className="highlight-card">
          <div className="highlight-icon">🔥</div>
          <div className="highlight-info">
            <span className="highlight-number">{tripStreak}</span>
            <span className="highlight-label">{tripStreak > 0 ? 'Month Streak!' : 'Start a Streak'}</span>
          </div>
        </div>
        <div className="highlight-card">
          <div className="highlight-icon">💰</div>
          <div className="highlight-info">
            <span className="highlight-number" style={{fontSize: totalBudgetINR > 99999 ? '1.2rem' : undefined}}>₹{totalBudgetINR > 0 ? (totalBudgetINR >= 100000 ? (totalBudgetINR/100000).toFixed(1)+'L' : totalBudgetINR.toLocaleString('en-IN')) : '—'}</span>
            <span className="highlight-label">Planned Budget</span>
          </div>
        </div>
        <div className="highlight-card">
          <div className="highlight-icon">🧳</div>
          <div className="highlight-info">
            <span className="highlight-number">{trips.length}</span>
            <span className="highlight-label">{t('totalTrips')}</span>
          </div>
        </div>
        <div className="highlight-card">
          <div className="highlight-icon">⏳</div>
          <div className="highlight-info">
            <span className="highlight-number">{upcoming.length}</span>
            <span className="highlight-label">{t('upcomingAdventures')}</span>
          </div>
        </div>
        <div className="highlight-card">
          <div className="highlight-icon">🌐</div>
          <div className="highlight-info">
            <span className="highlight-number">{sharedCount}</span>
            <span className="highlight-label">{t('sharedPublicTrips')}</span>
          </div>
        </div>
        <div className="highlight-card">
          <div className="highlight-icon">📍</div>
          <div className="highlight-info">
            <span className="highlight-number">{cities.length}</span>
            <span className="highlight-label">{t('featuredCities')}</span>
          </div>
        </div>
      </div>

      {/* Recent Itineraries Section */}
      <section className="dashboard-section">
        <div className="section-header-row">
          <div>
            <h2>{t('recentItineraries')}</h2>
            <p className="section-subtitle">{t('recentSub')}</p>
          </div>
          {trips.length > 0 && <Link to="/trips" className="link-button">{t('viewAllTrips')} ({trips.length}) →</Link>}
        </div>

        {trips.length === 0 ? (
          <div className="empty-state-card">
            <span className="empty-state-icon">🗺️</span>
            <h3>No trips planned yet</h3>
            <p>Start your adventure by creating your first personalized itinerary.</p>
            <Link to="/planner" className="btn btn-primary" style={{ marginTop: '12px' }}>⚡ Auto-Plan First Trip</Link>
          </div>
        ) : (
          <div className="mini-trip-grid">
            {trips.slice(0, 4).map((trip) => (
              <Link to={`/trips/${trip.id}`} key={trip.id} className="mini-trip-card">
                <div className="mini-trip-header">
                  <strong>{trip.name}</strong>
                  {trip.isPublic && <span className="mini-badge">Public</span>}
                </div>
                <div className="mini-trip-dates">
                  📅 {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="mini-trip-footer">
                  <span>📍 {trip.destinationCount} stop(s)</span>
                  <span className="mini-trip-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Trending Destinations Grid */}
      <section className="dashboard-section">
        <div className="section-header-row">
          <div>
            <h2>{t('trendingDestinations')}</h2>
            <p className="section-subtitle">{t('trendingSub')}</p>
          </div>
          <Link to="/places" className="link-button">{t('exploreAllSights')} →</Link>
        </div>

        <div className="city-chip-list">
          {(cities.length > 0 ? cities : [
            { id: 'c1', name: 'Matheran', country: 'India', region: 'Maharashtra', popularity: 94 },
            { id: 'c2', name: 'Lonavala', country: 'India', region: 'Maharashtra', popularity: 95 },
            { id: 'c3', name: 'Jaipur', country: 'India', region: 'Rajasthan', popularity: 96 },
            { id: 'c4', name: 'Goa', country: 'India', region: 'Goa Coast', popularity: 97 },
            { id: 'c5', name: 'Manali', country: 'India', region: 'Himachal', popularity: 92 },
            { id: 'c6', name: 'Varanasi', country: 'India', region: 'Uttar Pradesh', popularity: 93 }
          ]).map((city) => (
            <Link to={`/places?search=${encodeURIComponent(city.name)}`} className="city-chip" key={city.id}>
              <span className="city-chip-icon">📍</span>
              <div className="city-chip-info">
                <strong>{city.name}</strong>
                <span>{city.country} ({city.region || 'World'})</span>
              </div>
              <span className="city-chip-popularity">🔥 {city.popularity}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Utility Tools Grid: Currency Converter & Live Weather */}
      <div className="dashboard-tools-grid">
        <div>
          <CurrencyConverterWidget />
        </div>
        <div>
          <WeatherWidget
            destinationName={nextTrip ? (nextTrip.name || 'India') : 'India'}
            destinationKey={nextTrip ? (nextTrip.name || 'india').toLowerCase().replace(/[\s-]+/g, '') : 'india'}
          />
        </div>
      </div>

      {/* Certified Local Guides Directory */}
      <LocalGuidesWidget />

      {/* Modals */}
      {showQuizModal && <TravelQuizModal onClose={() => setShowQuizModal(false)} />}
      {showReelModal && <TravelReelsModal onClose={() => setShowReelModal(false)} />}
      {showBookingModal && <TourBookingModal destinationName="India Special Tour" onClose={() => setShowBookingModal(false)} />}
      {showUploadModal && <UploadReelModal onClose={() => setShowUploadModal(false)} />}
    </div>
  );
}
