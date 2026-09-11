import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // City search state
  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [stopStart, setStopStart] = useState('');
  const [stopEnd, setStopEnd] = useState('');

  // Activity state per stop
  const [activityForms, setActivityForms] = useState({});
  const [templateBrowser, setTemplateBrowser] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [activityFilterType, setActivityFilterType] = useState('');

  // Places to Visit recommendation drawer state
  const [placeBrowser, setPlaceBrowser] = useState(null);
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);

  // Reorder state
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [reordering, setReordering] = useState(false);

  const loadTrip = async () => {
    try {
      const res = await api.get(`/trips/${tripId}`);
      setTrip(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load trip.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  const searchCities = async (q) => {
    setCitySearch(q);
    if (q.length < 1) {
      setCityResults([]);
      return;
    }
    try {
      const res = await api.get(`/cities?search=${encodeURIComponent(q)}`);
      setCityResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStop = async (e) => {
    e.preventDefault();
    if (!selectedCity || !stopStart || !stopEnd) {
      setError('Select a city and provide start/end dates for the stop.');
      return;
    }
    setError('');
    try {
      await api.post(`/trips/${tripId}/stops`, {
        cityId: selectedCity.id,
        startDate: stopStart,
        endDate: stopEnd
      });
      setSelectedCity(null);
      setCitySearch('');
      setCityResults([]);
      setStopStart('');
      setStopEnd('');
      setShowCitySearch(false);
      loadTrip();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add stop.');
    }
  };

  const handleRemoveStop = async (stopId) => {
    if (!window.confirm('Remove this stop and all its activities?')) return;
    try {
      await api.delete(`/trips/${tripId}/stops/${stopId}`);
      loadTrip();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not remove stop.');
    }
  };

  const handleActivityFormChange = (stopId, field, value) => {
    setActivityForms((prev) => ({
      ...prev,
      [stopId]: { ...prev[stopId], [field]: value }
    }));
  };

  const handleAddActivity = async (stop) => {
    const form = activityForms[stop.id];
    if (!form || !form.name || form.cost === undefined || form.cost === '') {
      alert('Activity name and cost are required.');
      return;
    }
    try {
      await api.post(`/stops/${stop.id}/activities`, {
        name: form.name,
        type: form.type || 'General',
        cost: Number(form.cost),
        duration: form.duration ? Number(form.duration) : 1,
        activityDate: form.activityDate || stop.startDate,
        startTime: form.startTime || '09:00',
        description: form.description || ''
      });
      setActivityForms((prev) => ({ ...prev, [stop.id]: {} }));
      loadTrip();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add activity.');
    }
  };

  const handleRemoveActivity = async (stopId, activityId) => {
    try {
      await api.delete(`/stops/${stopId}/activities/${activityId}`);
      loadTrip();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not remove activity.');
    }
  };

  const openTemplateBrowser = async (stopId, cityId) => {
    setTemplateBrowser(stopId);
    setPlaceBrowser(null);
    try {
      const res = await api.get(`/activities/templates?cityId=${cityId}`);
      setTemplates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openPlaceBrowser = async (stopId, cityId) => {
    setPlaceBrowser(stopId);
    setTemplateBrowser(null);
    try {
      const res = await api.get(`/places?cityId=${cityId}`);
      setSuggestedPlaces(res.data);
    } catch (err) {
      console.error('Failed to load places for stop:', err);
    }
  };

  const addPlaceAsActivity = async (stop, place) => {
    try {
      await api.post(`/stops/${stop.id}/activities`, {
        name: place.name,
        type: place.category || 'Sightseeing',
        cost: place.cost || 0,
        duration: place.duration || 2,
        description: place.description || '',
        imageUrl: place.imageUrl || '',
        activityDate: stop.startDate,
        startTime: place.bestTime === 'Evening' ? '07:00 PM' : '10:00 AM'
      });
      loadTrip();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add place as activity.');
    }
  };

  const addTemplateActivity = async (stop, template) => {
    try {
      await api.post(`/stops/${stop.id}/activities`, {
        name: template.name,
        type: template.type,
        cost: template.cost,
        duration: template.duration,
        description: template.description,
        imageUrl: template.imageUrl || '',
        activityDate: stop.startDate,
        startTime: '10:00'
      });
      loadTrip();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add activity.');
    }
  };

  const filteredTemplates = activityFilterType
    ? templates.filter((t) => t.type === activityFilterType)
    : templates;

  const persistOrder = async (orderedStops) => {
    setReordering(true);
    try {
      const orderedStopIds = orderedStops.map((s) => s.id);
      await api.put(`/trips/${tripId}/stops/reorder`, { orderedStopIds });
      setTrip((prev) => ({ ...prev, stops: orderedStops }));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reorder stops.');
      loadTrip();
    } finally {
      setReordering(false);
    }
  };

  const moveStop = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= trip.stops.length || fromIndex === toIndex) return;
    const next = trip.stops.slice();
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    persistOrder(next);
  };

  const handleDragStart = (index) => setDragIndex(index);
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (index !== dragOverIndex) setDragOverIndex(index);
  };
  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    moveStop(dragIndex, index);
    setDragIndex(null);
    setDragOverIndex(null);
  };
  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading itinerary builder...</p></div>;
  if (!trip) return <div className="page-container"><p className="form-error">{error}</p></div>;

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1>{trip.name}</h1>
          <p className="page-subtitle">{new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}</p>
        </div>
        <div className="header-actions">
          <Link to={`/trips/${tripId}`} className="btn btn-outline">View Itinerary</Link>
          <Link to={`/trips/${tripId}/budget`} className="btn btn-outline">Budget</Link>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <section className="builder-section">
        <h2>Stops ({trip.stops.length})</h2>
        {trip.stops.length > 1 && (
          <p className="section-subtitle">
            Drag a stop by its ⠿ handle to reorder cities, or use the ↑ / ↓ buttons.
          </p>
        )}

        {trip.stops.length === 0 && <p className="empty-state">No stops added yet. Search for a city below to get started.</p>}

        {trip.stops.map((stop, idx) => (
          <div
            className={`stop-card ${dragOverIndex === idx && dragIndex !== null && dragIndex !== idx ? 'stop-card-drag-over' : ''} ${dragIndex === idx ? 'stop-card-dragging' : ''}`}
            key={stop.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={() => handleDrop(idx)}
            onDragEnd={handleDragEnd}
          >
            <div className="stop-card-header">
              <h3>
                <span className="drag-handle" title="Drag to reorder">⠿</span>{' '}
                {idx + 1}. {stop.city?.name}, {stop.city?.country}
              </h3>
              <div className="stop-card-header-actions">
                <button
                  className="btn btn-small btn-outline"
                  onClick={() => moveStop(idx, idx - 1)}
                  disabled={idx === 0 || reordering}
                  title="Move up"
                >↑</button>
                <button
                  className="btn btn-small btn-outline"
                  onClick={() => moveStop(idx, idx + 1)}
                  disabled={idx === trip.stops.length - 1 || reordering}
                  title="Move down"
                >↓</button>
                <button className="btn btn-small btn-danger" onClick={() => handleRemoveStop(stop.id)}>Remove Stop</button>
              </div>
            </div>
            <p className="stop-dates">{new Date(stop.startDate).toLocaleDateString()} – {new Date(stop.endDate).toLocaleDateString()}</p>

            <h4>Activities ({stop.activities.length})</h4>
            {stop.activities.length === 0 && <p className="empty-state-small">No activities yet.</p>}
            <ul className="activity-list">
              {stop.activities.map((act, actIdx) => (
                <li key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '6px', border: '1px solid #e2e8f0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ cursor: 'grab', color: '#94a3b8' }} title="Activity handle">⠿</span>
                    <strong>{act.name}</strong> · {act.type} · {act.duration}h
                    {act.startTime && <span className="time-badge" style={{ marginLeft: '6px' }}>🕒 {act.startTime}</span>}
                    {act.activityDate && <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: '6px' }}>({new Date(act.activityDate).toLocaleDateString()})</span>}
                  </span>
                  <button className="link-button danger" onClick={() => handleRemoveActivity(stop.id, act.id)}>Remove</button>
                </li>
              ))}
            </ul>

            <div className="activity-add-row">
              <input
                placeholder="Activity name"
                value={activityForms[stop.id]?.name || ''}
                onChange={(e) => handleActivityFormChange(stop.id, 'name', e.target.value)}
              />
              <select
                value={activityForms[stop.id]?.type || 'Sightseeing'}
                onChange={(e) => handleActivityFormChange(stop.id, 'type', e.target.value)}
                style={{ width: '130px' }}
              >
                {['Sightseeing', 'Food', 'Culture', 'Adventure', 'Leisure', 'General'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Cost ₹"
                value={activityForms[stop.id]?.cost || ''}
                onChange={(e) => handleActivityFormChange(stop.id, 'cost', e.target.value)}
                style={{ width: '90px' }}
              />
              <input
                type="number"
                placeholder="Hours"
                step="0.5"
                value={activityForms[stop.id]?.duration || ''}
                onChange={(e) => handleActivityFormChange(stop.id, 'duration', e.target.value)}
                style={{ width: '80px' }}
              />
              <input
                type="date"
                value={activityForms[stop.id]?.activityDate || stop.startDate}
                onChange={(e) => handleActivityFormChange(stop.id, 'activityDate', e.target.value)}
                style={{ width: '130px' }}
                title="Activity Date"
              />
              <input
                type="time"
                value={activityForms[stop.id]?.startTime || '09:00'}
                onChange={(e) => handleActivityFormChange(stop.id, 'startTime', e.target.value)}
                style={{ width: '110px' }}
                title="Start Time"
              />
              <button className="btn btn-small btn-primary" onClick={() => handleAddActivity(stop)}>+ Add</button>
            </div>
            <div className="stop-suggestion-links">
              <button className="btn btn-outline btn-small" onClick={() => openPlaceBrowser(stop.id, stop.cityId)}>
                ✨ Suggest Top Places to Visit in {stop.city?.name}
              </button>
              <button className="link-button" onClick={() => openTemplateBrowser(stop.id, stop.cityId)}>
                Browse activity templates →
              </button>
            </div>

            {/* Places to Visit Recommendation Drawer */}
            {placeBrowser === stop.id && (
              <div className="template-browser place-suggestions-browser">
                <div className="template-filter-row">
                  <h4>📍 Recommended Places to Visit in {stop.city?.name}</h4>
                  <button className="link-button" onClick={() => setPlaceBrowser(null)}>Close ✕</button>
                </div>
                <div className="place-suggestions-grid">
                  {suggestedPlaces.map((place) => (
                    <div className="suggestion-card" key={place.id}>
                      {place.imageUrl && (
                        <div className="suggestion-img-wrap">
                          <img src={place.imageUrl} alt={place.name} />
                          <span className="suggestion-cat-badge">{place.category}</span>
                        </div>
                      )}
                      <div className="suggestion-card-body">
                        <div className="suggestion-title-row">
                          <strong>{place.name}</strong>
                          <span className="suggestion-rating">★ {place.rating}</span>
                        </div>
                        <p className="suggestion-desc">{place.description}</p>
                        {place.insiderTip && (
                          <div className="suggestion-tip">
                            💡 <strong>Tip:</strong> {place.insiderTip}
                          </div>
                        )}
                        <div className="suggestion-meta-row">
                          <span>📍 Visitor Attraction</span>
                          <span>⏱ {place.duration}h</span>
                          <span>🕒 Best: {place.bestTime}</span>
                        </div>
                        <button
                          className="btn btn-small btn-primary btn-full"
                          onClick={() => addPlaceAsActivity(stop, place)}
                        >
                          + Add to Schedule ({place.bestTime === 'Evening' ? '07:00 PM' : '10:00 AM'})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {templateBrowser === stop.id && (
              <div className="template-browser">
                <div className="template-filter-row">
                  <select value={activityFilterType} onChange={(e) => setActivityFilterType(e.target.value)}>
                    <option value="">All types</option>
                    {[...new Set(templates.map((t) => t.type))].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button className="link-button" onClick={() => setTemplateBrowser(null)}>Close</button>
                </div>
                <div className="template-grid">
                  {filteredTemplates.map((tpl) => (
                    <div className="template-card" key={tpl.id}>
                      {tpl.imageUrl && (
                        <img src={tpl.imageUrl} alt={tpl.name} className="activity-card-img" />
                      )}
                      <div className="template-card-body">
                        <strong>{tpl.name}</strong>
                        <span>{tpl.type} · {tpl.duration}h</span>
                        <p>{tpl.description}</p>
                        <button className="btn btn-small btn-primary" onClick={() => addTemplateActivity(stop, tpl)}>+ Add to Stop</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="builder-section">
        <h2>Add a Stop</h2>
        {!showCitySearch ? (
          <button className="btn btn-primary" onClick={() => setShowCitySearch(true)}>+ Add Stop</button>
        ) : (
          <form className="card-form" onSubmit={handleAddStop}>
            <label>Search for a city</label>
            <input
              type="text"
              value={citySearch}
              onChange={(e) => searchCities(e.target.value)}
              placeholder="e.g. Paris, Tokyo, Bali..."
            />
            {cityResults.length > 0 && (
              <div className="city-result-list">
                {cityResults.map((city) => (
                  <div
                    key={city.id}
                    className={`city-result-item ${selectedCity?.id === city.id ? 'selected' : ''}`}
                    onClick={() => { setSelectedCity(city); setCitySearch(`${city.name}, ${city.country}`); setCityResults([]); }}
                  >
                    <strong>{city.name}</strong>, {city.country} ({city.region}) — cost index {city.costIndex}, popularity {city.popularity}
                  </div>
                ))}
              </div>
            )}

            <div className="form-row">
              <div>
                <label>Arrival Date</label>
                <input type="date" value={stopStart} onChange={(e) => setStopStart(e.target.value)} />
              </div>
              <div>
                <label>Departure Date</label>
                <input type="date" value={stopEnd} onChange={(e) => setStopEnd(e.target.value)} />
              </div>
            </div>

            <div className="form-row" style={{ marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary">Add Stop to Trip</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowCitySearch(false)}>Cancel</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
