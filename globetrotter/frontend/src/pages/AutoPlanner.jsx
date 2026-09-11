import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import PackingListModal from '../components/PackingListModal';
import MapView from '../components/MapView';
import PdfExportButton from '../components/PdfExportButton';
import WeatherWidget from '../components/WeatherWidget';
import TransitHub from '../components/TransitHub';
import HotelPriceWidget from '../components/HotelPriceWidget';
import SafetyCard from '../components/SafetyCard';
import AudioGuideButton from '../components/AudioGuideButton';
import ExpenseSplitter from '../components/ExpenseSplitter';
import ShareTripModal from '../components/ShareTripModal';
import VoicePlannerButton from '../components/VoicePlannerButton';
import LandmarkVRViewer from '../components/LandmarkVRViewer';
import BudgetPieChart from '../components/BudgetPieChart';
import OutfitRecommender from '../components/OutfitRecommender';
import MultiCityChainPlanner from '../components/MultiCityChainPlanner';
import PassportStamps from '../components/PassportStamps';
import CurrencyConverterWidget from '../components/CurrencyConverterWidget';
import TourBookingModal from '../components/TourBookingModal';
import DestinationCompareModal from '../components/DestinationCompareModal';
import TravelQuizModal from '../components/TravelQuizModal';
import ErrorBoundary from '../components/ErrorBoundary';


