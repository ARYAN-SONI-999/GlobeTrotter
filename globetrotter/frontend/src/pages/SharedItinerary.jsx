import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function SharedItinerary() {
  const { shareId } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copyMsg, setCopyMsg] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/trips/public/${shareId}`);
        setTrip(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'This shared itinerary could not be found.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [shareId]);

  const handleCopyTrip = async () => {
    if (!user) {
      setCopyMsg('Please log in to copy this trip to your account.');
      return;
    }
    try {
      await api.post(`/trips/${trip.id}/copy`);
      setCopyMsg('Trip copied to your account! Check "My Trips".');
    } catch (err) {
      setCopyMsg(err.response?.data?.message || 'Could not copy trip.');
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => setCopyMsg('Link copied to clipboard!'));
  };

  const shareText = trip ? `Check out my trip: ${trip.name}` : 'Check out this trip';
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  };
  const openShareWindow = (link) => window.open(link, '_blank', 'noopener,noreferrer,width=600,height=500');

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading shared itinerary...</p></div>;
  if (error) return <div className="page-container"><p className="form-error">{error}</p></div>;

  return (
    <div className="page-container public-page">
      <div className="public-banner">🌍 Shared Trip Itinerary — Read Only</div>
      {trip.coverPhoto && (
        <img className="itinerary-cover-photo" src={trip.coverPhoto} alt={`${trip.name} cover`} />
      )}
      <h1>{trip.name}</h1>
      <p className="page-subtitle">By {trip.ownerName} · {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}</p>
      <p>{trip.description}</p>

      <div className="header-actions">
        <button className="btn btn-primary" onClick={handleCopyTrip}>Copy This Trip</button>
        <button className="btn btn-outline" onClick={handleCopyLink}>Copy Link</button>
        <button className="btn btn-outline" onClick={() => openShareWindow(socialLinks.twitter)}>Share on X</button>
        <button className="btn btn-outline" onClick={() => openShareWindow(socialLinks.whatsapp)}>Share on WhatsApp</button>
        <button className="btn btn-outline" onClick={() => openShareWindow(socialLinks.facebook)}>Share on Facebook</button>
        {!user && <Link to="/signup" className="btn btn-outline">Sign up to plan your own</Link>}
      </div>

      {copyMsg && <p className="form-success">{copyMsg}</p>}

      <section className="builder-section" style={{ marginTop: '24px' }}>
        <h2>Itinerary Summary</h2>
        <p>Total estimated cost: <strong>₹{trip.budget.total.toLocaleString()}</strong> (₹{trip.budget.averagePerDay}/day)</p>
      </section>

      <div className="itinerary-list-view">
        {trip.stops.map((stop, idx) => (
          <div className="itinerary-city-block" key={stop.id}>
            <div className="itinerary-city-header">
              <h2>{idx + 1}. {stop.city?.name}, {stop.city?.country}</h2>
              <span>{new Date(stop.startDate).toLocaleDateString()} – {new Date(stop.endDate).toLocaleDateString()}</span>
            </div>
            <div className="activity-blocks">
              {stop.activities.map((act) => (
                <div className="activity-block" key={act.id}>
                  <strong>{act.name}</strong>
                  <span>{act.type} · {act.duration}h</span>
                  <span className="activity-cost">✨ Included</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
