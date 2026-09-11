import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ShareTripModal from '../components/ShareTripModal';
import MapView from '../components/MapView';
import ErrorBoundary from '../components/ErrorBoundary';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function tripStatus(trip) {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (now < start) return 'Upcoming';
  if (now > end) return 'Completed';
  return 'Ongoing';
}

function mapPlanFromCommunityTrip(trip) {
  if (!trip) return null;
  const citiesList = trip.cities || ['Destination'];
  return {
    destination: { name: citiesList[0] || 'India', country: 'India' },
    tripName: trip.name,
    startDate: trip.startDate,
    endDate: trip.endDate,
    totalDays: 3,
    days: citiesList.map((city, idx) => ({
      dayNumber: idx + 1,
      date: new Date(Date.now() + idx * 86400000).toISOString().split('T')[0],
      activities: [
        { id: `a-${idx}-1`, name: `${city} Heritage Tour`, category: 'Sightseeing', rating: 4.9, address: city, slot: 'Morning' },
        { id: `a-${idx}-2`, name: `Local Culinary Tasting in ${city}`, category: 'Food', rating: 4.8, address: city, slot: 'Evening' }
      ]
    }))
  };
}

const VIBE_CATEGORIES = [
  { id: 'all', label: '✨ All Vibes' },
  { id: 'solo', label: '🎒 Solo Backpacker' },
  { id: 'romantic', label: '💑 Romantic Escapes' },
  { id: 'family', label: '👨‍👩‍👧‍👦 Family Vacation' },
  { id: 'trek', label: '⛰️ Mountain Trekking' },
  { id: 'beach', label: '🏖️ Coastal Retreats' },
  { id: 'heritage', label: '🛕 Heritage & Culture' }
];

