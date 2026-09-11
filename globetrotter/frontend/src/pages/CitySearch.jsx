import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useDebounce } from '../hooks/useDebounce';

export default function CitySearch() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [savedCityIds, setSavedCityIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [addToTripModalCity, setAddToTripModalCity] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [stopStartDate, setStopStartDate] = useState('');
  const [stopEndDate, setStopEndDate] = useState('');
  const [addTripMsg, setAddTripMsg] = useState('');
  const [addTripError, setAddTripError] = useState('');
  const [addingStop, setAddingStop] = useState(false);

  const loadRegionsAndSaved = async () => {
    try {
      const [regRes, savedRes, tripsRes] = await Promise.all([
        api.get('/cities/regions').catch(() => ({ data: [] })),
        api.get('/saved').catch(() => ({ data: [] })),
        api.get('/trips').catch(() => ({ data: [] }))
      ]);
      setRegions(regRes.data || []);
      setSavedCityIds(new Set((savedRes.data || []).map((s) => s.cityId)));
      setUserTrips(tripsRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCities = async (q = search, c = country, r = region, sort = sortBy) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      if (c) params.set('country', c);
      if (r) params.set('region', r);
      if (sort) params.set('sortBy', sort);

      const res = await api.get(`/cities?${params.toString()}`);
      setCities(res.data);

      if (countries.length === 0 && res.data.length > 0) {
        const uniqueCountries = [...new Set(res.data.map((item) => item.country))].sort();
        setCountries(uniqueCountries);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load destinations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegionsAndSaved();
    loadCities('', '', '', sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    loadCities(val, country, region, sortBy);
  };

  const handleCountryChange = (e) => {
    const val = e.target.value;
    setCountry(val);
    loadCities(search, val, region, sortBy);
  };

  const handleRegionChange = (e) => {
    const val = e.target.value;
    setRegion(val);
    loadCities(search, country, val, sortBy);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortBy(val);
    loadCities(search, country, region, val);
  };

  const toggleSaveCity = async (cityId) => {
    const isSaved = savedCityIds.has(cityId);
    try {
      if (isSaved) {
        await api.delete(`/saved/${cityId}`);
        setSavedCityIds((prev) => {
          const next = new Set(prev);
          next.delete(cityId);
          return next;
        });
      } else {
        await api.post(`/saved/${cityId}`);
        setSavedCityIds((prev) => new Set(prev).add(cityId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update saved destinations.');
    }
  };

  const openAddToTrip = (city) => {
    setAddToTripModalCity(city);
    setAddTripMsg('');
    setAddTripError('');
    if (userTrips.length > 0) {
      setSelectedTripId(userTrips[0].id);
      setStopStartDate(userTrips[0].startDate);
      setStopEndDate(userTrips[0].endDate);
    }
  };

  const handleTripSelectionChange = (tripId) => {
    setSelectedTripId(tripId);
    const chosen = userTrips.find((t) => t.id === tripId);
    if (chosen) {
      setStopStartDate(chosen.startDate);
      setStopEndDate(chosen.endDate);
    }
  };

  const handleConfirmAddToTrip = async (e) => {
    e.preventDefault();
    if (!selectedTripId) {
      setAddTripError('Please select a trip.');
      return;
    }
    if (!stopStartDate || !stopEndDate) {
      setAddTripError('Please select start and end dates.');
      return;
    }
    setAddingStop(true);
    setAddTripError('');
    setAddTripMsg('');
    try {
      await api.post(`/trips/${selectedTripId}/stops`, {
        cityId: addToTripModalCity.id,
        startDate: stopStartDate,
        endDate: stopEndDate
      });
      setAddTripMsg(`✓ Successfully added ${addToTripModalCity.name} to trip!`);
      setTimeout(() => {
        setAddToTripModalCity(null);
        setAddTripMsg('');
      }, 1500);
    } catch (err) {
      setAddTripError(err.response?.data?.message || 'Could not add stop to trip.');
    } finally {
      setAddingStop(false);
    }
  };

  const [scope, setScope] = useState('domestic');
  const [agencyPackages, setAgencyPackages] = useState([]);

  useEffect(() => {
    api.get('/agency/packages')
      .then((res) => setAgencyPackages(res.data || []))
      .catch(() => setAgencyPackages([]));
  }, []);

  const filteredCitiesByScope = cities.filter((city) => {
    const isIndia = (city.country || '').toLowerCase() === 'india' || (city.region || '').toLowerCase().includes('india');
    if (scope === 'domestic') return isIndia;
    if (scope === 'international') return !isIndia;
    return true;
  });

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1>Discover Tourist Cities & Agency Packages</h1>
          <p className="page-subtitle">Curated destinations verified by top travel agencies (MakeMyTrip, TripAdvisor, Viator) with instant AI itinerary planning.</p>
        </div>
      </div>

      {/* Scope Navigation Switcher */}
      <div className="places-scope-tabs" style={{ marginBottom: '18px' }}>
        <button
          type="button"
          className={`scope-tab-pill ${scope === 'domestic' ? 'active' : ''}`}
          onClick={() => setScope('domestic')}
        >
          <span>🇮🇳 Domestic Cities (India)</span>
          <span className="scope-count">({cities.filter(c => (c.country || '').toLowerCase() === 'india' || (c.region || '').toLowerCase().includes('india')).length})</span>
        </button>
        <button
          type="button"
          className={`scope-tab-pill ${scope === 'international' ? 'active' : ''}`}
          onClick={() => setScope('international')}
        >
          <span>🌐 International Cities</span>
          <span className="scope-count">({cities.filter(c => (c.country || '').toLowerCase() !== 'india' && !(c.region || '').toLowerCase().includes('india')).length})</span>
        </button>
        <button
          type="button"
          className={`scope-tab-pill ${scope === 'all' ? 'active' : ''}`}
          onClick={() => setScope('all')}
        >
          <span>🌍 All Cities Worldwide</span>
        </button>
      </div>

      {/* Top Tour Agency Verified Packages (When in Domestic Mode) */}
      {scope === 'domestic' && agencyPackages.length > 0 && (
        <div className="agency-packages-section" style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.9)', padding: '18px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏆 Top Travel Agency Packages (MakeMyTrip & TripAdvisor)</span>
            </h3>
            <span style={{ fontSize: '0.78rem', background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: '9999px', fontWeight: 700 }}>
              Live Agency Feed
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {agencyPackages.map((pkg, idx) => (
              <div key={idx} style={{ flexShrink: 0, width: '280px', background: 'white', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                      {pkg.badge || 'Verified Package'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                      ⭐ {pkg.agencyRating || 4.9} ★
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block', marginBottom: '4px' }}>{pkg.title}</strong>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>📍 {pkg.destination}, {pkg.state} • {pkg.duration}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#166534' }}>₹{pkg.priceINR?.toLocaleString()}</span>
                  <a href={`/planner?dest=${encodeURIComponent(pkg.destination)}`} className="btn btn-small btn-primary" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                    ⚡ Plan with AI
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="search-controls">
        <input
          type="text"
          placeholder="Search by city, country or region..."
          value={search}
          onChange={handleSearchChange}
        />

        <select value={country} onChange={handleCountryChange}>
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={region} onChange={handleRegionChange}>
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <select value={sortBy} onChange={handleSortChange}>
          <option value="popularity">Sort by Popularity</option>
          <option value="cost">Sort by Cost (low to high)</option>
          <option value="name">Sort by Name (A-Z)</option>
        </select>
      </div>

      {error && <p className="form-error" style={{ marginBottom: '16px' }}>{error}</p>}

      {loading ? (
        <div className="page-loading"><div className="spinner"></div><p>Searching destinations...</p></div>
      ) : filteredCitiesByScope.length === 0 ? (
        <div className="empty-state-card">
          <span className="empty-state-icon">🏙️</span>
          <h3>No destinations found</h3>
          <p>Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <div className="city-grid">
          {filteredCitiesByScope.map((city) => {
            const isSaved = savedCityIds.has(city.id);
            const isIndia = (city.country || '').toLowerCase() === 'india' || (city.region || '').toLowerCase().includes('india');
            return (
              <div className="city-search-card" key={city.id}>
                <div className="city-search-card-top">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3>{city.name}</h3>
                      {isIndia && <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px' }}>🇮🇳 India</span>}
                    </div>
                    <p className="city-country-tag">{city.country} • <span className="city-region-badge">{city.region || 'World'}</span></p>
                  </div>
                  <button
                    className={`save-heart-btn ${isSaved ? 'saved' : ''}`}
                    onClick={() => toggleSaveCity(city.id)}
                    title={isSaved ? 'Remove from Saved' : 'Save to Favorites'}
                  >
                    {isSaved ? '♥' : '♡'}
                  </button>
                </div>

                {city.description && <p className="city-desc-snippet">{city.description}</p>}

                <div className="city-meta-row">
                  <span>💰 Cost Index: <strong>{city.costIndex}</strong></span>
                  <span>🔥 Popularity: <strong>{city.popularity}/100</strong></span>
                </div>

                <div className="city-card-actions" style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-small btn-outline"
                    onClick={() => openAddToTrip(city)}
                  >
                    + Add to Trip
                  </button>
                  <a
                    href={`/planner?dest=${encodeURIComponent(city.name)}`}
                    className="btn btn-small btn-primary"
                  >
                    ⚡ AI Planner
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {addToTripModalCity && (
        <div className="modal-overlay" onClick={() => setAddToTripModalCity(null)}>
          <div className="modal-content card-form" onClick={(e) => e.stopPropagation()}>
            <h2>Add {addToTripModalCity.name} to Trip</h2>
            <p className="page-subtitle">{addToTripModalCity.country} ({addToTripModalCity.region})</p>

            {userTrips.length === 0 ? (
              <div>
                <p className="empty-state-small">You don't have any trips yet.</p>
                <a href="/trips/new" className="btn btn-primary btn-small" style={{ marginTop: '10px' }}>Create a Trip First</a>
              </div>
            ) : (
              <form onSubmit={handleConfirmAddToTrip}>
                <label>Select Trip</label>
                <select
                  value={selectedTripId}
                  onChange={(e) => handleTripSelectionChange(e.target.value)}
                >
                  {userTrips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>

                <div className="form-row">
                  <div>
                    <label>Stop Arrival</label>
                    <input
                      type="date"
                      value={stopStartDate}
                      onChange={(e) => setStopStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label>Stop Departure</label>
                    <input
                      type="date"
                      value={stopEndDate}
                      onChange={(e) => setStopEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {addTripError && <p className="form-error">{addTripError}</p>}
                {addTripMsg && <p className="form-success">{addTripMsg}</p>}

                <div className="form-row" style={{ marginTop: '16px' }}>
                  <button type="submit" className="btn btn-primary" disabled={addingStop}>
                    {addingStop ? 'Adding...' : 'Confirm Add Stop'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setAddToTripModalCity(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
