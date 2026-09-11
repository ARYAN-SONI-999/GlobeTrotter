import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import AudioGuideButton from '../components/AudioGuideButton';
import LandmarkVRViewer from '../components/LandmarkVRViewer';
import MapView from '../components/MapView';
import ErrorBoundary from '../components/ErrorBoundary';
import TourBookingModal from '../components/TourBookingModal';

function getThrillBadge(act) {
  const t = (act.type || '').toLowerCase();
  const n = (act.name || '').toLowerCase();
  if (t.includes('adventure') || n.includes('rafting') || n.includes('trek') || n.includes('safari') || n.includes('paragliding')) {
    return { badge: '⚡ High Thrill (4.9/5)', color: '#dc2626', bg: '#fef2f2' };
  } else if (t.includes('food') || n.includes('tasting') || n.includes('thali') || n.includes('chikki')) {
    return { badge: '🍱 Gourmet Vibe (4.8/5)', color: '#d97706', bg: '#fffbeb' };
  } else if (t.includes('culture') || n.includes('fort') || n.includes('temple') || n.includes('palace') || n.includes('aarti')) {
    return { badge: '🛕 Heritage & Culture', color: '#7c3aed', bg: '#f5f3ff' };
  } else {
    return { badge: '🌴 Leisure & Scenic Chill', color: '#059669', bg: '#ecfdf5' };
  }
}

const CATEGORY_COVERS = {
  food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  culture: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
  adventure: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=600&q=80',
  leisure: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  sightseeing: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80'
};

function getActivityCoverPhoto(act) {
  if (act.imageUrl && act.imageUrl.startsWith('http')) return act.imageUrl;
  const t = (act.type || '').toLowerCase();
  for (const [key, url] of Object.entries(CATEGORY_COVERS)) {
    if (t.includes(key)) return url;
  }
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80';
}

function mapPlanFromActivities(activitiesList) {
  if (!activitiesList || activitiesList.length === 0) return null;
  return {
    destination: { name: 'Activities Map', country: 'India' },
    tripName: 'Discovered Activities Map',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    totalDays: 1,
    days: [
      {
        dayNumber: 1,
        date: new Date().toISOString().split('T')[0],
        activities: activitiesList.slice(0, 15).map((act, idx) => ({
          id: act.id,
          name: act.name,
          category: act.type || 'Sightseeing',
          rating: 4.8,
          imageUrl: act.imageUrl,
          address: act.name,
          slot: `Activity #${idx + 1}`
        }))
      }
    ]
  };
}