export default function Community() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [groupBy, setGroupBy] = useState('none');
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'leaderboard'

  const [activeShareTrip, setActiveShareTrip] = useState(null);
  const [activeMapTrip, setActiveMapTrip] = useState(null);
  const [commentTrip, setCommentTrip] = useState(null);
  const [commentsMap, setCommentsMap] = useState(() => {
    try {
      const saved = localStorage.getItem('gt_community_comments');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      default: [
        { id: 'c1', user: 'Rahul Verma', text: 'Loved the Day 2 sunset point recommendation! Outstanding view.', time: '2 hours ago' },
        { id: 'c2', user: 'Priya Sharma', text: 'Are horse rides required for Matheran or is walking easy?', time: '5 hours ago' }
      ]
    };
  });
  const [newCommentText, setNewCommentText] = useState('');

  // Clone Modal State
  const [cloneTripTarget, setCloneTripTarget] = useState(null);
  const [cloneCustomName, setCloneCustomName] = useState('');
  const [cloneStartDate, setCloneStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [cloning, setCloning] = useState(false);
  const [cloneSuccessMsg, setCloneSuccessMsg] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/community');
        setTrips(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load the community feed.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const visibleTrips = useMemo(() => {
    let list = trips.filter((t) => {
      const haystack = `${t.name} ${t.description || ''} ${(t.cities || []).join(' ')} ${t.authorName || ''}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      if (!matchesSearch) return false;

      if (selectedVibe === 'solo') return haystack.includes('solo') || haystack.includes('budget') || haystack.includes('backpacker');
      if (selectedVibe === 'romantic') return haystack.includes('romantic') || haystack.includes('honeymoon') || haystack.includes('couple');
      if (selectedVibe === 'family') return haystack.includes('family') || haystack.includes('resort') || haystack.includes('kids');
      if (selectedVibe === 'trek') return haystack.includes('trek') || haystack.includes('mountain') || haystack.includes('manali') || haystack.includes('ladakh');
      if (selectedVibe === 'beach') return haystack.includes('goa') || haystack.includes('beach') || haystack.includes('kerala') || haystack.includes('coast');
      if (selectedVibe === 'heritage') return haystack.includes('fort') || haystack.includes('temple') || haystack.includes('jaipur') || haystack.includes('varanasi');

      return true;
    });

    if (sortBy === 'recent') {
      list = list.slice().sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
    } else if (sortBy === 'name') {
      list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [trips, search, selectedVibe, sortBy]);

  const groupedTrips = useMemo(() => {
    if (groupBy !== 'status') return null;
    const order = ['Ongoing', 'Upcoming', 'Completed'];
    const groups = { Ongoing: [], Upcoming: [], Completed: [] };
    visibleTrips.forEach((trip) => groups[tripStatus(trip)].push(trip));
    return order.map((label) => ({ label, items: groups[label] })).filter((g) => g.items.length > 0);
  }, [visibleTrips, groupBy]);

  const handleConfirmClone = async (e) => {
    e.preventDefault();
    if (!cloneTripTarget) return;
    setCloning(true);
    setCloneSuccessMsg('');
    try {
      const today = new Date(cloneStartDate);
      const endDate = new Date(today.getTime() + 4 * 86400000).toISOString().split('T')[0];
      await api.post('/trips', {
        name: cloneCustomName || `${cloneTripTarget.name} (Cloned)`,
        startDate: cloneStartDate,
        endDate: endDate,
        description: cloneTripTarget.description || 'Cloned from community traveler.',
        coverPhoto: cloneTripTarget.coverPhoto
      });
      setCloneSuccessMsg('🎉 Successfully cloned to My Trips!');
      setTimeout(() => {
        setCloneTripTarget(null);
        setCloneSuccessMsg('');
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not clone trip. Please log in.');
    } finally {
      setCloning(false);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !commentTrip) return;
    const tripId = commentTrip.id || 'default';
    const newComment = {
      id: `c-${Date.now()}`,
      user: 'You (Explorer)',
      text: newCommentText.trim(),
      time: 'Just now'
    };
    setCommentsMap((prev) => {
      const updated = {
        ...prev,
        [tripId]: [...(prev[tripId] || prev['default'] || []), newComment]
      };
      try {
        localStorage.setItem('gt_community_comments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setNewCommentText('');
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading community itineraries...</p></div>;

  return (
    <div className="page-container community-hub-page">
      {/* Hero Banner Header */}
      <div
        className="dashboard-hero"
        style={{
          borderRadius: '24px',
          padding: '36px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0369a1 100%)',
          color: 'white',
          marginBottom: '24px',
          boxShadow: '0 20px 40px rgba(15,23,42,0.18)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <span
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '14px'
            }}
          >
            🌐 GlobeTrotter Traveler Network &amp; Public Feed
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 10px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            Community Itineraries ({visibleTrips.length})
          </h1>
          <p style={{ fontSize: '1.02rem', color: 'rgba(241, 245, 249, 0.95)', margin: 0, lineHeight: 1.6 }}>
            Get inspired by real travel plans created and shared by fellow globetrotters. Clone itineraries directly into your trips with custom dates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '4px', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            style={{
              background: activeTab === 'feed' ? 'white' : 'transparent',
              color: activeTab === 'feed' ? '#0f172a' : 'white',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🗺️ Public Feed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            style={{
              background: activeTab === 'leaderboard' ? 'white' : 'transparent',
              color: activeTab === 'leaderboard' ? '#0f172a' : 'white',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🏆 Leaderboard
          </button>
        </div>
      </div>

      {activeTab === 'leaderboard' ? (
        /* Community Leaderboard & Top Contributors Section */
        <div style={{ background: 'white', padding: '28px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.05)', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>🏆 Top Community Contributors</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 20px' }}>Honoring travelers who create and share top-rated itineraries across India &amp; Worldwide.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { rank: '👑 #1', name: 'Aarav Sharma', trips: 14, likes: 342, title: 'Master Rajasthan Explorer', avatar: '👨‍💼' },
              { rank: '🥈 #2', name: 'Neha Kulkarni', trips: 11, likes: 289, title: 'Western Ghats Specialist', avatar: '👩‍💼' },
              { rank: '🥉 #3', name: 'Vikram Singh', trips: 9, likes: 215, title: 'Himalayan Trekking Guide', avatar: '🧗‍♂️' },
              { rank: '🌟 #4', name: 'Rohan Mehta', trips: 7, likes: 178, title: 'Coastal Goa Voyager', avatar: '🏖️' }
            ].map((usr) => (
              <div key={usr.name} style={{ background: '#f8fafc', padding: '18px', borderRadius: '18px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '2rem' }}>{usr.avatar}</span>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb' }}>{usr.rank}</span>
                  <h4 style={{ margin: '2px 0 2px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{usr.name}</h4>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>{usr.title}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '10px' }}>
                    ❤️ {usr.likes} likes · 🧳 {usr.trips} public trips
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Glassmorphic Search & Filter Bar */}
          <div className="search-controls" style={{ background: 'white', padding: '20px', borderRadius: '22px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.04)', marginBottom: '20px' }}>
            <input
              placeholder="Search by trip title, destination, or traveler name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: '14px', padding: '12px 18px', fontSize: '0.92rem' }}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ borderRadius: '14px', padding: '12px 16px' }}>
              <option value="recent">Sort by: Most Recent</option>
              <option value="name">Sort by: Name (A-Z)</option>
            </select>
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} style={{ borderRadius: '14px', padding: '12px 16px' }}>
              <option value="none">Group by: None</option>
              <option value="status">Group by: Trip Status</option>
            </select>
          </div>

          {/* Vibe Filter Pills Bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap' }}>
            {VIBE_CATEGORIES.map((vibe) => (
              <button
                key={vibe.id}
                type="button"
                onClick={() => setSelectedVibe(vibe.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: selectedVibe === vibe.id ? '1px solid #2563eb' : '1px solid #e2e8f0',
                  background: selectedVibe === vibe.id ? '#2563eb' : '#white',
                  color: selectedVibe === vibe.id ? 'white' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {vibe.label}
              </button>
            ))}
          </div>

          {error && <p className="form-error">{error}</p>}

          {visibleTrips.length === 0 ? (
            <div className="empty-state-card" style={{ padding: '60px 24px', background: 'white', borderRadius: '24px', textAlign: 'center' }}>
              <span className="empty-state-icon" style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🌍</span>
              <h3>No public trips found</h3>
              <p style={{ color: '#64748b' }}>Be the first traveler to share your itinerary with the GlobeTrotter community!</p>
            </div>
          ) : groupBy === 'status' ? (
            groupedTrips.map((group) => (
              <section key={group.label} className="builder-section" style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                  {group.label} <span className="page-subtitle" style={{ display: 'inline', fontSize: '0.9rem' }}>({group.items.length})</span>
                </h2>
                <div className="trip-grid">
                  {group.items.map((trip) => (
                    <CommunityTripCard
                      key={trip.id}
                      trip={trip}
                      onShare={() => setActiveShareTrip(trip)}
                      onMap={() => setActiveMapTrip(trip)}
                      onComment={() => setCommentTrip(trip)}
                      onOpenClone={() => {
                        setCloneTripTarget(trip);
                        setCloneCustomName(`${trip.name} (Cloned)`);
                      }}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="trip-grid">
              {visibleTrips.map((trip) => (
                <CommunityTripCard
                  key={trip.id}
                  trip={trip}
                  onShare={() => setActiveShareTrip(trip)}
                  onMap={() => setActiveMapTrip(trip)}
                  onComment={() => setCommentTrip(trip)}
                  onOpenClone={() => {
                    setCloneTripTarget(trip);
                    setCloneCustomName(`${trip.name} (Cloned)`);
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Share & QR Modal */}
      {activeShareTrip && (
        <ShareTripModal
          shareId={activeShareTrip.shareId}
          tripName={activeShareTrip.name}
          onClose={() => setActiveShareTrip(null)}
        />
      )}

      {/* Interactive Map View Modal */}
      {activeMapTrip && (
        <div className="modal-overlay" onClick={() => setActiveMapTrip(null)} style={{ zIndex: 9999 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', width: '95%', padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                  🗺️ Public Itinerary Map: {activeMapTrip.name}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Curated route map shared by {activeMapTrip.authorName}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveMapTrip(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>
            <ErrorBoundary title="Map View Warning">
              <MapView generatedPlan={mapPlanFromCommunityTrip(activeMapTrip)} />
            </ErrorBoundary>
          </div>
        </div>
      )}

      {/* Advanced Clone & Date Customizer Modal */}
      {cloneTripTarget && (
        <div className="modal-overlay" onClick={() => setCloneTripTarget(null)}>
          <div className="modal-content card-form" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '24px', borderRadius: '22px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 4px' }}>📋 Clone &amp; Customize Trip</h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 16px' }}>Customize your start date and trip title before adding to "My Trips".</p>

            <form onSubmit={handleConfirmClone}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>Trip Title:</label>
                <input
                  type="text"
                  value={cloneCustomName}
                  onChange={(e) => setCloneCustomName(e.target.value)}
                  style={{ width: '100%', borderRadius: '12px', padding: '10px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>New Start Date:</label>
                <input
                  type="date"
                  value={cloneStartDate}
                  onChange={(e) => setCloneStartDate(e.target.value)}
                  style={{ width: '100%', borderRadius: '12px', padding: '10px' }}
                />
              </div>

              {cloneSuccessMsg && <p style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>{cloneSuccessMsg}</p>}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setCloneTripTarget(null)} style={{ borderRadius: '14px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={cloning} style={{ borderRadius: '14px', fontWeight: 800 }}>
                  {cloning ? 'Cloning...' : 'Confirm & Save to My Trips'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Community Q&A & Discussion Drawer Modal */}
      {commentTrip && (
        <div className="modal-overlay" onClick={() => setCommentTrip(null)}>
          <div className="modal-content card-form" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '24px', borderRadius: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', pb: '10px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                💬 Traveler Q&amp;A: {commentTrip.name}
              </h3>
              <button type="button" onClick={() => setCommentTrip(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ maxHeight: '260px', overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(commentsMap[commentTrip.id] || commentsMap['default'] || []).map((c) => (
                <div key={c.id} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#0284c7', marginBottom: '2px' }}>
                    <span>{c.user}</span>
                    <span style={{ color: '#94a3b8' }}>{c.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155' }}>{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Ask a question or share a tip..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                style={{ flex: 1, borderRadius: '14px', padding: '10px 14px', fontSize: '0.88rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '14px', fontWeight: 800, padding: '10px 16px' }}>Post</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const DESTINATION_COVERS = {
  matheran: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80',
  lonavala: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80',
  mahabaleshwar: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80',
  jaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
  udaipur: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&q=80',
  jodhpur: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80',
  jaisalmer: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
  shimla: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80',
  dharamshala: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80',
  rishikesh: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e13?w=800&q=80',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  alleppey: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  coorg: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  hampi: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80',
  ooty: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80',
  varanasi: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
  agra: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
  ladakh: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80',
  leh: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  darjeeling: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80',
  paris: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&q=80',
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'
};

function getRelatableCoverPhoto(trip) {
  if (trip.coverPhoto && trip.coverPhoto.startsWith('http')) {
    return trip.coverPhoto;
  }
  const textToSearch = `${trip.name || ''} ${trip.description || ''} ${(trip.cities || []).join(' ')}`.toLowerCase();
  for (const [key, url] of Object.entries(DESTINATION_COVERS)) {
    if (textToSearch.includes(key)) {
      return url;
    }
  }
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';
}

function CommunityTripCard({ trip, onShare, onMap, onComment, onOpenClone }) {
  const cover = getRelatableCoverPhoto(trip);
  const [likes, setLikes] = useState(() => Math.floor(Math.random() * 40) + 14);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="trip-card" style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', boxShadow: '0 4px 14px rgba(15,23,42,0.04)' }}>
      <div className="trip-card-image-wrap" style={{ position: 'relative' }}>
        <img className="trip-card-cover" src={cover} alt={trip.name} style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
        <div className="trip-card-image-overlay">
          <span className="badge badge-public" style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, color: 'white' }}>🌐 Community</span>
        </div>
      </div>
      <div className="trip-card-body" style={{ padding: '18px' }}>
        <div className="trip-card-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>{trip.name}</h3>
        </div>
        <div className="trip-card-dates" style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '8px' }}>
          📅 {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
        </div>
        <p className="trip-card-desc" style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, margin: '0 0 10px' }}>{trip.description || 'Public travel itinerary.'}</p>
        <div className="trip-card-meta" style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 700, marginBottom: '14px' }}>
          👤 {trip.authorName} {trip.cities?.length > 0 && `· 📍 ${trip.cities.join(', ')}`}
        </div>

        <div className="trip-card-actions" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
          <Link to={`/share/${trip.shareId}`} className="btn btn-primary btn-small" style={{ borderRadius: '14px', fontWeight: 800, fontSize: '0.78rem' }}>
            Explore →
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={onMap}
            style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', fontWeight: 800, borderRadius: '14px', fontSize: '0.78rem' }}
          >
            🗺️ Map
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={handleLike}
            style={{ background: hasLiked ? '#ef4444' : '#f1f5f9', color: hasLiked ? 'white' : '#334155', border: 'none', fontWeight: 700, borderRadius: '14px', fontSize: '0.78rem' }}
          >
            {hasLiked ? '❤️' : '🤍'} {likes}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={onComment}
            style={{ background: '#f1f5f9', color: '#475569', border: 'none', fontWeight: 700, borderRadius: '14px', fontSize: '0.78rem' }}
          >
            💬 Q&amp;A
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={onOpenClone}
            style={{ background: '#2563eb', color: 'white', border: 'none', fontWeight: 800, borderRadius: '14px', fontSize: '0.78rem' }}
          >
            📋 Clone
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={onShare}
            style={{ background: '#25D366', color: 'white', border: 'none', fontWeight: 800, borderRadius: '14px', fontSize: '0.78rem' }}
          >
            📲 Share
          </button>
        </div>
      </div>
    </div>
  );
}
