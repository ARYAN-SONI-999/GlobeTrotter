import { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import ReviewSection from '../components/ReviewSection';
import SafetyCard from '../components/SafetyCard';
import HotelPriceWidget from '../components/HotelPriceWidget';
import { useAuth } from '../context/AuthContext';
import AudioGuideButton from '../components/AudioGuideButton';
import LandmarkVRViewer from '../components/LandmarkVRViewer';
import TravelReelsModal from '../components/TravelReelsModal';
import TourBookingModal from '../components/TourBookingModal';
import VoicePlannerButton from '../components/VoicePlannerButton';
import ErrorBoundary from '../components/ErrorBoundary';
import MapView from '../components/MapView';
import WeatherWidget from '../components/WeatherWidget';
import TransitHub from '../components/TransitHub';

function mapPlanFromPlaces(placesList, destName = 'Explore') {
  if (!placesList || placesList.length === 0) return null;
  return {
    destination: { name: destName, country: 'India' },
    tripName: `${destName} Attractions Map`,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    totalDays: 1,
    days: [
      {
        dayNumber: 1,
        date: new Date().toISOString().split('T')[0],
        activities: placesList.slice(0, 15).map((p, idx) => ({
          id: p.id,
          name: p.name,
          category: p.category || 'Sightseeing',
          rating: p.rating || 4.8,
          imageUrl: p.imageUrl,
          address: p.cityName ? `${p.cityName}, ${p.cityCountry}` : p.address,
          slot: `Sight #${idx + 1}`
        }))
      }
    ]
  };
}

const SEASONAL_ADVISORY_MAP = {
  matheran: '🌤️ Oct–May & Monsoon',
  lonavala: '🌧️ Jul–Sep Monsoon',
  mahabaleshwar: '🍓 Oct–Apr (Strawberry)',
  jaipur: '👑 Oct–Mar (Winter)',
  udaipur: '✨ Oct–Mar (Lakeside)',
  jodhpur: '🏰 Oct–Mar (Winter)',
  jaisalmer: '🐪 Nov–Feb (Desert)',
  manali: '❄️ Dec–Feb & Summer',
  shimla: '❄️ Dec–Feb & Summer',
  dharamshala: '🌿 Sep–Jun (Hills)',
  rishikesh: '🧘 Sep–May (Rafting)',
  goa: '🏖️ Oct–Mar (Beaches)',
  kerala: '🌴 Sep–Mar (Lagoon)',
  coorg: '☕ Oct–May (Coffee)',
  hampi: '🏛️ Oct–Mar (Ruins)',
  ooty: '🌲 Year-Round Cool',
  varanasi: '🛕 Oct–Mar (Ganga)',
  agra: '🕌 Oct–Mar (Dawn)',
  ladakh: '🏔️ May–Sep (Passes)',
  darjeeling: '☕ Oct–Dec & Mar–May',
  gujarat: '⛺ Nov–Feb (Rann)',
  ahmedabad: '🕌 Nov–Feb',
  paris: '🗼 May–Sep (Spring)',
  tokyo: '🌸 Mar–May & Oct–Nov',
  bali: '🌺 Apr–Oct (Dry)',
  dubai: '🌆 Nov–Mar (Cool)',
  rome: '🏛️ Apr–Jun & Sep–Oct',
  singapore: '🦁 Year-Round'
};

function getSeasonalAdvisory(placeObj) {
  const name = (placeObj.cityName || placeObj.name || '').toLowerCase();
  for (const [key, text] of Object.entries(SEASONAL_ADVISORY_MAP)) {
    if (name.includes(key)) return text;
  }
  return '🌤️ Oct–Mar Best';
}

function getCrowdAdvisory(placeObj) {
  const name = ((placeObj.name || '') + ' ' + (placeObj.category || '')).toLowerCase();
  if (name.includes('aarti') || name.includes('fort') || name.includes('palace') || name.includes('taj') || name.includes('temple')) {
    return { level: 'Peak', badge: '🔴 Peak Hours (4–7 PM)', bestHour: '8:00 AM – 10:00 AM' };
  } else if (name.includes('lake') || name.includes('point') || name.includes('view') || name.includes('beach')) {
    return { level: 'Moderate', badge: '🟡 Moderate Crowds', bestHour: '6:30 AM – 9:00 AM' };
  } else {
    return { level: 'Low', badge: '🟢 Quiet & Peaceful', bestHour: '9:00 AM – 11:30 AM' };
  }
}

const CATEGORIES = [
  'All',
  'Landmark',
  'Cultural',
  'Food & Dining',
  'Nature & Outdoors',
  'Leisure',
  'Adventure'
];

export default function PlacesToVisit() {
  const { user } = useAuth();
  const [places, setPlaces] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState('info'); // 'info' | 'transit' | 'reviews' | 'hotels' | 'safety'
  const [selectedVRKey, setSelectedVRKey] = useState(null);
  const [showReelModal, setShowReelModal] = useState(false);
  const [bookingPlaceName, setBookingPlaceName] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  // New UI Enhancements State
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [quickFilter, setQuickFilter] = useState('all'); // 'all' | 'free' | 'top_rated'
  const [selectedCollection, setSelectedCollection] = useState('all'); // 'all' | 'hill_stations' | 'forts' | 'beaches' | 'spiritual' | 'nature'
  const [comparePlaceIds, setComparePlaceIds] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const toggleComparePlace = (e, placeId) => {
    if (e) e.stopPropagation();
    setComparePlaceIds((prev) => {
      if (prev.includes(placeId)) return prev.filter((id) => id !== placeId);
      if (prev.length >= 2) return [prev[1], placeId];
      return [...prev, placeId];
    });
  };

  // Batch Select & Add to Trip
  const [batchSelectedIds, setBatchSelectedIds] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchAdding, setBatchAdding] = useState(false);
  const [batchMsg, setBatchMsg] = useState('');
  const [shareSavedMsg, setShareSavedMsg] = useState('');

  // Saved / Bookmarked Places
  const [savedPlaceIds, setSavedPlaceIds] = useState(() => {
    try {
      const stored = localStorage.getItem('globetrotter_saved_places');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [sortBy, setSortBy] = useState('popularity'); // 'popularity' | 'rating' | 'duration_asc' | 'duration_desc'

  // Filters
  const [scope, setScope] = useState('domestic'); // 'domestic' | 'international' | 'all' | 'saved'
  const [search, setSearch] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState('');
  const [maxCost, setMaxCost] = useState('');

  // Place Detail & Add to Trip Modal
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [wikiPlaceData, setWikiPlaceData] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [tripStops, setTripStops] = useState([]);
  const [selectedStopId, setSelectedStopId] = useState('');
  const [addingToTrip, setAddingToTrip] = useState(false);
  const [addSuccessMsg, setAddSuccessMsg] = useState('');

  const toggleSavePlace = (e, placeId) => {
    if (e) e.stopPropagation();
    setSavedPlaceIds((prev) => {
      const isSaved = prev.includes(placeId);
      const next = isSaved ? prev.filter((id) => id !== placeId) : [...prev, placeId];
      try {
        localStorage.setItem('globetrotter_saved_places', JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

  const toggleBatchSelect = (e, placeId) => {
    if (e) e.stopPropagation();
    setBatchSelectedIds((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
    );
  };

  const handleConfirmBatchAdd = async () => {
    if (batchSelectedIds.length === 0 || !selectedStopId) return;
    setBatchAdding(true);
    setBatchMsg('');
    try {
      const selectedPlaces = places.filter((p) => batchSelectedIds.includes(p.id));
      for (const p of selectedPlaces) {
        await api.post(`/stops/${selectedStopId}/activities`, {
          name: p.name,
          type: p.category || 'Sightseeing',
          cost: p.cost || 0,
          duration: p.duration || 2,
          description: p.description || '',
          imageUrl: p.imageUrl || '',
          activityDate: null,
          startTime: p.bestTime === 'Evening' ? '07:00 PM' : '10:00 AM'
        });
      }
      setBatchMsg(`✓ Added ${selectedPlaces.length} places to your trip stop!`);
      setTimeout(() => {
        setBatchSelectedIds([]);
        setShowBatchModal(false);
        setBatchMsg('');
      }, 1800);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add places to trip.');
    } finally {
      setBatchAdding(false);
    }
  };

  const handleShareSavedCollection = async () => {
    const savedPlacesList = places.filter((p) => savedPlaceIds.includes(p.id));
    const namesText = savedPlacesList.map((p) => `• ${p.name} (${p.cityName || 'India'})`).join('\n');
    const shareText = `🌟 Check out my GlobeTrotter Travel Wishlist (${savedPlacesList.length} Sights):\n\n${namesText}\n\nPlan your trip at: ${window.location.origin}/places`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText).catch(() => {});
    }
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    setShareSavedMsg('✓ Wishlist copied & opened in WhatsApp!');
    setTimeout(() => setShareSavedMsg(''), 3000);
  };

  const sortedPlaces = useMemo(() => {
    let list = [...places];
    if (scope === 'saved') {
      list = list.filter((p) => savedPlaceIds.includes(p.id));
    }

    if (quickFilter === 'free') {
      list = list.filter((p) => p.cost === 0);
    } else if (quickFilter === 'top_rated') {
      list = list.filter((p) => (p.rating || 0) >= 4.8);
    }

    if (selectedCollection === 'hill_stations') {
      list = list.filter((p) => {
        const n = (p.cityName || p.name || '').toLowerCase();
        return n.includes('manali') || n.includes('shimla') || n.includes('matheran') || n.includes('lonavala') || n.includes('mahabaleshwar') || n.includes('ooty') || n.includes('coorg') || n.includes('darjeeling') || n.includes('dharamshala');
      });
    } else if (selectedCollection === 'forts') {
      list = list.filter((p) => {
        const n = (p.name || p.category || '').toLowerCase();
        return n.includes('fort') || n.includes('palace') || n.includes('mahal') || n.includes('heritage') || n.includes('jaipur') || n.includes('jodhpur') || n.includes('udaipur');
      });
    } else if (selectedCollection === 'beaches') {
      list = list.filter((p) => {
        const n = (p.cityName || p.name || '').toLowerCase();
        return n.includes('goa') || n.includes('kerala') || n.includes('beach') || n.includes('coast');
      });
    } else if (selectedCollection === 'spiritual') {
      list = list.filter((p) => {
        const n = (p.name || p.category || '').toLowerCase();
        return n.includes('temple') || n.includes('ghat') || n.includes('aarti') || n.includes('varanasi') || n.includes('rishikesh') || n.includes('hampi');
      });
    } else if (selectedCollection === 'nature') {
      list = list.filter((p) => (p.category || '').toLowerCase().includes('nature') || (p.name || '').toLowerCase().includes('lake') || (p.name || '').toLowerCase().includes('pass'));
    }

    if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'popularity') {
      list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else if (sortBy === 'duration_asc') {
      list.sort((a, b) => (a.duration || 0) - (b.duration || 0));
    } else if (sortBy === 'duration_desc') {
      list.sort((a, b) => (b.duration || 0) - (a.duration || 0));
    }
    return list;
  }, [places, scope, savedPlaceIds, sortBy, quickFilter, selectedCollection]);

  const fetchCities = async () => {
    try {
      const res = await api.get('/cities');
      setCities(res.data);
    } catch (err) {
      console.error('Failed to load cities:', err);
    }
  };

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const params = {};
      if (scope !== 'all' && scope !== 'saved') params.scope = scope;
      if (search) params.search = search;
      if (selectedCityId) params.cityId = selectedCityId;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (minRating) params.minRating = minRating;
      if (maxCost) params.maxCost = maxCost;

      const res = await api.get('/places', { params });
      setPlaces(res.data);
      if (search && search.trim().length >= 2) {
        fetchCities();
      }
    } catch (err) {
      console.error('Failed to load places:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTrips = async () => {
    try {
      const res = await api.get('/trips');
      setUserTrips(res.data);
      if (res.data.length > 0) {
        setSelectedTripId(res.data[0].id);
        fetchTripStops(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load trips:', err);
    }
  };

  const fetchTripStops = async (tripId) => {
    try {
      const res = await api.get(`/trips/${tripId}`);
      const stops = res.data.stops || [];
      setTripStops(stops);
      if (stops.length > 0) {
        setSelectedStopId(stops[0].id);
      } else {
        setSelectedStopId('');
      }
    } catch (err) {
      console.error('Failed to load trip stops:', err);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchUserTrips();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlaces();
    }, 200);
    return () => clearTimeout(timer);
  }, [scope, search, selectedCityId, selectedCategory, minRating, maxCost]);

  useEffect(() => {
    if (!selectedPlace) {
      setWikiPlaceData(null);
      return;
    }
    let isMounted = true;
    const query = selectedPlace.name || selectedPlace.cityName || '';
    api.get(`/external/wiki-summary?title=${encodeURIComponent(query)}`)
      .then((res) => {
        if (isMounted && res.data) setWikiPlaceData(res.data);
      })
      .catch(() => {
        if (isMounted) setWikiPlaceData(null);
      });
    return () => { isMounted = false; };
  }, [selectedPlace]);

  const handleTripChange = (e) => {
    const tId = e.target.value;
    setSelectedTripId(tId);
    fetchTripStops(tId);
  };

  const handleAddPlaceToTrip = async () => {
    if (!selectedPlace || !selectedStopId) return;
    setAddingToTrip(true);
    setAddSuccessMsg('');
    try {
      await api.post(`/stops/${selectedStopId}/activities`, {
        name: selectedPlace.name,
        type: selectedPlace.category || 'Sightseeing',
        cost: selectedPlace.cost || 0,
        duration: selectedPlace.duration || 2,
        description: selectedPlace.description || '',
        imageUrl: selectedPlace.imageUrl || '',
        activityDate: null,
        startTime: selectedPlace.bestTime === 'Evening' ? '07:00 PM' : '10:00 AM'
      });
      setAddSuccessMsg(`Added "${selectedPlace.name}" to your trip!`);
      setTimeout(() => {
        setAddSuccessMsg('');
      }, 3000);
    } catch (err) {
      console.error('Error adding activity:', err);
    } finally {
      setAddingToTrip(false);
    }
  };

  const indianCities = cities.filter((c) => c.country.toLowerCase() === 'india' || c.region.toLowerCase().includes('india'));
  const internationalCities = cities.filter((c) => c.country.toLowerCase() !== 'india' && !c.region.toLowerCase().includes('india'));

  return (
    <div className="page-container places-explorer-page">
      {/* Hero Banner Header */}
      <div
        className="places-hero-banner"
        style={{
          background:
            'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 58, 138, 0.82) 50%, rgba(14, 165, 233, 0.78) 100%), url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80") center center / cover no-repeat',
          borderRadius: '24px',
          padding: '36px 36px',
          marginBottom: '28px',
          color: 'white',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}
      >
        <div style={{ maxWidth: '680px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              padding: '5px 14px',
              borderRadius: '30px',
              fontSize: '0.82rem',
              fontWeight: 800,
              marginBottom: '14px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.02em'
            }}
          >
            📍 Curated Attractions, Forts, Viewpoints &amp; Food Hotspots
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'white', margin: '0 0 10px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            Explore Places to Visit
          </h1>
          <p style={{ fontSize: '1.02rem', color: 'rgba(241, 245, 249, 0.95)', margin: 0, lineHeight: 1.6 }}>
            Discover top-rated sights, heritage monuments, scenic hill stations, and hidden gems with authentic ratings, 360° VR previews &amp; instant AI planning.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
              fontSize: '0.92rem',
              border: 'none',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🗺️ Interactive Map ({sortedPlaces.length})
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setBookingPlaceName(scope === 'domestic' ? 'Matheran' : 'Paris')}
            style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              color: 'white',
              fontWeight: 800,
              padding: '12px 22px',
              borderRadius: '30px',
              fontSize: '0.92rem',
              border: 'none',
              boxShadow: '0 8px 20px rgba(22, 163, 74, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🎟️ Book Tour Package
          </button>
        </div>
      </div>

      {/* Prominent Scope Navigation Tabs */}
      <div className="places-scope-tabs">
        <button
          type="button"
          className={`scope-tab-pill ${scope === 'domestic' ? 'active' : ''}`}
          onClick={() => {
            setScope('domestic');
            setSelectedCityId('');
          }}
        >
          <span>🇮🇳 Domestic Places (India)</span>
          <span className="scope-count">({indianCities.length} Regions)</span>
        </button>
        <button
          type="button"
          className={`scope-tab-pill ${scope === 'international' ? 'active' : ''}`}
          onClick={() => {
            setScope('international');
            setSelectedCityId('');
          }}
        >
          <span>🌐 International Places</span>
          <span className="scope-count">({internationalCities.length} Cities)</span>
        </button>
        <button
          type="button"
          className={`scope-tab-pill ${scope === 'all' ? 'active' : ''}`}
          onClick={() => {
            setScope('all');
            setSelectedCityId('');
          }}
        >
          <span>🌍 All Places Worldwide</span>
        </button>
        <button
          type="button"
          className={`scope-tab-pill ${scope === 'saved' ? 'active' : ''}`}
          onClick={() => {
            setScope('saved');
            setSelectedCityId('');
          }}
          style={{
            background: scope === 'saved' ? 'linear-gradient(135deg, #be185d, #9d174d)' : undefined,
            color: scope === 'saved' ? 'white' : undefined,
            borderColor: scope === 'saved' ? '#9d174d' : undefined
          }}
        >
          <span>❤️ Saved Favorites</span>
          <span className="scope-count">({savedPlaceIds.length})</span>
        </button>
      </div>

      {scope === 'saved' && savedPlaceIds.length > 0 && (
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', background: '#fdf2f8', padding: '12px 20px', borderRadius: '16px', border: '1px solid #fbcfe8', boxShadow: '0 4px 12px rgba(190, 24, 93, 0.06)' }}>
          <button
            type="button"
            onClick={handleShareSavedCollection}
            style={{ background: 'linear-gradient(135deg, #25d366, #16a34a)', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '20px', fontWeight: 800, cursor: 'pointer', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)' }}
          >
            📤 Share Wishlist on WhatsApp
          </button>
          {shareSavedMsg ? (
            <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '13.5px' }}>{shareSavedMsg}</span>
          ) : (
            <span style={{ color: '#be185d', fontSize: '13.5px', fontWeight: 600 }}>Share your {savedPlaceIds.length} saved favorite places directly with travel companions!</span>
          )}
        </div>
      )}

      {/* Travel Collections Quick Bar */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', padding: '16px 22px', borderRadius: '22px', marginBottom: '22px', boxShadow: '0 8px 24px rgba(15,23,42,0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#38bdf8', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ✨ Curated Theme Collections
          </span>
          {selectedCollection !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCollection('all')}
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '3px 10px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
            >
              Reset Theme ✕
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: '🌍 All Sights' },
            { id: 'hill_stations', label: '🍓 Hill Station Retreats' },
            { id: 'forts', label: '🏰 Royal Forts & Palaces' },
            { id: 'beaches', label: '🏖️ Coastal Escapes' },
            { id: 'spiritual', label: '🛕 Spiritual Ghats & Temples' },
            { id: 'nature', label: '🌿 Nature & Eco Sights' }
          ].map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => setSelectedCollection(col.id)}
              style={{
                background: selectedCollection === col.id ? 'linear-gradient(135deg, #38bdf8, #0284c7)' : 'rgba(255,255,255,0.08)',
                color: selectedCollection === col.id ? '#0f172a' : 'white',
                border: selectedCollection === col.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.15)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: selectedCollection === col.id ? '0 4px 12px rgba(56, 189, 248, 0.3)' : 'none'
              }}
            >
              {col.label}
            </button>
          ))}
        </div>
      </div>

      {/* Glassmorphic Search & Filter Container */}
      <div className="places-filter-bar" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', padding: '20px 24px', borderRadius: '22px', border: '1px solid rgba(226, 232, 240, 0.9)', boxShadow: '0 10px 30px rgba(15,23,42,0.06)', marginBottom: '22px' }}>
        <div className="search-input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            className="search-input"
            placeholder={scope === 'domestic' ? 'Search Indian places, forts, lakes, ghats, temples, chikki...' : 'Search attractions, museums, food...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '12px 18px', borderRadius: '14px', fontSize: '0.95rem' }}
          />
          <VoicePlannerButton
            onSpeechResult={(spokenText) => {
              setSearch(spokenText);
            }}
          />
        </div>

        <div className="filter-selects-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ borderRadius: '14px', padding: '12px 16px', fontSize: '0.9rem' }}
          >
            <option value="popularity">Sort by: Most Popular</option>
            <option value="rating">Sort by: Highest Rating (★)</option>
            <option value="duration_asc">Sort by: Duration (Shortest)</option>
            <option value="duration_desc">Sort by: Duration (Longest)</option>
          </select>

          <select
            className="filter-select"
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            style={{ borderRadius: '14px', padding: '12px 16px', fontSize: '0.9rem' }}
          >
            <option value="">{scope === 'domestic' ? 'All Indian Destinations' : (scope === 'international' ? 'All International Cities' : 'All Destinations')}</option>
            {scope !== 'international' && (
              <optgroup label="🇮🇳 Domestic (India)">
                {indianCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}, India
                  </option>
                ))}
              </optgroup>
            )}
            {scope !== 'domestic' && (
              <optgroup label="🌐 International">
                {internationalCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}, {city.country}
                  </option>
                ))}
              </optgroup>
            )}
          </select>

          <select
            className="filter-select"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            style={{ borderRadius: '14px', padding: '12px 16px', fontSize: '0.9rem' }}
          >
            <option value="">Any Rating</option>
            <option value="4.5">★ 4.5 & Above</option>
            <option value="4.8">★ 4.8 & Above</option>
          </select>

          <select
            className="filter-select"
            value={maxCost}
            onChange={(e) => setMaxCost(e.target.value)}
            style={{ borderRadius: '14px', padding: '12px 16px', fontSize: '0.9rem' }}
          >
            <option value="">Any Entry Fee</option>
            <option value="0">Free Entry</option>
            <option value="200">Under ₹200</option>
            <option value="500">Under ₹500</option>
            <option value="1500">Under ₹1,500</option>
          </select>
        </div>

        {/* Quick Filter Pills & View Mode Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '16px', pt: '14px', borderTop: '1px border #f1f5f9' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>Quick Filter:</span>
            {[
              { id: 'all', label: '✨ All' },
              { id: 'free', label: '💵 Free Entry Only' },
              { id: 'top_rated', label: '⭐ Top Rated (4.8+)' }
            ].map((pf) => (
              <button
                key={pf.id}
                type="button"
                onClick={() => setQuickFilter(pf.id)}
                style={{
                  background: quickFilter === pf.id ? '#0284c7' : '#f1f5f9',
                  color: quickFilter === pf.id ? 'white' : '#475569',
                  border: 'none',
                  padding: '5px 14px',
                  borderRadius: '16px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  boxShadow: quickFilter === pf.id ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {pf.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '4px', background: '#e2e8f0', padding: '3px', borderRadius: '14px' }}>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? '#2563eb' : 'transparent',
                color: viewMode === 'grid' ? 'white' : '#475569',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '11px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'grid' ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none'
              }}
            >
              📱 Grid View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? '#2563eb' : 'transparent',
                color: viewMode === 'list' ? 'white' : '#475569',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '11px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'list' ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none'
              }}
            >
              📜 List View
            </button>
          </div>
        </div>
      </div>

      {/* Popular Holiday Destination Quick Chips (in Domestic Mode) */}
      {scope === 'domestic' && indianCities.length > 0 && (
        <div className="holiday-destinations-quick-bar" style={{ borderRadius: '18px', padding: '14px 18px', marginBottom: '22px' }}>
          <span className="quick-label" style={{ fontSize: '0.88rem', fontWeight: 800 }}>🌟 Popular Holiday Getaways:</span>
          <div className="quick-chips-scroll">
            <button
              type="button"
              className={`quick-chip ${!selectedCityId ? 'active' : ''}`}
              onClick={() => setSelectedCityId('')}
            >
              🇮🇳 All Domestic ({places.length})
            </button>
            {indianCities.map((city) => (
              <button
                key={city.id}
                type="button"
                className={`quick-chip ${selectedCityId === city.id ? 'active' : ''}`}
                onClick={() => setSelectedCityId(city.id)}
              >
                📍 {city.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Pills Bar */}
      <div className="category-pills-bar" style={{ marginBottom: '26px' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
            style={{ padding: '8px 18px', borderRadius: '20px', fontWeight: 700, fontSize: '0.88rem' }}
          >
            {cat === 'All' ? '✨ All Sights' : cat}
          </button>
        ))}
      </div>

      {/* Places Cards Grid */}
      {loading ? (
        <div className="places-loading-grid">
          <div className="spinner-sm"></div>
          <span>Loading curated attractions...</span>
        </div>
      ) : sortedPlaces.length === 0 ? (
        <div className="empty-places-state" style={{ padding: '60px 24px', background: 'white', borderRadius: '24px', textAlign: 'center' }}>
          <span className="empty-icon" style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>📍</span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{scope === 'saved' ? 'No saved favorite places yet' : 'No matching places found'}</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '480px', margin: '8px auto 20px' }}>{scope === 'saved' ? 'Click the ❤️ icon on any place card to bookmark it for quick access.' : 'Try clearing your search query or choosing a different destination filter.'}</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setSearch('');
              setSelectedCityId('');
              setSelectedCategory('All');
              setMinRating('');
              setMaxCost('');
              setScope('all');
            }}
            style={{ borderRadius: '20px', padding: '10px 22px', fontWeight: 700 }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === 'list' ? 'places-list-container' : 'places-grid'} style={viewMode === 'list' ? { display: 'flex', flexDirection: 'column', gap: '18px' } : undefined}>
          {sortedPlaces.map((place) => {
            const isComparing = comparePlaceIds.includes(place.id);
            const isSaved = savedPlaceIds.includes(place.id);
            const isBatchSelected = batchSelectedIds.includes(place.id);

            if (viewMode === 'list') {
              return (
                <div
                  key={place.id}
                  className="place-card-list-item"
                  onClick={() => setSelectedPlace(place)}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    background: 'white',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(15,23,42,0.04)',
                    transition: 'all 0.25s ease',
                    minHeight: '220px'
                  }}
                >
                  <div style={{ width: '280px', minWidth: '280px', position: 'relative', overflow: 'hidden' }}>
                    <input
                      type="checkbox"
                      checked={isBatchSelected}
                      onChange={(e) => toggleBatchSelect(e, place.id)}
                      onClick={(e) => e.stopPropagation()}
                      title="Select to add to trip"
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
                      src={place.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80'}
                      alt={place.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={(e) => toggleSavePlace(e, place.id)}
                      title={isSaved ? "Remove from Saved Favorites" : "Save to Favorites"}
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
                    <span className="place-category-pill" style={{ position: 'absolute', top: '12px', left: '44px' }}>{place.category}</span>
                    <button
                      type="button"
                      onClick={(e) => toggleComparePlace(e, place.id)}
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: isComparing ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(15,23,42,0.75)',
                        color: 'white',
                        border: isComparing ? '1px solid #a78bfa' : 'none',
                        borderRadius: '16px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        zIndex: 3,
                        backdropFilter: 'blur(6px)'
                      }}
                    >
                      {isComparing ? '✓ Comparing' : '⚖️ Compare'}
                    </button>
                  </div>

                  <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' }}>
                        <div>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{place.name}</h3>
                          <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.88rem' }}>
                            📍 {place.cityName ? `${place.cityName}, ${place.cityCountry}` : place.address}
                          </span>
                        </div>
                        <span style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', border: '1px solid #fde68a', color: '#d97706', padding: '4px 12px', borderRadius: '16px', fontWeight: 800, fontSize: '0.9rem' }}>
                          ★ {place.rating}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: '8px 0 12px' }}>{place.description}</p>
                    </div>

                    <div>
                      <div style={{ display: 'flex', gap: '6px', margin: '10px 0', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                        <AudioGuideButton
                          placeName={place.name}
                          description={place.description}
                          insiderTip={place.insiderTip}
                          category={place.category}
                        />
                        <button
                          type="button"
                          onClick={() => setSelectedVRKey(place.name)}
                          style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          🥽 360° VR
                        </button>
                        <a
                          href={`/planner?dest=${encodeURIComponent(place.cityName || place.name)}&auto=1`}
                          style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          ⚡ Auto-Plan
                        </a>
                        <button
                          type="button"
                          onClick={() => setShowReelModal(true)}
                          style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          🎬 Reel
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingPlaceName(place.name)}
                          style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          🎟️ Book
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '10px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '8px' }}>📍 Visitor Attraction</span>
                        <span style={{ fontSize: '0.78rem', color: '#0369a1', fontWeight: 700, background: '#e0f2fe', padding: '3px 10px', borderRadius: '14px' }}>
                          {getSeasonalAdvisory(place)}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>⏳ ~{place.duration}h</span>
                        <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>View Details &rarr;</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={place.id}
                className="place-card"
                onClick={() => setSelectedPlace(place)}
              >
                <div className="place-card-image-wrap" style={{ position: 'relative' }}>
                  <input
                    type="checkbox"
                    checked={isBatchSelected}
                    onChange={(e) => toggleBatchSelect(e, place.id)}
                    onClick={(e) => e.stopPropagation()}
                    title="Select to add to trip"
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
                    src={place.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80'}
                    alt={place.name}
                    className="place-card-image"
                  />
                  <button
                    type="button"
                    onClick={(e) => toggleSavePlace(e, place.id)}
                    title={isSaved ? "Remove from Saved Favorites" : "Save to Favorites"}
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
                      backdropFilter: 'blur(6px)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}
                  >
                    {isSaved ? '❤️' : '🤍'}
                  </button>

                  <span className="place-category-pill" style={{ position: 'absolute', top: '12px', left: '44px' }}>{place.category}</span>
                  {place.cityCountry?.toLowerCase() === 'india' && (
                    <span className="place-domestic-pill">🇮🇳 India Domestic</span>
                  )}
                  <span className="place-rating-badge" style={{ position: 'absolute', top: '12px', right: '54px' }}>★ {place.rating}</span>

                  <button
                    type="button"
                    onClick={(e) => toggleComparePlace(e, place.id)}
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      background: isComparing ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(15,23,42,0.75)',
                      color: 'white',
                      border: isComparing ? '1px solid #a78bfa' : 'none',
                      borderRadius: '16px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      zIndex: 3,
                      backdropFilter: 'blur(6px)'
                    }}
                  >
                    {isComparing ? '✓ Comparing' : '⚖️ Compare'}
                  </button>
                </div>

                <div className="place-card-body">
                  <h3 className="place-card-name" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{place.name}</h3>
                  <span className="place-card-city" style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.85rem' }}>
                    📍 {place.cityName ? `${place.cityName}, ${place.cityCountry}` : place.address}
                  </span>

                  <div style={{ display: 'flex', gap: '6px', margin: '10px 0', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                    <AudioGuideButton
                      placeName={place.name}
                      description={place.description}
                      insiderTip={place.insiderTip}
                      category={place.category}
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedVRKey(place.name)}
                      style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)' }}
                    >
                      🥽 360° VR
                    </button>
                    <a
                      href={`/planner?dest=${encodeURIComponent(place.cityName || place.name)}&auto=1`}
                      className="btn-auto-plan-chip"
                      style={{
                        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        color: 'white',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
                      }}
                    >
                      ⚡ Auto-Plan
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowReelModal(true)}
                      style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 6px rgba(236, 72, 153, 0.25)' }}
                    >
                      🎬 Reel
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingPlaceName(place.name)}
                      style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)' }}
                    >
                      🎟️ Book
                    </button>
                  </div>

                  <p className="place-card-desc" style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>{place.description}</p>

                  <div className="place-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '10px' }}>
                    <span className="place-cost" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '8px' }}>📍 Visitor Attraction</span>
                    <span style={{ fontSize: '0.78rem', color: '#0369a1', fontWeight: 700, background: '#e0f2fe', padding: '3px 10px', borderRadius: '14px' }}>
                      {getSeasonalAdvisory(place)}
                    </span>
                    <span className="place-duration" style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>⏳ ~{place.duration}h</span>
                    <span className="btn-view-details" style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>View Details &rarr;</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Place Detail & Add to Itinerary Modal */}
      {selectedPlace && (
        <div className="modal-overlay" onClick={() => setSelectedPlace(null)}>
          <div className="modal-content place-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="place-modal-image-wrap">
              <img
                src={selectedPlace.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'}
                alt={selectedPlace.name}
                className="place-modal-image"
              />
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setSelectedPlace(null)}
              >
                ✕
              </button>
            </div>

            <div className="place-modal-body">
              {/* Modal Navigation Tabs */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', paddingBottom: '12px', overflowX: 'auto', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('info')}
                  style={{
                    background: activeDetailTab === 'info' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f1f5f9',
                    color: activeDetailTab === 'info' ? 'white' : '#475569',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                    boxShadow: activeDetailTab === 'info' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ℹ️ Overview &amp; Weather
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('transit')}
                  style={{
                    background: activeDetailTab === 'transit' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f1f5f9',
                    color: activeDetailTab === 'transit' ? 'white' : '#475569',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                    boxShadow: activeDetailTab === 'transit' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🚂 How to Reach / Transit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('reviews')}
                  style={{
                    background: activeDetailTab === 'reviews' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f1f5f9',
                    color: activeDetailTab === 'reviews' ? 'white' : '#475569',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                    boxShadow: activeDetailTab === 'reviews' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ⭐ Reviews &amp; Photos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('hotels')}
                  style={{
                    background: activeDetailTab === 'hotels' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f1f5f9',
                    color: activeDetailTab === 'hotels' ? 'white' : '#475569',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                    boxShadow: activeDetailTab === 'hotels' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🏨 Stay &amp; Hotel Prices
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('safety')}
                  style={{
                    background: activeDetailTab === 'safety' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f1f5f9',
                    color: activeDetailTab === 'safety' ? 'white' : '#475569',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                    boxShadow: activeDetailTab === 'safety' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🚨 Safety Guide
                </button>
              </div>

              {activeDetailTab === 'info' && (
                <>
                  <div className="place-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', marginBottom: '8px' }}>
                        {selectedPlace.category}
                      </span>
                      <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 6px', lineHeight: 1.25 }}>
                        {selectedPlace.name}
                      </h2>
                      <span className="place-modal-location" style={{ color: '#0284c7', fontWeight: 600, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📍 {selectedPlace.cityName ? `${selectedPlace.cityName}, ${selectedPlace.cityCountry}` : selectedPlace.address}
                      </span>
                    </div>
                    <div className="place-modal-rating" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', border: '1px solid #fde68a', padding: '8px 16px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.12)', minWidth: '110px' }}>
                      <span className="rating-num" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>★ {selectedPlace.rating}</span>
                      <span className="rating-count" style={{ fontSize: '0.78rem', color: '#92400e', fontWeight: 600, marginTop: '2px' }}>({selectedPlace.reviewsCount || 1200} reviews)</span>
                    </div>
                  </div>

                  <p className="place-modal-desc" style={{ fontSize: '0.98rem', lineHeight: 1.65, color: '#334155', margin: '18px 0 20px', background: '#f8fafc', padding: '14px 18px', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                    {selectedPlace.description}
                  </p>

                  {/* Live Weather Integration */}
                  <div style={{ marginBottom: '20px' }}>
                    <WeatherWidget
                      destinationName={selectedPlace.cityName || selectedPlace.name}
                      destinationKey={selectedPlace.cityName || selectedPlace.name}
                    />
                  </div>

                  {/* Key Highlights */}
                  <div className="place-highlights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                    <div className="highlight-item" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #e2e8f0', padding: '14px 16px', borderRadius: '14px' }}>
                      <span className="h-label" style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>💵 Estimated Cost</span>
                      <span className="h-val" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669' }}>{selectedPlace.cost === 0 ? '✨ Free Entry' : `₹${selectedPlace.cost}`}</span>
                    </div>
                    <div className="highlight-item" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #e2e8f0', padding: '14px 16px', borderRadius: '14px' }}>
                      <span className="h-label" style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>⏳ Suggested Time</span>
                      <span className="h-val" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>~{selectedPlace.duration || 2} Hours</span>
                    </div>
                    <div className="highlight-item" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #e2e8f0', padding: '14px 16px', borderRadius: '14px' }}>
                      <span className="h-label" style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>☀️ Optimal Time</span>
                      <span className="h-val" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0284c7' }}>{selectedPlace.bestTime || 'Morning'}</span>
                    </div>
                  </div>

                  {/* Direct GPS Google Maps Link */}
                  <div style={{ marginBottom: '20px' }}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.name + ' ' + (selectedPlace.cityName || ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: 'white', padding: '10px 18px', borderRadius: '14px', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)' }}
                    >
                      🗺️ Open GPS Live Navigation in Google Maps &rarr;
                    </a>
                  </div>

                  {/* Insider Tip Box */}
                  {selectedPlace.insiderTip && (
                    <div className="place-insider-tip-box" style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', border: '1px solid #fde68a', borderLeft: '5px solid #f59e0b', padding: '16px 20px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.08)' }}>
                      <span className="tip-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#b45309', fontWeight: 800, fontSize: '0.82rem', padding: '4px 10px', borderRadius: '20px', marginBottom: '8px', border: '1px solid #fde68a' }}>💡 AI Insider Tip</span>
                      <p style={{ color: '#92400e', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{selectedPlace.insiderTip}</p>
                    </div>
                  )}

                  {/* Live Wikipedia Knowledge Card */}
                  {wikiPlaceData && (
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {wikiPlaceData.thumbnailUrl && (
                        <img
                          src={wikiPlaceData.thumbnailUrl}
                          alt={wikiPlaceData.title}
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        />
                      )}
                      <div style={{ flex: '1 1 240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', background: '#0284c7', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                            📚 Wikipedia Live Guide
                          </span>
                          <strong style={{ fontSize: '14px', color: '#0f172a' }}>{wikiPlaceData.title}</strong>
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                          {wikiPlaceData.extract?.length > 250 ? `${wikiPlaceData.extract.slice(0, 250)}...` : wikiPlaceData.extract}
                        </p>
                        {wikiPlaceData.pageUrl && (
                          <a
                            href={wikiPlaceData.pageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}
                          >
                            Explore historical encyclopedia article ↗
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Add to Itinerary Section */}
                  <div className="add-to-trip-section" style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                    <h4 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      ➕ Add this place to your trip itinerary
                    </h4>

                    {userTrips.length === 0 ? (
                      <div style={{ background: '#f0f9ff', border: '1px dashed #0284c7', padding: '16px 20px', borderRadius: '14px', marginTop: '12px' }}>
                        <p className="no-trips-text" style={{ margin: 0, color: '#0369a1', fontWeight: 600, fontSize: '0.92rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                          <span>You don't have any saved trips created yet.</span>
                          <a href="/create-trip" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none' }}>Create a Trip First &rarr;</a>
                        </p>
                      </div>
                    ) : (
                      <div className="add-to-trip-form">
                        <div className="form-group">
                          <label>Select Trip:</label>
                          <select
                            className="form-select"
                            value={selectedTripId}
                            onChange={handleTripChange}
                          >
                            {userTrips.map((t) => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        </div>

                        {tripStops.length > 0 && (
                          <div className="form-group">
                            <label>Select Destination Stop:</label>
                            <select
                              className="form-select"
                              value={selectedStopId}
                              onChange={(e) => setSelectedStopId(e.target.value)}
                            >
                              {tripStops.map((s) => (
                                <option key={s.id} value={s.id}>Stop #{s.stopOrder + 1}: {s.cityName || s.city?.name || 'City Stop'}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="modal-actions-bar" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={addingToTrip || !selectedStopId}
                            onClick={handleAddPlaceToTrip}
                          >
                            {addingToTrip ? 'Adding...' : '➕ Add to My Trip'}
                          </button>

                          <button
                            type="button"
                            className="btn"
                            onClick={() => {
                              const destName = selectedPlace.cityName || selectedPlace.name;
                              setSelectedPlace(null);
                              setBookingPlaceName(destName);
                            }}
                            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', fontWeight: 700, border: 'none' }}
                          >
                            🎟️ Book Tour Package
                          </button>

                          <a
                            href={`/planner?dest=${encodeURIComponent(selectedPlace.cityName || selectedPlace.name)}`}
                            className="btn"
                            style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', fontWeight: 700, border: 'none', textDecoration: 'none' }}
                          >
                            ⚡ Auto-Plan Full Trip
                          </a>

                          {addSuccessMsg && (
                            <span className="add-success-text">✓ {addSuccessMsg}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeDetailTab === 'transit' && (
                <TransitHub
                  destinationKey={selectedPlace.cityName || selectedPlace.name}
                  destinationName={selectedPlace.cityName || selectedPlace.name}
                />
              )}

              {activeDetailTab === 'reviews' && (
                <ReviewSection
                  destinationKey={selectedPlace.cityName || selectedPlace.name}
                  destinationName={selectedPlace.name}
                  currentUser={user}
                />
              )}

              {activeDetailTab === 'hotels' && (
                <HotelPriceWidget
                  destinationName={selectedPlace.cityName || selectedPlace.name}
                  destinationKey={selectedPlace.cityName || selectedPlace.name}
                />
              )}

              {activeDetailTab === 'safety' && (
                <SafetyCard
                  destinationName={selectedPlace.cityName || selectedPlace.name}
                  state="India"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 360 VR Landmark Preview Modal */}
      {selectedVRKey && (
        <LandmarkVRViewer landmarkKey={selectedVRKey} onClose={() => setSelectedVRKey(null)} />
      )}

      {/* Travel Reels Modal */}
      {showReelModal && (
        <TravelReelsModal onClose={() => setShowReelModal(false)} />
      )}

      {/* Tour Package Booking Modal */}
      {bookingPlaceName && (
        <TourBookingModal destinationName={bookingPlaceName} onClose={() => setBookingPlaceName(null)} />
      )}

      {/* Interactive Map View Modal */}
      {showMapModal && (
        <div className="modal-overlay" onClick={() => setShowMapModal(false)} style={{ zIndex: 9999 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', width: '95%', padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                  🗺️ Interactive Places &amp; Attractions Map ({sortedPlaces.length} Pinned)
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Explore all filtered sights pinned on OpenStreetMap with direct Google Maps GPS navigation links</span>
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
              <MapView generatedPlan={mapPlanFromPlaces(sortedPlaces, selectedCityId ? (cities.find((c) => c.id === selectedCityId)?.name || 'Explore') : 'Explore')} />
            </ErrorBoundary>
          </div>
        </div>
      )}

      {/* Floating Compare Bar */}
      {comparePlaceIds.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: batchSelectedIds.length > 0 ? '84px' : '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 1001,
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>
            ⚖️ Compare ({comparePlaceIds.length}/2 Places Selected)
          </span>
          <button
            type="button"
            disabled={comparePlaceIds.length < 2}
            onClick={() => setShowCompareModal(true)}
            style={{
              background: comparePlaceIds.length === 2 ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : '#64748b',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '20px',
              fontWeight: 800,
              cursor: comparePlaceIds.length === 2 ? 'pointer' : 'not-allowed',
              fontSize: '0.84rem'
            }}
          >
            {comparePlaceIds.length === 2 ? 'Compare Side-by-Side ⚡' : 'Select 1 More Place to Compare'}
          </button>
          <button
            type="button"
            onClick={() => setComparePlaceIds([])}
            style={{ background: 'transparent', color: '#cbd5e1', border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Side-by-Side Compare Modal */}
      {showCompareModal && comparePlaceIds.length === 2 && (
        <div className="modal-overlay" onClick={() => setShowCompareModal(false)} style={{ zIndex: 10000 }}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '920px', width: '95%', padding: '24px', borderRadius: '24px', background: 'white' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                  ⚖️ Side-by-Side Place Comparison
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Comparing crowd levels, entry costs, duration, ratings & optimal visit hours</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontWeight: 800, fontSize: '16px' }}
              >
                ✕
              </button>
            </div>

            {(() => {
              const p1 = places.find((p) => p.id === comparePlaceIds[0]);
              const p2 = places.find((p) => p.id === comparePlaceIds[1]);
              if (!p1 || !p2) return null;

              const c1 = getCrowdAdvisory(p1);
              const c2 = getCrowdAdvisory(p2);

              return (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {[p1, p2].map((p, idx) => {
                    const crowd = idx === 0 ? c1 : c2;
                    return (
                      <div
                        key={p.id}
                        style={{
                          background: '#f8fafc',
                          borderRadius: '20px',
                          padding: '20px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px'
                        }}
                      >
                        <div style={{ height: '180px', borderRadius: '14px', overflow: 'hidden', position: 'relative' }}>
                          <img
                            src={p.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80'}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(15,23,42,0.85)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                            Place #{idx + 1}
                          </span>
                          <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>
                            ★ {p.rating}
                          </span>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{p.category}</span>
                          <h4 style={{ margin: '4px 0 2px', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{p.name}</h4>
                          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>📍 {p.cityName ? `${p.cityName}, ${p.cityCountry}` : p.address}</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div style={{ background: 'white', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>💵 ENTRY FEE</span>
                            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>{p.cost === 0 ? 'Free Entry' : `₹${p.cost}`}</span>
                          </div>
                          <div style={{ background: 'white', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block' }}>⏳ DURATION</span>
                            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>~{p.duration || 2} Hours</span>
                          </div>
                        </div>

                        <div style={{ background: 'white', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '2px' }}>👥 LIVE CROWD &amp; BEST HOUR</span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>{crowd.badge}</span>
                          <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700 }}>Best visit: {crowd.bestHour}</span>
                        </div>

                        <div style={{ background: 'white', padding: '10px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '2px' }}>☀️ OPTIMAL SEASON</span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1' }}>{getSeasonalAdvisory(p)}</span>
                        </div>

                        {p.insiderTip && (
                          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 12px', borderRadius: '12px', fontSize: '0.8rem', color: '#92400e' }}>
                            <strong style={{ display: 'block', marginBottom: '2px', color: '#b45309' }}>💡 Insider Tip:</strong>
                            {p.insiderTip}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setShowCompareModal(false);
                            setSelectedPlace(p);
                          }}
                          style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', padding: '10px', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', marginTop: 'auto' }}
                        >
                          View Details &amp; Add to Trip &rarr;
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
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
            📦 {batchSelectedIds.length} place{batchSelectedIds.length > 1 ? 's' : ''} selected
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', width: '90%', padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ marginTop: 0 }}>📦 Add {batchSelectedIds.length} Places to Trip</h3>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Select the target trip and destination stop to add all selected attractions simultaneously.
            </p>
            {userTrips.length === 0 ? (
              <p className="no-trips-text">
                No trips found. <a href="/create-trip">Create a trip first &rarr;</a>
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '16px 0' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>Select Trip:</label>
                  <select className="form-select" value={selectedTripId} onChange={handleTripChange}>
                    {userTrips.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                {tripStops.length > 0 && (
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>Select Destination Stop:</label>
                    <select className="form-select" value={selectedStopId} onChange={(e) => setSelectedStopId(e.target.value)}>
                      {tripStops.map((s) => (
                        <option key={s.id} value={s.id}>Stop #{s.stopOrder + 1}: {s.cityName || s.city?.name || 'City Stop'}</option>
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
    </div>
  );
}