const DOMESTIC_PRESETS = [
  { name: 'Matheran', country: 'India', days: 2, cover: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&q=80', vibe: 'Automobile-Free Hills & Lake', agencyBadge: 'MakeMyTrip Eco Choice' },
  { name: 'Lonavala', country: 'India', days: 2, cover: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=600&q=80', vibe: 'Tiger Leap & Waterfalls', agencyBadge: 'Top Monsoon Getaway' },
  { name: 'Mahabaleshwar', country: 'India', days: 3, cover: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80', vibe: 'Arthur Seat & Strawberries', agencyBadge: 'TripAdvisor Choice' },
  { name: 'Jaipur', country: 'India', days: 3, cover: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80', vibe: 'Forts, Palaces & Pink City', agencyBadge: 'MakeMyTrip Royal Star' },
  { name: 'Udaipur', country: 'India', days: 3, cover: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=600&q=80', vibe: 'Lakes, Palaces & Sunsets', agencyBadge: 'Most Romantic Pick' },
  { name: 'Jodhpur', country: 'India', days: 2, cover: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=600&q=80', vibe: 'Mehrangarh & Blue City', agencyBadge: 'Heritage Certified' },
  { name: 'Jaisalmer', country: 'India', days: 3, cover: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80', vibe: 'Golden Fort & Desert Dunes', agencyBadge: 'Desert Safari Choice' },
  { name: 'Manali', country: 'India', days: 4, cover: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', vibe: 'Snow Peaks, Solang & Cafes', agencyBadge: 'Adventure Award 2026' },
  { name: 'Shimla', country: 'India', days: 3, cover: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&q=80', vibe: 'The Ridge & Pine Trails', agencyBadge: 'Colonial Classic' },
  { name: 'Dharamshala', country: 'India', days: 3, cover: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&q=80', vibe: 'Dalai Lama Temple & Treks', agencyBadge: 'Spiritual Haven' },
  { name: 'Rishikesh', country: 'India', days: 3, cover: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e13?w=600&q=80', vibe: 'Ganga Aarti, Rafting & Yoga', agencyBadge: 'Yoga Capital Star' },
  { name: 'Goa', country: 'India', days: 4, cover: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', vibe: 'Beaches, Waterfalls & Shacks', agencyBadge: '#1 Beach Destination' },
  { name: 'Kerala (Alleppey)', country: 'India', days: 4, cover: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', vibe: 'Houseboats & Tea Hills', agencyBadge: 'NatGeo 50 Lifetimes' },
  { name: 'Coorg', country: 'India', days: 3, cover: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', vibe: 'Coffee Groves & Abbey Falls', agencyBadge: 'Scotland of India' },
  { name: 'Hampi', country: 'India', days: 3, cover: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&q=80', vibe: 'Stone Chariot & Ruins', agencyBadge: 'UNESCO Top Historic' },
  { name: 'Ooty', country: 'India', days: 3, cover: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80', vibe: 'Toy Train & Blue Mountains', agencyBadge: 'Nilgiri Heritage' },
  { name: 'Varanasi', country: 'India', days: 3, cover: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80', vibe: 'Ghats, Temples & Street Food', agencyBadge: 'Sacred Ganges Choice' },
  { name: 'Agra', country: 'India', days: 2, cover: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80', vibe: 'Taj Mahal Sunrise & Fort', agencyBadge: 'Wonder of World' },
  { name: 'Ladakh (Leh)', country: 'India', days: 6, cover: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600&q=80', vibe: 'Pangong Lake & Nubra Desert', agencyBadge: 'High-Altitude Pass' },
  { name: 'Darjeeling', country: 'India', days: 3, cover: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&q=80', vibe: 'Kanchenjunga Sunrise & Tea', agencyBadge: 'Himalayan Gem' }
];

const INTERNATIONAL_PRESETS = [
  { name: 'Paris', country: 'France', days: 4, cover: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&q=80', vibe: 'Culture & Romantic' },
  { name: 'Tokyo', country: 'Japan', days: 5, cover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80', vibe: 'Neon, Shrines & Food' },
  { name: 'Bali', country: 'Indonesia', days: 4, cover: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', vibe: 'Tropical Paradise & Sunsets' },
  { name: 'Rome', country: 'Italy', days: 3, cover: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80', vibe: 'Ancient History & Pasta' },
  { name: 'New York', country: 'USA', days: 3, cover: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80', vibe: 'Skyline & Broadway' },
  { name: 'Dubai', country: 'UAE', days: 4, cover: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', vibe: 'Burj Khalifa & Desert Safari' }
];

const INTEREST_OPTIONS = [
  '🏛️ Culture & Heritage',
  '🍜 Foodie & Culinary',
  '🌿 Nature & Outdoors',
  '📸 Iconic Sightseeing',
  '🏖️ Relaxation & Beach',
  '🧗 Adventure & Thrills',
  '🍸 Nightlife & Social'
];

const AGENT_STEPS = [
  'Analyzing destination climate, terrain & seasonal patterns...',
  'Clustering nearby monuments & calculating optimal transit lines...',
  'Balancing morning & golden-hour light angles with crowd forecasts...',
  'Finalizing personalized AI Day-by-Day itinerary...'
];

export default function AutoPlanner() {
  const navigate = useNavigate();

  // Basic Inputs
  const [destination, setDestination] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [pace, setPace] = useState('balanced');
  const [budgetTier, setBudgetTier] = useState('moderate');
  const [groupType, setGroupType] = useState('solo');
  const [selectedInterests, setSelectedInterests] = useState(['🏛️ Culture & Heritage', '🍜 Foodie & Culinary']);

  // Cities autocomplete
  const [cityList, setCityList] = useState([]);
  const [cityQuery, setCityQuery] = useState('');
  const [externalGeocodes, setExternalGeocodes] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Preset Tab state
  const [presetTab, setPresetTab] = useState('domestic');

  // AI Agent States
  const [generating, setGenerating] = useState(false);
  const [agentStepIndex, setAgentStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [wikiData, setWikiData] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [error, setError] = useState('');
  const [showPackingList, setShowPackingList] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedVRKey, setSelectedVRKey] = useState(null);
  const [bookingPlaceName, setBookingPlaceName] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [liveWeather, setLiveWeather] = useState({ temp: 24, condition: 'Sunny' });



  // AI Refinement Prompt
  const [refinePrompt, setRefinePrompt] = useState('');
  const [refining, setRefining] = useState(false);

  // Draft Recovery State
  const [hasUnsavedDraft, setHasUnsavedDraft] = useState(false);
  const [draftData, setDraftData] = useState(null);

  const [completedActivities, setCompletedActivities] = useState({});
  
  useEffect(() => {
    if (generatedPlan?.destination?.name) {
      try {
        const stored = localStorage.getItem(`gt_completed_acts_${generatedPlan.destination.name}`);
        if (stored) setCompletedActivities(JSON.parse(stored));
      } catch (e) {}
    }
  }, [generatedPlan?.destination?.name]);

  const toggleActivityCompletion = (dayIndex, actIndex) => {
    setCompletedActivities(prev => {
      const key = `${dayIndex}-${actIndex}`;
      const next = { ...prev, [key]: !prev[key] };
      if (generatedPlan?.destination?.name) {
        localStorage.setItem(`gt_completed_acts_${generatedPlan.destination.name}`, JSON.stringify(next));
      }
      return next;
    });
  };

  const [searchParams] = useSearchParams();

  // Save generated plan to draft cache
  useEffect(() => {
    if (generatedPlan) {
      try {
        localStorage.setItem('globetrotter_autoplanner_draft', JSON.stringify({
          plan: generatedPlan,
          destination,
          startDate,
          endDate,
          savedAt: new Date().toISOString()
        }));
      } catch (e) {}
    }
  }, [generatedPlan]);

  // Check for unsaved draft on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('globetrotter_autoplanner_draft');
      if (stored && !generatedPlan) {
        const parsed = JSON.parse(stored);
        if (parsed.plan) {
          setHasUnsavedDraft(true);
          setDraftData(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const handleRestoreDraft = () => {
    if (draftData) {
      setGeneratedPlan(draftData.plan);
      if (draftData.destination) setDestination(draftData.destination);
      if (draftData.startDate) setStartDate(draftData.startDate);
      if (draftData.endDate) setEndDate(draftData.endDate);
    }
    setHasUnsavedDraft(false);
  };

  const handleDismissDraft = () => {
    try {
      localStorage.removeItem('globetrotter_autoplanner_draft');
    } catch (e) {}
    setHasUnsavedDraft(false);
  };

  // Load available cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await api.get('/cities');
        setCityList(res.data);
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    };
    fetchCities();

    // Default dates: +7 days from now for 4 days if no search params
    if (!searchParams.get('dest')) {
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() + 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 3);

      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, []);

  // Debounced live geocoding suggestions for worldwide search
  useEffect(() => {
    if (!cityQuery || cityQuery.trim().length < 2) {
      setExternalGeocodes([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/external/geocode?q=${encodeURIComponent(cityQuery.trim())}`);
        if (Array.isArray(res.data)) {
          setExternalGeocodes(res.data);
        }
      } catch (err) {
        // ignore
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [cityQuery]);

  // Reactive URL query parsing for ?dest= and ?days=
  useEffect(() => {
    const urlDest = searchParams.get('dest');
    const urlDaysStr = searchParams.get('days');
    const urlDays = urlDaysStr ? parseInt(urlDaysStr, 10) : 4;

    if (urlDest) {
      setDestination(urlDest);
      setCityQuery(urlDest);
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() + 7);
      const end = new Date(start);
      end.setDate(start.getDate() + (urlDays - 1));

      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      setStartDate(startStr);
      setEndDate(endStr);

      handleGenerate(null, '', urlDest, startStr, endStr);
    }
  }, [searchParams]);

  // Agent Thinking Step Progression
  useEffect(() => {
    let interval = null;
    if (generating || refining) {
      setAgentStepIndex(0);
      interval = setInterval(() => {
        setAgentStepIndex((prev) => (prev < AGENT_STEPS.length - 1 ? prev + 1 : prev));
      }, 700);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [generating, refining]);

  const handleSelectCity = (city) => {
    setDestination(city.name);
    setSelectedCityId(city.id);
    setCityQuery(city.name);
    setShowCityDropdown(false);
  };

  const handleApplyPreset = (preset) => {
    const presetName = typeof preset === 'string' ? preset : (preset?.name || '');
    const presetDays = (preset && typeof preset.days === 'number' && !isNaN(preset.days) && preset.days > 0) ? preset.days : 4;

    if (!presetName) return;

    const matched = cityList.find((c) => c.name.toLowerCase() === presetName.toLowerCase());
    if (matched) {
      handleSelectCity(matched);
    } else {
      setDestination(presetName);
      setSelectedCityId('');
      setCityQuery(presetName);
    }

    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 7);
    const end = new Date(start);
    end.setDate(start.getDate() + (presetDays - 1));

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    setStartDate(startStr);
    setEndDate(endStr);

    // Auto-generate itinerary instantly for zero-click automatic planning!
    handleGenerate(null, '', presetName, startStr, endStr);
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerate = async (e, customPrompt = '', destOverride = '', startOverride = '', endOverride = '') => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    setError('');

    const targetDest = destOverride || destination || cityQuery;
    const targetStart = startOverride || startDate;
    const targetEnd = endOverride || endDate;

    if (!targetDest) {
      setError('Please enter or select a destination location.');
      return;
    }
    if (!targetStart || !targetEnd) {
      setError('Please enter your trip start and end dates.');
      return;
    }
    if (new Date(targetEnd) < new Date(targetStart)) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    if (customPrompt) {
      setRefining(true);
    } else {
      setGenerating(true);
    }

    try {
      const [res, wikiRes] = await Promise.all([
        api.post('/planner/generate', {
          destination: targetDest,
          destinationId: selectedCityId || undefined,
          startDate: targetStart,
          endDate: targetEnd,
          pace,
          budgetTier,
          groupType,
          interests: selectedInterests,
          refinementPrompt: customPrompt || refinePrompt
        }),
        api.get(`/external/wiki-summary?title=${encodeURIComponent(targetDest)}`).catch(() => ({ data: null }))
      ]);

      setGeneratedPlan(res.data);
      if (wikiRes.data) {
        setWikiData(wikiRes.data);
      } else {
        setWikiData(null);
      }
      setActiveDayIndex(0);

      // Scroll smoothly down to the generated itinerary
      setTimeout(() => {
        const el = document.getElementById('generated-itinerary-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err) {
      setError(err.response?.data?.message || 'AI Agent could not generate itinerary. Please try again.');
    } finally {
      setGenerating(false);
      setRefining(false);
      if (customPrompt) setRefinePrompt('');
    }
  };

  const handleSaveToDatabase = async () => {
    if (!generatedPlan) return;
    setSaving(true);
    setError('');

    try {
      const res = await api.post('/planner/save', {
        tripName: generatedPlan.tripName,
        startDate: generatedPlan.startDate,
        endDate: generatedPlan.endDate,
        description: `Auto-planned by AI Travel Agent for ${generatedPlan.totalDays} days in ${generatedPlan.destination.name}.`,
        coverPhoto: generatedPlan.coverPhoto,
        budget: generatedPlan.estimatedBudget,
        destinationId: generatedPlan.destination.id,
        days: generatedPlan.days
      });

      const savedTrip = res.data.trip;
      navigate(`/trips/${savedTrip.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save trip to database. Please make sure you are logged in.');
      setSaving(false);
    }
  };

  const localFiltered = cityList.filter((c) =>
    c.name.toLowerCase().includes(cityQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(cityQuery.toLowerCase())
  );

  const combinedCities = [
    ...localFiltered,
    ...externalGeocodes
      .filter((ext) => !localFiltered.some((loc) => loc.name.toLowerCase() === ext.name.toLowerCase()))
      .map((ext) => ({
        id: `ext_${ext.name.toLowerCase()}`,
        name: ext.name,
        country: ext.country,
        region: ext.state || 'Global',
        isExternal: true
      }))
  ].slice(0, 8);

  return (
    <div className="page-container auto-planner-page">
      {/* Header */}
      <div className="planner-hero">
        <span className="planner-badge">🤖 Real AI Travel Agent</span>
        <h1>Autonomous AI Trip Planner</h1>
        <p className="page-subtitle">
          Enter any travel destination (Domestic or International) and dates — our <strong>AI Agent</strong> will analyze weather, cluster attractions, avoid crowds, and generate your <strong>optimized day-by-day travel schedule</strong>!
        </p>

        {/* Travel Vibe Quiz Launcher */}
        <div style={{ marginTop: '14px' }}>
          <button
            type="button"
            onClick={() => setShowQuizModal(true)}
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              color: 'white',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🎯 Take 1-Min Travel Vibe Quiz</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCompareModal(true)}
            style={{
              background: '#0284c7',
              color: 'white',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2,132,199,0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⚖️ Compare 2 Destinations</span>
          </button>
        </div>
      </div>

      {/* Unsaved Draft Recovery Notification */}
      {hasUnsavedDraft && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '14px 18px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>💾</span>
            <div>
              <strong style={{ color: '#1e40af', fontSize: '0.95rem' }}>Unsaved Trip Plan Draft Found!</strong>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#1d4ed8' }}>You have a previously generated plan for <strong>{draftData?.destination}</strong>. Would you like to restore it?</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={handleRestoreDraft} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
              ↻ Restore Draft
            </button>
            <button type="button" onClick={handleDismissDraft} style={{ background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Quick Destination Presets with Domestic / International Tabs */}
      <div className="planner-presets-section">
        <div className="presets-header-tabs">
          <button
            type="button"
            className={`preset-tab-pill ${presetTab === 'domestic' ? 'active' : ''}`}
            onClick={() => setPresetTab('domestic')}
          >
            🇮🇳 Domestic (India)
          </button>
          <button
            type="button"
            className={`preset-tab-pill ${presetTab === 'international' ? 'active' : ''}`}
            onClick={() => setPresetTab('international')}
          >
            🌐 International Trips
          </button>
        </div>

        <div className="presets-row">
          {(presetTab === 'domestic' ? DOMESTIC_PRESETS : INTERNATIONAL_PRESETS).map((p) => (
            <button
              key={p.name}
              type="button"
              className="preset-chip"
              onClick={() => handleApplyPreset(p)}
              title={`${p.name} - ${p.vibe}`}
            >
              <span className="preset-name">📍 {p.name}</span>
              <span className="preset-days">({p.days}D)</span>
              {p.agencyBadge && <span className="preset-agency-badge">🏆 {p.agencyBadge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-City Indian Travel Circuits */}
      <div style={{ marginBottom: '24px' }}>
        <MultiCityChainPlanner
          onSelectCircuit={(circuit) => {
            handleApplyPreset({
              name: circuit.cities[0],
              days: circuit.days
            });
          }}
        />
      </div>

      {/* Main Input Form */}
      <div className="planner-form-card">
        <form onSubmit={(e) => handleGenerate(e)}>
          <div className="form-grid-2">
            {/* Destination Input with Live Autocomplete */}
            <div className="form-group city-picker-wrapper">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  <span>📍 Destination Location</span>
                  <span className="label-helper">Any city in India or Worldwide</span>
                </label>
                <VoicePlannerButton
                  onSpeechResult={(spokenText) => {
                    setCityQuery(spokenText);
                    setDestination(spokenText);
                  }}
                />
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Jaipur, Goa, Manali, Paris, Tokyo, Bali, Varanasi..."
                value={cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setDestination(e.target.value);
                  setSelectedCityId('');
                  setShowCityDropdown(true);
                }}
                onFocus={() => setShowCityDropdown(true)}
                required
              />

              {showCityDropdown && combinedCities.length > 0 && (
                <div className="city-autocomplete-menu">
                  {combinedCities.slice(0, 8).map((c) => (
                    <div
                      key={c.id}
                      className="city-autocomplete-item"
                      onClick={() => handleSelectCity(c)}
                    >
                      <span className="item-name">{c.name}</span>
                      <span className="item-country">
                        {c.country} ({c.region}) {c.isExternal ? '🌐 Global' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Travel Dates */}
            <div className="form-grid-dates">
              <div className="form-group">
                <label className="form-label">
                  <span>📅 Start Date</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>📅 End Date</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Toggle Advanced Agent Preferences */}
          <div className="advanced-toggle-row">
            <button
              type="button"
              className="btn-toggle-advanced"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span>{showAdvanced ? '▲ Hide Agent Preferences' : '▼ Customize Travel Pace, Budget & Interests'}</span>
            </button>
          </div>

          {showAdvanced && (
            <div className="advanced-preferences-panel">
              <div className="form-grid-3">
                {/* Pace */}
                <div className="form-group">
                  <label className="form-label">⏱️ Travel Pace</label>
                  <select
                    className="form-select"
                    value={pace}
                    onChange={(e) => setPace(e.target.value)}
                  >
                    <option value="relaxed">Relaxed (1-2 places/day)</option>
                    <option value="balanced">Balanced (3 places/day)</option>
                    <option value="fast">Fast-Paced (4+ places/day)</option>
                  </select>
                </div>

                {/* Budget */}
                <div className="form-group">
                  <label className="form-label">💰 Budget Tier</label>
                  <select
                    className="form-select"
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value)}
                  >
                    <option value="budget">Budget / Backpacker</option>
                    <option value="moderate">Moderate / Standard</option>
                    <option value="luxury">Luxury / Premium</option>
                  </select>
                </div>

                {/* Group Type */}
                <div className="form-group">
                  <label className="form-label">👥 Traveler Group</label>
                  <select
                    className="form-select"
                    value={groupType}
                    onChange={(e) => setGroupType(e.target.value)}
                  >
                    <option value="solo">Solo Traveler</option>
                    <option value="couple">Couple / Romantic</option>
                    <option value="family">Family with Kids</option>
                    <option value="friends">Group of Friends</option>
                  </select>
                </div>
              </div>

              {/* Interests Multi-Select */}
              <div className="form-group">
                <label className="form-label">🎯 What do you love experiencing?</label>
                <div className="interests-pill-grid">
                  {INTEREST_OPTIONS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        className={`interest-pill ${isSelected ? 'active' : ''}`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {error && <div className="form-error planner-error-box">⚠️ {error}</div>}

          {/* Submit Action */}
          <div className="planner-action-bar">
            <button
              type="submit"
              className="btn btn-primary btn-generate-planner"
              disabled={generating}
            >
              {generating ? (
                <>
                  <span className="spinner-sm"></span>
                  <span>AI Agent Generating Plan...</span>
                </>
              ) : (
                <>
                  <span>⚡ Generate AI Schedule</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* AI Agent Thinking Overlay/Banner */}
      {(generating || refining) && (
        <div className="agent-thinking-card">
          <div className="agent-thinking-header">
            <span className="agent-brain-icon">🧠</span>
            <div>
              <h3>AI Agent is Processing Your Journey...</h3>
              <p className="agent-step-text">{AGENT_STEPS[agentStepIndex]}</p>
            </div>
          </div>
          <div className="agent-progress-bar-container">
            <div
              className="agent-progress-bar-fill"
              style={{ width: `${((agentStepIndex + 1) / AGENT_STEPS.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* =========================================================================
          GENERATED TRIP PLAN PREVIEW
          ========================================================================= */}
      {generatedPlan && !generating && (
        <div id="generated-itinerary-section" className="generated-itinerary-wrapper">
          {/* Header Summary Card */}
          <div className="plan-summary-card">
            <div className="summary-cover-wrap">
              <img
                src={generatedPlan.coverPhoto}
                alt={generatedPlan.destination.name}
                className="summary-cover-img"
              />
              <div className="summary-overlay">
                <span className="summary-badge">✨ AI Optimized Schedule</span>
                <h2>{generatedPlan.tripName}</h2>
                <div className="summary-meta-row">
                  <span>📍 {generatedPlan.destination.name}, {generatedPlan.destination.country}</span>
                  <span>📅 {generatedPlan.startDate} to {generatedPlan.endDate} ({generatedPlan.totalDays} Days)</span>
                  <span>💰 Est. Budget: ₹{generatedPlan.estimatedBudget.toLocaleString()} total (~₹{generatedPlan.dailyBreakdownAvg.toLocaleString()}/day)</span>
                </div>
                {selectedInterests && selectedInterests.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                    {selectedInterests.map((interest, idx) => {
                      const colors = ['#eff6ff','#f0fdf4','#fdf4ff','#fff7ed','#f0f9ff'];
                      const textColors = ['#1e40af','#166534','#86198f','#9a3412','#075985'];
                      return (
                        <span key={interest} style={{ background: colors[idx % colors.length], color: textColors[idx % textColors.length], padding: '4px 10px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600 }}>
                          {interest}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Live Budget Meter */}
            {(() => {
              const totalSpent = generatedPlan.days.reduce((sum, d) => sum + (d.estimatedDayCost || 0), 0);
              const budgetMax = generatedPlan.estimatedBudget || totalSpent;
              const runningCost = generatedPlan.days.slice(0, activeDayIndex + 1).reduce((sum, d) => sum + (d.estimatedDayCost || 0), 0);
              const isOverBudget = runningCost > budgetMax;
              const fillPercent = Math.min(((activeDayIndex + 1) / generatedPlan.totalDays) * 100, 100);
              return (
                <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', padding: '12px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    <span>Day {activeDayIndex + 1} Running Cost: ₹{runningCost.toLocaleString()}</span>
                    <span style={{ color: isOverBudget ? '#ef4444' : '#10b981' }}>Total Spent: ₹{totalSpent.toLocaleString()} / Max Budget: ₹{budgetMax.toLocaleString()}</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${fillPercent}%`, height: '100%', background: isOverBudget ? '#ef4444' : 'linear-gradient(90deg, #3b82f6, #60a5fa)', transition: 'width 0.3s' }}></div>
                  </div>
                </div>
              );
            })()}

            {/* AI Agent Executive Insights */}
            {generatedPlan.aiAgentInsights && (
              <div className="agent-insights-banner">
                <div className="insights-header">
                  <span className="agent-tag">🧠 Agent Strategy</span>
                  <span className="agent-score">Optimization: {generatedPlan.aiAgentInsights.agentOptimizationScore}/10</span>
                </div>
                <p className="insights-summary">{generatedPlan.aiAgentInsights.executiveSummary}</p>
                {generatedPlan.aiAgentInsights.groupStrategyNote && (
                  <p style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600, margin: '6px 0' }}>
                    👥 {generatedPlan.aiAgentInsights.groupStrategyNote}
                  </p>
                )}
                {generatedPlan.aiAgentInsights.crowdAvoidanceTip && (
                  <p style={{ fontSize: '12px', color: '#d97706', fontWeight: 600, margin: '4px 0' }}>
                    ⏰ <strong>Crowd Avoidance Tip:</strong> {generatedPlan.aiAgentInsights.crowdAvoidanceTip}
                  </p>
                )}
                <div className="insights-tips-row">
                  <span>🌤️ <strong>Climate & Timing:</strong> {generatedPlan.aiAgentInsights.weatherSeasonTip}</span>
                  <span>⚡ <strong>Route Efficiency:</strong> {generatedPlan.aiAgentInsights.budgetEfficiencyRating}</span>
                </div>
              </div>
            )}

            {/* Live Wikipedia Knowledge Card */}
            {wikiData && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                margin: '16px 20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                {wikiData.thumbnailUrl && (
                  <img
                    src={wikiData.thumbnailUrl}
                    alt={wikiData.title}
                    style={{
                      width: '90px',
                      height: '90px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                )}
                <div style={{ flex: '1 1 240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', background: '#0284c7', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                      📚 Wikipedia Verified Guide
                    </span>
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>{wikiData.title}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                    {wikiData.extract?.length > 220 ? `${wikiData.extract.slice(0, 220)}...` : wikiData.extract}
                  </p>
                  {wikiData.pageUrl && (
                    <a
                      href={wikiData.pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}
                    >
                      Read full encyclopedia entry on Wikipedia ↗
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* AI Prompt Refinement Bar */}
            <div className="agent-refine-bar">
              <span className="refine-label">💬 Ask AI to Adjust:</span>
              <div className="refine-inputs">
                <input
                  type="text"
                  className="refine-text-input"
                  placeholder="e.g. Add more heritage forts, make it more relaxed, or include vegetarian food spots..."
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGenerate(null, refinePrompt);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-refine"
                  disabled={refining || !refinePrompt.trim()}
                  onClick={() => handleGenerate(null, refinePrompt)}
                >
                  {refining ? 'Refining...' : '🔄 Refine Plan'}
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="plan-quick-actions">
              <div className="action-buttons-left">
                <button
                  type="button"
                  className="btn btn-secondary btn-packing"
                  onClick={() => setShowPackingList(true)}
                >
                  🧳 Smart Packing Checklist
                </button>
              </div>

              <div className="action-buttons-right" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Share Trip & QR Code */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowShareModal(true)}
                  style={{ background: '#25D366', color: 'white', border: 'none', fontWeight: 700 }}
                >
                  📲 Share Trip &amp; QR
                </button>

                {/* PDF + Calendar Export */}
                <PdfExportButton generatedPlan={generatedPlan} />

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(generatedPlan, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `globetrotter-${(generatedPlan.destination?.name || 'trip').toLowerCase().replace(/\s+/g,'-')}-plan.json`;
                    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
                  }}
                  style={{ background: 'transparent', color: '#1e293b', border: '1px solid #cbd5e1', fontWeight: 600, padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  💾 Download JSON Backup
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-save-itinerary"
                  disabled={saving}
                  onClick={handleSaveToDatabase}
                >
                  {saving ? 'Saving Itinerary...' : '💾 Save to My Trips & Edit'}
                </button>
              </div>
            </div>
          </div>

          {/* === ADVANCED FEATURE WIDGETS === */}
          <ErrorBoundary title="Travel Features Load Warning">
            {/* Live Weather Widget */}
            <div style={{ marginTop: '24px' }}>
              <WeatherWidget
                destinationKey={(generatedPlan.destination?.name || '').toLowerCase().replace(/\s*\(.*\)/, '').trim()}
                destinationName={generatedPlan.destination?.name}
                startDate={generatedPlan.startDate}
                onWeatherLoaded={setLiveWeather}
              />
            </div>

            {/* Outfit Recommender */}
            <div style={{ marginTop: '24px' }}>
              <OutfitRecommender
                destinationName={generatedPlan.destination?.name}
                temp={liveWeather.temp}
                condition={liveWeather.condition}
              />
            </div>

            {/* Budget Pie Chart */}
            <div style={{ marginTop: '24px' }}>
              <BudgetPieChart
                budget={generatedPlan.estimatedBudget}
                days={generatedPlan.totalDays}
              />
            </div>

            {/* Currency Converter */}
            <div style={{ marginTop: '24px' }}>
              <CurrencyConverterWidget amountINR={generatedPlan.estimatedBudget} />
            </div>

            {/* Interactive Route Map */}
            <MapView generatedPlan={generatedPlan} />

            {/* Hotel & Stay Price Estimator */}
            <div style={{ marginTop: '24px' }}>
              <HotelPriceWidget
                destinationKey={(generatedPlan.destination?.name || '').toLowerCase().replace(/\s*\(.*\)/, '').trim()}
                destinationName={generatedPlan.destination?.name}
                startDate={generatedPlan.startDate}
                endDate={generatedPlan.endDate}
              />
            </div>

            {/* Indian Transit & Connectivity Hub */}
            <div style={{ marginTop: '24px' }}>
              <TransitHub
                destinationKey={(generatedPlan.destination?.name || '').toLowerCase().replace(/\s*\(.*\)/, '').trim()}
                destinationName={generatedPlan.destination?.name}
              />
            </div>

            {/* Safety Card & Emergency Guide */}
            <div style={{ marginTop: '24px' }}>
              <SafetyCard
                destinationName={generatedPlan.destination?.name}
                state={generatedPlan.destination?.country === 'India' ? 'India' : ''}
              />
            </div>
          </ErrorBoundary>

          {/* Day Navigation Tabs */}
          <div className="day-tabs-container">
            {generatedPlan.days.map((d, idx) => (
              <button
                key={d.dayNumber}
                type="button"
                className={`day-tab-btn ${activeDayIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveDayIndex(idx)}
              >
                <span className="day-tab-number">Day {d.dayNumber}</span>
                <span className="day-tab-date">{d.date.split('-').slice(1).join('/')}</span>
              </button>
            ))}
          </div>

          {/* Active Day Detail Timeline */}
          {generatedPlan.days[activeDayIndex] && (
            <div className="active-day-card">
              <div className="active-day-header">
                <div>
                  <span className="day-number-pill">Day {generatedPlan.days[activeDayIndex].dayNumber}</span>
                  <h3>{generatedPlan.days[activeDayIndex].themeTitle}</h3>
                  <p className="day-theme-desc">{generatedPlan.days[activeDayIndex].themeDescription}</p>
                </div>
                <div className="day-cost-badge">
                  <span>Est. Day Spend:</span>
                  <strong>₹{generatedPlan.days[activeDayIndex].estimatedDayCost.toLocaleString()}</strong>
                </div>
              </div>

              {/* Day Transit & Meals Note */}
              <div className="day-context-banner">
                <div className="context-item">
                  <span>🍽️ <strong>Suggested Dining:</strong> {generatedPlan.days[activeDayIndex].suggestedMeals?.lunch} • {generatedPlan.days[activeDayIndex].suggestedMeals?.dinner}</span>
                </div>
                <div className="context-item">
                  <span>🚇 <strong>Transit Strategy:</strong> {generatedPlan.days[activeDayIndex].transitAdvice}</span>
                </div>
              </div>

              {/* Day Activities Timeline */}
              <div className="day-timeline">
                {generatedPlan.days[activeDayIndex].activities.map((act, actIdx) => {
                  const isCompleted = completedActivities[`${activeDayIndex}-${actIdx}`];
                  return (
                  <div key={act.id || actIdx} className="timeline-slot-card" style={{ opacity: isCompleted ? 0.6 : 1, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 5, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isCompleted && <span style={{ color: '#16a34a', fontSize: '0.8rem', fontWeight: 'bold' }}>✓ Done</span>}
                      <input 
                        type="checkbox" 
                        checked={!!isCompleted}
                        onChange={() => toggleActivityCompletion(activeDayIndex, actIdx)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </div>
                    <div className="timeline-slot-indicator">
                      <span className="slot-dot"></span>
                      <span className="slot-badge">{act.slot}</span>
                      <span className="slot-time">{act.timeRange || act.time}</span>
                    </div>

                    <div className="slot-content">
                      {act.imageUrl && (
                        <div className="slot-image-wrap">
                          <img src={act.imageUrl} alt={act.name} className="slot-image" />
                        </div>
                      )}

                      <div className="slot-body">
                        <div className="slot-title-row">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <h4>{act.name}</h4>
                            <AudioGuideButton
                              placeName={act.name}
                              description={act.description}
                              insiderTip={act.insiderTip}
                              category={act.category}
                            />
                            <button
                              type="button"
                              onClick={() => setSelectedVRKey(act.name)}
                              style={{ background: '#0284c7', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              🥽 360° VR
                            </button>
                            <button
                              type="button"
                              onClick={() => setBookingPlaceName(act.name)}
                              style={{ background: '#16a34a', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              🎟️ Book
                            </button>
                          </div>
                          <span className="slot-category">{act.category}</span>
                        </div>

                        <p className="slot-description">{act.description}</p>

                        {/* AI Agent Reasoning */}
                        {act.agentReasoning && (
                          <div className="slot-agent-reasoning">
                            <span>🤖 <strong>AI Optimization:</strong> {act.agentReasoning}</span>
                          </div>
                        )}

                        <div className="slot-meta-grid">
                          <span>⭐ <strong>Rating:</strong> {act.rating} ★</span>
                          <span>⏳ <strong>Duration:</strong> ~{act.duration} hours</span>
                          <span>📍 <strong>Visitor Attraction</strong></span>
                          {act.openingHours && <span>🕒 <strong>Hours:</strong> {act.openingHours}</span>}
                          <span>📍 {act.address}</span>
                        </div>

                        {/* Transit / How to Reach */}
                        {act.transitDetail && (
                          <div className="slot-transit-info">
                            <span>🚶 <strong>How to Reach:</strong> {act.transitDetail}</span>
                          </div>
                        )}

                        {/* Best Photography Vantage Point */}
                        {act.bestPhotoSpot && (
                          <div className="slot-photo-info">
                            <span>📸 <strong>Best Photo Spot:</strong> {act.bestPhotoSpot}</span>
                          </div>
                        )}

                        {/* Points to Visit Nearby & Extensions */}
                        {act.nearbyPointsToVisit && act.nearbyPointsToVisit.length > 0 && (
                          <div className="slot-nearby-box">
                            <div className="slot-nearby-title">
                              <span>📍 <strong>Points to Visit Nearby & Extensions:</strong></span>
                            </div>
                            <div className="slot-nearby-chips">
                              {act.nearbyPointsToVisit.map((pt, pIdx) => (
                                <span key={pIdx} className="nearby-point-pill">
                                  <strong className="nearby-pt-name">{pt.name}</strong>
                                  <span className="nearby-pt-dist">({pt.distance})</span>
                                  {pt.type && <span className="nearby-pt-tag">{pt.type}</span>}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {act.insiderTip && (
                          <div className="slot-insider-tip">
                            <span>💡 <strong>Insider Tip:</strong> {act.insiderTip}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}

          {/* Group Expense Splitter */}
          <div style={{ marginTop: '28px' }}>
            <ExpenseSplitter tripName={generatedPlan.tripName || generatedPlan.destination?.name} />
          </div>
        </div>
      )}

      {/* Smart Packing List Modal */}
      {showPackingList && generatedPlan && (
        <PackingListModal
          destinationName={generatedPlan.destination.name}
          daysCount={generatedPlan.totalDays}
          activities={generatedPlan.days.flatMap((d) => d.activities)}
          onClose={() => setShowPackingList(false)}
        />
      )}

      {/* Share Trip & QR Code Modal */}
      {showShareModal && generatedPlan && (
        <ShareTripModal
          tripName={generatedPlan.tripName}
          destinationName={generatedPlan.destination?.name}
          totalDays={generatedPlan.totalDays}
          cost={generatedPlan.estimatedBudget}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Travel Vibe Quiz Modal */}
      {showQuizModal && (
        <TravelQuizModal
          onClose={() => setShowQuizModal(false)}
          onSelectDestination={(destName, days) => {
            setShowQuizModal(false);
            handleApplyPreset({ name: destName, days });
          }}
        />
      )}

      {/* 360 VR Landmark Preview Modal */}
      {selectedVRKey && (
        <LandmarkVRViewer landmarkKey={selectedVRKey} onClose={() => setSelectedVRKey(null)} />
      )}

      {/* Commercial Tour Booking Modal */}
      {bookingPlaceName && (
        <TourBookingModal destinationName={bookingPlaceName} onClose={() => setBookingPlaceName(null)} />
      )}

      {/* Destination Compare Modal */}
      <DestinationCompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        onSelectDestination={(destName) => {
          handleApplyPreset({ name: destName, days: 4 });
        }}
      />
    </div>
  );
}