export default function ActivitySearch() {
  const [activities, setActivities] = useState([]);
  const [selectedVRKey, setSelectedVRKey] = useState(null);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [bookingActivityName, setBookingActivityName] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [cityFilter, setCityFilter] = useState('');

  const [quickViewActivity, setQuickViewActivity] = useState(null);

  // Saved Wishlist State
  const [savedActivityIds, setSavedActivityIds] = useState(() => {
    try {
      const stored = localStorage.getItem('globetrotter_saved_activities');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Batch Select State
  const [batchSelectedIds, setBatchSelectedIds] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchAdding, setBatchAdding] = useState(false);
  const [batchMsg, setBatchMsg] = useState('');

  // Add to Trip Modal State
  const [addToTripActivity, setAddToTripActivity] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [tripStops, setTripStops] = useState([]);
  const [selectedStopId, setSelectedStopId] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [addMsg, setAddMsg] = useState('');
  const [addError, setAddError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [addedActivities, setAddedActivities] = useState([]);

  const toggleSaveActivity = (e, actId) => {
    if (e) e.stopPropagation();
    setSavedActivityIds((prev) => {
      const isSaved = prev.includes(actId);
      const next = isSaved ? prev.filter((id) => id !== actId) : [...prev, actId];
      try {
        localStorage.setItem('globetrotter_saved_activities', JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

  const toggleBatchSelect = (e, actId) => {
    if (e) e.stopPropagation();
    setBatchSelectedIds((prev) =>
      prev.includes(actId) ? prev.filter((id) => id !== actId) : [...prev, actId]
    );
  };

  const loadActivities = async (q = search, t = type, cost = maxCost, dur = maxDuration, cityId = cityFilter) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      if (t) params.set('type', t);
      if (cost) params.set('maxCost', cost);
      if (dur) params.set('maxDuration', dur);
      if (cityId) params.set('cityId', cityId);

      const res = await api.get(`/activities/templates?${params.toString()}`);
      setActivities(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load activities.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserTrips = async () => {
    try {
      const res = await api.get('/trips');
      setUserTrips(res.data || []);
      if (res.data.length > 0) {
        setSelectedTripId(res.data[0].id);
        fetchTripStops(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    api.get('/cities').then(res => setCityList(res.data || [])).catch(() => {});
    loadActivities();
    loadUserTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleActivities = useMemo(() => {
    if (showSavedOnly) {
      return activities.filter((a) => savedActivityIds.includes(a.id));
    }
    return activities;
  }, [activities, showSavedOnly, savedActivityIds]);

  const handleFilter = (e) => {
    e.preventDefault();
    loadActivities(search, type, maxCost, maxDuration, cityFilter);
  };

  const handleReset = () => {
    setSearch('');
    setType('');
    setMaxCost('');
    setMaxDuration('');
    setCityFilter('');
    setShowSavedOnly(false);
    loadActivities('', '', '', '', '');
  };

  const fetchTripStops = async (tripId) => {
    try {
      const res = await api.get(`/trips/${tripId}`);
      const stops = res.data.stops || [];
      setTripStops(stops);
      if (stops.length > 0) {
        setSelectedStopId(stops[0].id);
        setActivityDate(stops[0].startDate);
      } else {
        setSelectedStopId('');
        setActivityDate('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTripChange = async (tripId) => {
    setSelectedTripId(tripId);
    await fetchTripStops(tripId);
  };

  const openAddToTrip = async (activity) => {
    setAddToTripActivity(activity);
    setAddMsg('');
    setAddError('');
    setActivityDate('');
    setStartTime('10:00');

    if (userTrips.length > 0) {
      const firstTripId = userTrips[0].id;
      setSelectedTripId(firstTripId);
      await fetchTripStops(firstTripId);
    } else {
      setSelectedTripId('');
      setTripStops([]);
      setSelectedStopId('');
    }
  };

  const handleConfirmAdd = async (e) => {
    e.preventDefault();
    if (!selectedStopId) {
      setAddError('Please select a stop to add this activity to.');
      return;
    }
    setSubmitting(true);
    setAddError('');
    setAddMsg('');
    try {
      const res = await api.post(`/stops/${selectedStopId}/activities`, {
        name: addToTripActivity.name,
        type: addToTripActivity.type,
        cost: addToTripActivity.cost,
        duration: addToTripActivity.duration,
        description: addToTripActivity.description,
        imageUrl: addToTripActivity.imageUrl || '',
        activityDate: activityDate || null,
        startTime: startTime || null
      });

      const newCreatedId = res.data.id;
      setAddedActivities((prev) => [
        ...prev,
        {
          templateId: addToTripActivity.id,
          stopId: selectedStopId,
          createdActivityId: newCreatedId,
          name: addToTripActivity.name
        }
      ]);

      setAddMsg('✓ Activity added to your trip stop!');
      setTimeout(() => {
        setAddToTripActivity(null);
        setAddMsg('');
      }, 1500);
    } catch (err) {
      setAddError(err.response?.data?.message || 'Could not add activity to stop.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmBatchAdd = async () => {
    if (batchSelectedIds.length === 0 || !selectedStopId) return;
    setBatchAdding(true);
    setBatchMsg('');
    try {
      const selectedActs = activities.filter((a) => batchSelectedIds.includes(a.id));
      for (const act of selectedActs) {
        await api.post(`/stops/${selectedStopId}/activities`, {
          name: act.name,
          type: act.type || 'Sightseeing',
          cost: act.cost || 0,
          duration: act.duration || 2,
          description: act.description || '',
          imageUrl: act.imageUrl || '',
          activityDate: activityDate || null,
          startTime: '10:00'
        });
      }
      setBatchMsg(`✓ Added ${selectedActs.length} activities to your trip stop!`);
      setTimeout(() => {
        setBatchSelectedIds([]);
        setShowBatchModal(false);
        setBatchMsg('');
      }, 1800);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add activities to trip.');
    } finally {
      setBatchAdding(false);
    }
  };

  const handleRemoveAddedActivity = async (addedItem) => {
    try {
      await api.delete(`/stops/${addedItem.stopId}/activities/${addedItem.createdActivityId}`);
      setAddedActivities((prev) =>
        prev.filter((a) => a.createdActivityId !== addedItem.createdActivityId)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Could not remove activity.');
    }
  };

  return (
    <div className="page-container activity-explorer-page">
      {/* Hero Banner Header */}
      <div
        className="dashboard-hero"
        style={{
          borderRadius: '24px',
          padding: '36px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4c1d95 100%)',
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
            🎯 Curated Travel Experiences &amp; Adventures
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 10px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            Discover Activities ({visibleActivities.length})
          </h1>
          <p style={{ fontSize: '1.02rem', color: 'rgba(241, 245, 249, 0.95)', margin: 0, lineHeight: 1.6 }}>
            Browse sightseeing tours, food tastings, river rafting, mountain treks, and cultural experiences with instant 1-click itinerary batch insertion.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="btn"
            onClick={() => setShowMapModal(true)}
            style={{
              background: 'white',
              color: '#0f172a',
              fontWeight: 800,
              padding: '12px 22px',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
            }}
          >
            🗺️ Interactive Map Mode
          </button>
        </div>
      </div>

      {/* Glassmorphic Search Controls */}
      <form className="search-controls" onSubmit={handleFilter} style={{ background: 'white', padding: '20px', borderRadius: '22px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.04)', marginBottom: '22px' }}>
        <input
          type="text"
          placeholder="Search activity name, location, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ borderRadius: '14px', padding: '12px 18px', fontSize: '0.92rem' }}
        />
        <select
          value={cityFilter}
          onChange={(e) => {
            setCityFilter(e.target.value);
            loadActivities(search, type, maxCost, maxDuration, e.target.value);
          }}
          style={{ borderRadius: '14px', padding: '12px 16px', minWidth: '160px' }}
        >
          <option value="">📍 All Destinations</option>
          {cityList.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ borderRadius: '14px', padding: '12px 16px' }}>
          <option value="">All Categories</option>
          {['Adventure', 'Sightseeing', 'Food', 'Culture', 'Leisure'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Max cost ₹"
          value={maxCost}
          onChange={(e) => setMaxCost(e.target.value)}
          style={{ maxWidth: '140px', borderRadius: '14px', padding: '12px 16px' }}
        />
        <input
          type="number"
          placeholder="Max hours"
          value={maxDuration}
          onChange={(e) => setMaxDuration(e.target.value)}
          style={{ maxWidth: '140px', borderRadius: '14px', padding: '12px 16px' }}
        />
        <button type="submit" className="btn btn-primary" style={{ borderRadius: '14px', padding: '12px 22px', fontWeight: 800 }}>Filter</button>
        <button type="button" className="btn btn-outline" onClick={handleReset} style={{ borderRadius: '14px', padding: '12px 18px' }}>Reset</button>
      </form>

      {/* Quick Category Pills & Saved Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { label: '✨ All Types', value: '' },
            { label: '🏰 Sightseeing', value: 'Sightseeing' },
            { label: '🍱 Food & Dining', value: 'Food' },
            { label: '🛕 Culture & Heritage', value: 'Culture' },
            { label: '🏄 Adventure Sports', value: 'Adventure' },
            { label: '🌴 Leisure & Relax', value: 'Leisure' }
          ].map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => {
                setShowSavedOnly(false);
                setType(cat.value);
                loadActivities(search, cat.value, maxCost, maxDuration);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: type === cat.value && !showSavedOnly ? '1px solid #2563eb' : '1px solid #e2e8f0',
                background: type === cat.value && !showSavedOnly ? '#2563eb' : '#fff',
                color: type === cat.value && !showSavedOnly ? 'white' : '#475569',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowSavedOnly((prev) => !prev)}
          style={{
            background: showSavedOnly ? '#be185d' : '#fdf2f8',
            color: showSavedOnly ? 'white' : '#be185d',
            border: '1px solid #fbcfe8',
            padding: '8px 18px',
            borderRadius: '20px',
            fontWeight: 800,
            fontSize: '0.84rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ❤️ Saved Wishlist ({savedActivityIds.length})
        </button>
      </div>

      {error && <p className="form-error" style={{ marginBottom: '16px' }}>{error}</p>}

      {loading ? (
        <div className="page-loading"><div className="spinner"></div><p>Loading activities...</p></div>
      ) : visibleActivities.length === 0 ? (
        <div className="empty-state-card" style={{ padding: '60px 24px', background: 'white', borderRadius: '24px', textAlign: 'center' }}>
          <span className="empty-state-icon" style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🎯</span>
          <h3>{showSavedOnly ? 'No saved activities yet' : 'No activities match your filters'}</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{showSavedOnly ? 'Click the ❤️ heart icon on any activity card to save it to your wishlist.' : 'Try resetting your search filters.'}</p>
          <button type="button" className="btn btn-secondary" onClick={handleReset} style={{ marginTop: '14px', borderRadius: '16px' }}>Reset All Filters</button>
        </div>
      ) : (
        <div className="template-grid">
          {visibleActivities.map((act) => {
            const addedItemsForAct = addedActivities.filter((a) => a.templateId === act.id);
            const thrill = getThrillBadge(act);
            const isSaved = savedActivityIds.includes(act.id);
            const isBatchSelected = batchSelectedIds.includes(act.id);

            return (
              <div className="template-card" key={act.id} style={{ borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', background: 'white', boxShadow: '0 4px 14px rgba(15,23,42,0.04)' }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <input
                    type="checkbox"
                    checked={isBatchSelected}
                    onChange={(e) => toggleBatchSelect(e, act.id)}
                    onClick={(e) => e.stopPropagation()}
                    title="Select for batch add to trip"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      width: '22px',
                      height: '22px',
                      cursor: 'pointer',
                      zIndex: 3,
                      accentColor: '#2563eb'
                    }}
                  />
                  <img
                    src={getActivityCoverPhoto(act)}
                    alt={act.name}
                    className="activity-card-img"
                    onClick={() => setQuickViewActivity(act)}
                    title="Click for quick view"
                    style={{ height: '170px', width: '100%', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={(e) => toggleSaveActivity(e, act.id)}
                    title={isSaved ? "Remove from Saved Wishlist" : "Save to Wishlist"}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: isSaved ? '#be185d' : 'rgba(15,23,42,0.65)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '15px',
                      zIndex: 2,
                      backdropFilter: 'blur(6px)'
                    }}
                  >
                    {isSaved ? '❤️' : '🤍'}
                  </button>
                  <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: thrill.bg, color: thrill.color, border: `1px solid ${thrill.color}40`, padding: '4px 10px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 800 }}>
                    {thrill.badge}
                  </span>
                </div>
                <div className="template-card-body" style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '3px 8px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      📍 {act.cityName ? `${act.cityName}, ${act.cityCountry || ''}` : 'Top Experience'}
                    </span>
                    <span className="activity-type-badge">{act.type}</span>
                  </div>

                  <strong style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '6px' }}>
                    {act.name}
                  </strong>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.82rem' }}>
                    <span style={{ color: '#d97706', fontWeight: 800 }}>★ 4.9</span>
                    <span style={{ color: '#64748b' }}>(1,200+ booked)</span>
                    <span style={{ color: '#cbd5e1' }}>•</span>
                    <span style={{ color: '#64748b' }}>⏱ {act.duration} hr{act.duration > 1 ? 's' : ''}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', margin: '4px 0 10px', flexWrap: 'wrap' }}>
                    <AudioGuideButton
                      placeName={act.name}
                      description={act.description}
                      category={act.type}
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedVRKey(act.name)}
                      style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      🥽 360° VR
                    </button>
                  </div>

                  <p className="activity-desc-line" style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, margin: '4px 0 12px' }}>
                    {act.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px', fontSize: '0.76rem', color: '#059669', fontWeight: 700 }}>
                    <span>✓ Free Cancellation</span>
                    <span>•</span>
                    <span>✓ Certified Guide</span>
                    <span>•</span>
                    <span>✓ Instant Confirmation</span>
                  </div>

                  <div className="template-card-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>From</span>
                      <strong style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 900 }}>
                        {act.cost === 0 ? 'Free Entry' : `₹${Number(act.cost).toLocaleString('en-IN')}`}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}> / person</span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-small"
                        onClick={() => setBookingActivityName(act.name)}
                        style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, padding: '7px 12px', fontSize: '0.82rem', cursor: 'pointer' }}
                        title="Instant Book Tour & Activity"
                      >
                        🎟️ Book Tour
                      </button>
                      <button
                        className="btn btn-small btn-primary"
                        onClick={() => openAddToTrip(act)}
                        style={{ borderRadius: '14px', fontWeight: 800, padding: '7px 12px', fontSize: '0.82rem' }}
                        title="Add to Itinerary"
                      >
                        + Trip
                      </button>
                    </div>
                  </div>

                  {addedItemsForAct.length > 0 && (
                    <div className="activity-added-status" style={{ marginTop: '10px' }}>
                      {addedItemsForAct.map((item) => (
                        <div key={item.createdActivityId} className="activity-added-tag">
                          <span>✓ Added to trip stop</span>
                          <button
                            className="link-button danger"
                            onClick={() => handleRemoveAddedActivity(item)}
                            title="Remove this from your stop"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewActivity && (
        <div className="modal-overlay" onClick={() => setQuickViewActivity(null)}>
          <div className="modal-content card-form" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '24px', borderRadius: '22px' }}>
            {quickViewActivity.imageUrl && (
              <img
                src={quickViewActivity.imageUrl}
                alt={quickViewActivity.name}
                className="quick-view-modal-img"
                style={{ borderRadius: '16px', marginBottom: '16px', width: '100%', height: '220px', objectFit: 'cover' }}
              />
            )}
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>{quickViewActivity.name}</h2>
            <div className="activity-meta-line" style={{ margin: '10px 0', fontSize: '0.92rem', display: 'flex', gap: '12px' }}>
              <span className="activity-type-badge">{quickViewActivity.type}</span>
              <span>💰 Cost: <strong style={{ color: '#059669' }}>{quickViewActivity.cost === 0 ? 'Free Entry' : `₹${quickViewActivity.cost}`}</strong></span>
              <span>⏱ Duration: <strong>{quickViewActivity.duration} hr(s)</strong></span>
            </div>
            <p style={{ margin: '14px 0', lineHeight: 1.6, color: '#334155', fontSize: '0.95rem' }}>{quickViewActivity.description}</p>
            <div className="form-row" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const target = quickViewActivity;
                  setQuickViewActivity(null);
                  openAddToTrip(target);
                }}
                style={{ borderRadius: '16px', fontWeight: 800, padding: '10px 20px' }}
              >
                + Add to Trip
              </button>
              <button className="btn btn-outline" onClick={() => setQuickViewActivity(null)} style={{ borderRadius: '16px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Trip Modal */}
      {addToTripActivity && (
        <div className="modal-overlay" onClick={() => setAddToTripActivity(null)}>
          <div className="modal-content card-form" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '24px', borderRadius: '22px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 4px' }}>Add to Trip: {addToTripActivity.name}</h2>
            <p className="page-subtitle" style={{ margin: '0 0 16px', color: '#64748b' }}>₹{addToTripActivity.cost} • {addToTripActivity.duration} hr(s) • {addToTripActivity.type}</p>

            {userTrips.length === 0 ? (
              <div>
                <p className="empty-state-small">You don't have any trips created yet.</p>
                <a href="/trips/new" className="btn btn-primary btn-small" style={{ marginTop: '10px' }}>Create a Trip First</a>
              </div>
            ) : (
              <form onSubmit={handleConfirmAdd}>
                <label style={{ fontWeight: 700, fontSize: '0.88rem', display: 'block', marginBottom: '4px' }}>1. Select Trip</label>
                <select
                  value={selectedTripId}
                  onChange={(e) => handleTripChange(e.target.value)}
                  style={{ width: '100%', borderRadius: '12px', padding: '10px', marginBottom: '14px' }}
                >
                  {userTrips.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>

                <label style={{ fontWeight: 700, fontSize: '0.88rem', display: 'block', marginBottom: '4px' }}>2. Select Stop</label>
                {tripStops.length === 0 ? (
                  <p className="form-error">This trip has no stops yet. Add a stop in the Itinerary Builder first.</p>
                ) : (
                  <select
                    value={selectedStopId}
                    onChange={(e) => {
                      setSelectedStopId(e.target.value);
                      const s = tripStops.find((st) => st.id === e.target.value);
                      if (s) setActivityDate(s.startDate);
                    }}
                    style={{ width: '100%', borderRadius: '12px', padding: '10px', marginBottom: '14px' }}
                  >
                    {tripStops.map((s, idx) => (
                      <option key={s.id} value={s.id}>
                        Stop #{idx + 1}: {s.cityName || s.city?.name || 'City Stop'}
                      </option>
                    ))}
                  </select>
                )}

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', display: 'block', marginBottom: '4px' }}>Activity Date</label>
                    <input
                      type="date"
                      value={activityDate}
                      onChange={(e) => setActivityDate(e.target.value)}
                      style={{ borderRadius: '12px', padding: '8px 12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', display: 'block', marginBottom: '4px' }}>Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      style={{ borderRadius: '12px', padding: '8px 12px' }}
                    />
                  </div>
                </div>

                {addError && <p className="form-error">{addError}</p>}
                {addMsg && <p className="form-success">{addMsg}</p>}

                <div className="form-row" style={{ marginTop: '18px', display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting || tripStops.length === 0}
                    style={{ borderRadius: '16px', fontWeight: 800, padding: '10px 20px' }}
                  >
                    {submitting ? 'Adding...' : 'Add Activity to Stop'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setAddToTripActivity(null)} style={{ borderRadius: '16px' }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Batch Add Bar */}
      {batchSelectedIds.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0f172a',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '30px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 1000
        }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>
            📦 {batchSelectedIds.length} activit{batchSelectedIds.length > 1 ? 'ies' : 'y'} selected
          </span>
          <button
            type="button"
            onClick={() => setShowBatchModal(true)}
            style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '20px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
          >
            Add Selected to Trip &rarr;
          </button>
          <button
            type="button"
            onClick={() => setBatchSelectedIds([])}
            style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '13px' }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Batch Add Modal */}
      {showBatchModal && (
        <div className="modal-overlay" onClick={() => setShowBatchModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', width: '90%', padding: '24px', borderRadius: '20px' }}>
            <h3 style={{ marginTop: 0 }}>📦 Add {batchSelectedIds.length} Activities to Trip</h3>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Select the target trip and destination stop to add all selected activities simultaneously.
            </p>
            {userTrips.length === 0 ? (
              <p className="no-trips-text">
                No trips found. <a href="/trips/new">Create a trip first &rarr;</a>
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '16px 0' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>Select Trip:</label>
                  <select className="form-select" value={selectedTripId} onChange={(e) => handleTripChange(e.target.value)}>
                    {userTrips.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                {tripStops.length > 0 && (
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>Select Destination Stop:</label>
                    <select className="form-select" value={selectedStopId} onChange={(e) => setSelectedStopId(e.target.value)}>
                      {tripStops.map((s, idx) => (
                        <option key={s.id} value={s.id}>Stop #{idx + 1}: {s.cityName || s.city?.name || 'City Stop'}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
            {batchMsg && <p style={{ color: '#16a34a', fontWeight: 600, fontSize: '14px' }}>{batchMsg}</p>}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowBatchModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" disabled={batchAdding || !selectedStopId} onClick={handleConfirmBatchAdd}>
                {batchAdding ? 'Adding...' : `Confirm & Add (${batchSelectedIds.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map View Modal */}
      {showMapModal && (
        <div className="modal-overlay" onClick={() => setShowMapModal(false)} style={{ zIndex: 9999 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', width: '95%', padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                  🗺️ Interactive Discovered Activities Map ({visibleActivities.length} Pinned)
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Explore all filtered activities pinned on OpenStreetMap with Leaflet routing</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>
            <ErrorBoundary title="Map View Warning">
              <MapView generatedPlan={mapPlanFromActivities(visibleActivities)} />
            </ErrorBoundary>
          </div>
        </div>
      )}

      {/* 360 VR Landmark Preview Modal */}
      {selectedVRKey && (
        <LandmarkVRViewer landmarkKey={selectedVRKey} onClose={() => setSelectedVRKey(null)} />
      )}

      {/* Tour Booking Modal */}
      {bookingActivityName && (
        <TourBookingModal
          destinationName={bookingActivityName}
          onClose={() => setBookingActivityName(null)}
        />
      )}
    </div>
  );
}
