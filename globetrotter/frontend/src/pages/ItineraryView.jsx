import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import PackingListModal from '../components/PackingListModal';
import WeatherWidget from '../components/WeatherWidget';
import ExportPdfModal from '../components/ExportPdfModal';
import MapView from '../components/MapView';
import CurrencyConverterWidget from '../components/CurrencyConverterWidget';

function mapPlanFromTrip(trip) {
  if (!trip || !trip.stops || trip.stops.length === 0) return null;
  const firstCity = trip.stops[0]?.city || { name: trip.name || 'Trip', country: '' };
  return {
    destination: { name: firstCity.name, country: firstCity.country || 'India' },
    tripName: trip.name,
    startDate: trip.startDate,
    endDate: trip.endDate,
    totalDays: trip.stops.length,
    days: trip.stops.map((stop, idx) => ({
      dayNumber: idx + 1,
      activities: (stop.activities || []).map((act) => ({
        id: act.id,
        name: act.name,
        category: act.type || 'Sightseeing',
        rating: 4.8,
        cost: act.cost || 0,
        imageUrl: act.imageUrl,
        latitude: act.latitude,
        longitude: act.longitude,
        slot: act.startTime || `Stop ${idx + 1}`
      }))
    }))
  };
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatISODate(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}

const DESTINATION_COVERS = {
  matheran: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
  lonavala: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=1200&q=80',
  mahabaleshwar: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80',
  jaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80',
  udaipur: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=1200&q=80',
  jodhpur: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=1200&q=80',
  jaisalmer: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80',
  shimla: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&q=80',
  dharamshala: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
  rishikesh: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e13?w=1200&q=80',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
  alleppey: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
  coorg: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
  hampi: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
  ooty: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80',
  varanasi: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80',
  agra: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80',
  ladakh: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200&q=80',
  leh: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200&q=80',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80',
  darjeeling: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&q=80',
  paris: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1200&q=80',
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80'
};

function getRelatableCoverPhoto(trip) {
  if (trip.coverPhoto && trip.coverPhoto.startsWith('http')) {
    return trip.coverPhoto;
  }
  const textToSearch = `${trip.name || ''} ${trip.description || ''}`.toLowerCase();
  for (const [key, url] of Object.entries(DESTINATION_COVERS)) {
    if (textToSearch.includes(key)) {
      return url;
    }
  }
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80';
}

export default function ItineraryView() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('calendar');
  const [shareMsg, setShareMsg] = useState('');
  const [showPackingModal, setShowPackingModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const [expandedDays, setExpandedDays] = useState(new Set());

  const [editingActivity, setEditingActivity] = useState(null);
  const [editStopId, setEditStopId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    type: '',
    cost: '',
    duration: '',
    startTime: '',
    activityDate: '',
    description: ''
  });
  const [editError, setEditError] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const [dragActivityId, setDragActivityId] = useState(null);
  const [dragOverActivityId, setDragOverActivityId] = useState(null);

  const loadTrip = async () => {
    try {
      const res = await api.get(`/trips/${tripId}`);
      setTrip(res.data);

      const initialExpanded = new Set();
      (res.data.stops || []).forEach((stop) => {
        const start = new Date(stop.startDate);
        const end = new Date(stop.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          initialExpanded.add(`${stop.id}_${formatISODate(d)}`);
        }
      });
      setExpandedDays(initialExpanded);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load trip.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  const togglePublic = async () => {
    try {
      const res = await api.put(`/trips/${tripId}`, { isPublic: !trip.isPublic });
      setTrip((prev) => ({ ...prev, isPublic: res.data.isPublic }));
      if (res.data.isPublic) {
        const url = `${window.location.origin}/share/${res.data.shareId}`;
        await navigator.clipboard.writeText(url).catch(() => {});
        setShareMsg(`Trip is now public! Link copied: ${url}`);
      } else {
        setShareMsg('Trip is now private.');
      }
    } catch (err) {
      setShareMsg(err.response?.data?.message || 'Could not update sharing.');
    }
  };

  const toggleDayExpand = (dayKey) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayKey)) next.delete(dayKey);
      else next.add(dayKey);
      return next;
    });
  };

  const openQuickEdit = (stopId, act) => {
    setEditStopId(stopId);
    setEditingActivity(act);
    setEditForm({
      name: act.name || '',
      type: act.type || 'General',
      cost: act.cost !== undefined ? act.cost : '',
      duration: act.duration !== undefined ? act.duration : 1,
      startTime: act.startTime || '09:00',
      activityDate: act.activityDate ? formatISODate(act.activityDate) : '',
      description: act.description || ''
    });
    setEditError('');
  };

  const handleSaveQuickEdit = async (e) => {
    e.preventDefault();
    if (!editForm.name || editForm.cost === '') {
      setEditError('Activity name and cost are required.');
      return;
    }
    setSavingEdit(true);
    setEditError('');
    try {
      await api.put(`/stops/${editStopId}/activities/${editingActivity.id}`, {
        name: editForm.name,
        type: editForm.type,
        cost: Number(editForm.cost),
        duration: Number(editForm.duration || 1),
        startTime: editForm.startTime || null,
        activityDate: editForm.activityDate || null,
        description: editForm.description
      });
      setEditingActivity(null);
      await loadTrip();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Could not update activity.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteActivity = async (stopId, actId) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await api.delete(`/stops/${stopId}/activities/${actId}`);
      if (editingActivity?.id === actId) setEditingActivity(null);
      await loadTrip();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete activity.');
    }
  };

  const handleActivityDrop = async (stopId, stopActivities, targetActId) => {
    if (!dragActivityId || dragActivityId === targetActId) {
      setDragActivityId(null);
      setDragOverActivityId(null);
      return;
    }

    const currentOrder = [...stopActivities];
    const fromIndex = currentOrder.findIndex((a) => a.id === dragActivityId);
    const toIndex = currentOrder.findIndex((a) => a.id === targetActId);
    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = currentOrder.splice(fromIndex, 1);
    currentOrder.splice(toIndex, 0, moved);

    const orderedActivityIds = currentOrder.map((a) => a.id);
    try {
      await api.put(`/stops/${stopId}/activities/reorder`, { orderedActivityIds });
      await loadTrip();
    } catch (err) {
      console.error(err);
    } finally {
      setDragActivityId(null);
      setDragOverActivityId(null);
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading itinerary...</p></div>;
  if (!trip) return <div className="page-container"><p className="form-error">{error}</p></div>;

  return (
    <div className="page-container">
      <img
        className="itinerary-cover-photo"
        src={getRelatableCoverPhoto(trip)}
        alt={`${trip.name} cover`}
      />
      <div className="page-header-row">
        <div>
          <h1>{trip.name}</h1>
          <p className="page-subtitle">{trip.description || 'Custom Travel Itinerary'}</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setShowPdfModal(true)} style={{ background: '#2563eb', color: 'white', border: 'none' }}>
            📄 PDF Guide
          </button>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my trip itinerary for ${trip.name}: ${window.location.href}`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ background: '#25D366', color: 'white', border: 'none', textDecoration: 'none', fontWeight: 700 }}
          >
            📲 WhatsApp
          </a>
          <button className="btn btn-secondary" onClick={() => setShowPackingModal(true)}>
            🧳 Packing List
          </button>
          <Link to={`/trips/${tripId}/builder`} className="btn btn-outline">Edit Itinerary</Link>
          <Link to={`/trips/${tripId}/budget`} className="btn btn-outline">View Budget</Link>
          <button className="btn btn-primary" onClick={togglePublic}>
            {trip.isPublic ? 'Make Private' : 'Share Trip'}
          </button>
        </div>
      </div>

      {shareMsg && <p className="form-success">{shareMsg}</p>}

      {/* Live Weather Forecast & Advisory */}
      {trip.stops.length > 0 && trip.stops[0].city?.name && (
        <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          <WeatherWidget
            destinationName={trip.stops[0].city.name}
            destinationKey={trip.stops[0].city.name}
            startDate={trip.startDate}
          />
          <CurrencyConverterWidget amountINR={Number(trip.budget) || 15000} />
        </div>
      )}

      {/* Interactive Map & GPS Multi-Stop Navigation */}
      {trip.stops.length > 0 && (
        <MapView generatedPlan={mapPlanFromTrip(trip)} />
      )}

      <div className="view-toggle">
        <button className={viewMode === 'calendar' ? 'toggle-active' : ''} onClick={() => setViewMode('calendar')}>Calendar View</button>
        <button className={viewMode === 'list' ? 'toggle-active' : ''} onClick={() => setViewMode('list')}>List View</button>
      </div>

      {trip.stops.length === 0 ? (
        <div className="empty-state-card">
          <span className="empty-state-icon">📍</span>
          <h3>This trip has no stops yet</h3>
          <p>Add destinations and activities to build your full itinerary.</p>
          <Link to={`/trips/${tripId}/builder`} className="btn btn-primary" style={{ marginTop: '12px' }}>Go to Itinerary Builder</Link>
        </div>
      ) : viewMode === 'list' ? (
        <div className="itinerary-list-view">
          {trip.stops.map((stop, idx) => (
            <div className="itinerary-city-block" key={stop.id}>
              <div className="itinerary-city-header">
                <h2>{idx + 1}. {stop.city?.name}, {stop.city?.country}</h2>
                <span>{formatDate(stop.startDate)} – {formatDate(stop.endDate)}</span>
              </div>
              {stop.activities.length === 0 ? (
                <p className="empty-state-small">No activities planned for this stop.</p>
              ) : (
                <div className="activity-blocks">
                  {stop.activities.map((act) => (
                    <div className="activity-block" key={act.id}>
                      <div className="activity-block-header">
                        <strong>{act.name}</strong>
                        <span className="activity-type-badge">{act.type}</span>
                      </div>
                      <div className="activity-block-meta">
                        {act.startTime && <span>🕒 {act.startTime}</span>}
                        <span>⏱ {act.duration} hr{act.duration > 1 ? 's' : ''}</span>
                        <span className="activity-cost">✨ Open Access</span>
                      </div>
                      {act.description && <p className="activity-block-desc">{act.description}</p>}
                      <div style={{ marginTop: '8px' }}>
                        <button className="link-button" onClick={() => openQuickEdit(stop.id, act)}>Quick Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="itinerary-calendar-view">
          <p className="hint-text" style={{ marginBottom: '14px', color: 'var(--text-muted)' }}>
            💡 Click any day to expand/collapse. Drag activities with ⠿ to reorder. Click "Edit" to modify activity time, cost, or date.
          </p>

          {trip.stops.map((stop, stopIdx) => {
            const days = [];
            const start = new Date(stop.startDate);
            const end = new Date(stop.endDate);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              days.push(new Date(d));
            }

            return (
              <div key={stop.id} className="calendar-stop-container">
                <div className="calendar-stop-header">
                  <h3>Stop {stopIdx + 1}: {stop.city?.name}, {stop.city?.country}</h3>
                  <span className="calendar-stop-dates">{formatDate(stop.startDate)} – {formatDate(stop.endDate)}</span>
                </div>

                <div className="calendar-day-list">
                  {days.map((dayDate) => {
                    const dateISO = formatISODate(dayDate);
                    const dayKey = `${stop.id}_${dateISO}`;
                    const isExpanded = expandedDays.has(dayKey);

                    const isFirstDay = dateISO === formatISODate(stop.startDate);
                    const dayActivities = stop.activities.filter((act) => {
                      if (act.activityDate) {
                        return formatISODate(act.activityDate) === dateISO;
                      }
                      return isFirstDay;
                    });

                    return (
                      <div className={`calendar-day-accordion ${isExpanded ? 'expanded' : 'collapsed'}`} key={dayKey}>
                        <div className="calendar-day-accordion-header" onClick={() => toggleDayExpand(dayKey)}>
                          <div className="calendar-day-header-left">
                            <span className="accordion-arrow">{isExpanded ? '▼' : '▶'}</span>
                            <strong>{formatDate(dayDate)}</strong>
                          </div>
                          <span className="calendar-day-activity-count">
                            {dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'}
                          </span>
                        </div>

                        {isExpanded && (
                          <div className="calendar-day-accordion-body">
                            {dayActivities.length === 0 ? (
                              <div className="calendar-free-day">
                                <span>🌴 Free Day — No scheduled activities</span>
                              </div>
                            ) : (
                              <div className="calendar-activities-dropzone">
                                {dayActivities.map((act) => (
                                  <div
                                    key={act.id}
                                    className={`calendar-activity-card ${dragActivityId === act.id ? 'dragging' : ''} ${dragOverActivityId === act.id ? 'drag-over' : ''}`}
                                    draggable
                                    onDragStart={() => setDragActivityId(act.id)}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      if (dragOverActivityId !== act.id) setDragOverActivityId(act.id);
                                    }}
                                    onDrop={() => handleActivityDrop(stop.id, stop.activities, act.id)}
                                    onDragEnd={() => {
                                      setDragActivityId(null);
                                      setDragOverActivityId(null);
                                    }}
                                  >
                                    <div className="calendar-act-left">
                                      <span className="drag-handle" title="Drag to reorder">⠿</span>
                                      <div className="calendar-act-info">
                                        <div className="calendar-act-title-row">
                                          <strong>{act.name}</strong>
                                          <span className="activity-type-badge">{act.type}</span>
                                        </div>
                                        <div className="calendar-act-details">
                                          {act.startTime && <span className="time-badge">🕒 {act.startTime}</span>}
                                          <span>⏱ {act.duration} hr{act.duration > 1 ? 's' : ''}</span>
                                          <span className="cost-tag">✨ Open Access</span>
                                        </div>
                                        {act.description && <p className="calendar-act-desc">{act.description}</p>}
                                      </div>
                                    </div>

                                    <div className="calendar-act-actions">
                                      <button
                                        className="btn btn-small btn-outline"
                                        onClick={() => openQuickEdit(stop.id, act)}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        className="btn btn-small btn-danger"
                                        onClick={() => handleDeleteActivity(stop.id, act.id)}
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingActivity && (
        <div className="modal-overlay" onClick={() => setEditingActivity(null)}>
          <div className="modal-content card-form" onClick={(e) => e.stopPropagation()}>
            <h2>Quick Edit Activity</h2>
            <p className="page-subtitle">Update activity schedule, duration, or budget</p>

            <form onSubmit={handleSaveQuickEdit}>
              <label>Activity Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />

              <div className="form-row">
                <div>
                  <label>Type / Category</label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  >
                    {['Sightseeing', 'Food', 'Culture', 'Adventure', 'Leisure', 'General'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Cost (₹)</label>
                  <input
                    type="number"
                    value={editForm.cost}
                    onChange={(e) => setEditForm({ ...editForm, cost: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Scheduled Date</label>
                  <input
                    type="date"
                    value={editForm.activityDate}
                    onChange={(e) => setEditForm({ ...editForm, activityDate: e.target.value })}
                  />
                </div>
                <div>
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={editForm.startTime}
                    onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label>Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                  />
                </div>
              </div>

              <label>Description / Notes</label>
              <textarea
                rows={2}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />

              {editError && <p className="form-error">{editError}</p>}

              <div className="form-row" style={{ marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" disabled={savingEdit}>
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setEditingActivity(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {trip && (
        <PackingListModal
          isOpen={showPackingModal}
          onClose={() => setShowPackingModal(false)}
          destinationName={trip.name}
          daysCount={trip.stops?.length || 3}
          activities={trip.stops?.flatMap((s) => s.activities || []) || []}
        />
      )}

      {/* Official PDF Travel Guide Modal */}
      {showPdfModal && (
        <ExportPdfModal trip={trip} onClose={() => setShowPdfModal(false)} />
      )}
    </div>
  );
}
