import { Link } from 'react-router-dom';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
  const textToSearch = `${trip.name || ''} ${trip.description || ''}`.toLowerCase();
  for (const [key, url] of Object.entries(DESTINATION_COVERS)) {
    if (textToSearch.includes(key)) {
      return url;
    }
  }
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';
}

export default function TripCard({ trip, onDelete }) {
  const coverImage = getRelatableCoverPhoto(trip);

  return (
    <div className="trip-card">
      <div className="trip-card-image-wrap">
        <img className="trip-card-cover" src={coverImage} alt={`${trip.name} cover`} />
        <div className="trip-card-image-overlay">
          {trip.isPublic ? (
            <span className="badge badge-public">🌐 Public</span>
          ) : (
            <span className="badge badge-private">🔒 Private</span>
          )}
          {trip.budget && (
            <span className="badge badge-budget">₹{trip.budget.toLocaleString()} Budget</span>
          )}
        </div>
      </div>

      <div className="trip-card-body">
        <div className="trip-card-header">
          <h3>{trip.name}</h3>
        </div>

        <div className="trip-card-dates">
          <span>📅 {formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
        </div>

        <p className="trip-card-desc">{trip.description || 'Custom planned travel itinerary.'}</p>

        <div className="trip-card-meta">
          <span>📍 {trip.destinationCount ?? 0} {trip.destinationCount === 1 ? 'stop' : 'stops'}</span>
        </div>

        <div className="trip-card-actions">
          <Link to={`/trips/${trip.id}`} className="btn btn-small btn-primary">
            View Itinerary
          </Link>
          <Link to={`/trips/${trip.id}/builder`} className="btn btn-small btn-outline">
            Edit Builder
          </Link>
          <button className="btn btn-small btn-danger-icon" onClick={() => onDelete(trip.id)} title="Delete Trip">
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}
