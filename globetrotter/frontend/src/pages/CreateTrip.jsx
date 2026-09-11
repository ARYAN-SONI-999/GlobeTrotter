import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function CreateTrip() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPhotoError, setCoverPhotoError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setCoverPhotoError('');
    if (!file) {
      setCoverPhoto(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setCoverPhotoError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setCoverPhotoError('Image is too large — please use one under 4MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setCoverPhoto(reader.result);
    reader.onerror = () => setCoverPhotoError('Could not read that image, please try another.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !startDate || !endDate) {
      setError('Trip name, start date, and end date are required.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before start date.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/trips', {
        name,
        startDate,
        endDate,
        description,
        coverPhoto,
        budget: budget ? Number(budget) : null
      });
      navigate(`/trips/${res.data.id}/builder`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create trip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* AI Auto-Planner Banner */}
      <div className="planner-promo-card">
        <div className="promo-left">
          <span className="promo-badge">⚡ Instant AI Generation</span>
          <h3>Want an automatic day-wise schedule with places to visit?</h3>
          <p>Just enter your destination and dates — our AI Auto-Planner will build a complete itinerary with top attractions and optimal timing in seconds!</p>
        </div>
        <Link to="/planner" className="btn btn-primary btn-promo">
          <span>Launch AI Auto-Planner →</span>
        </Link>
      </div>

      <h1>Plan a New Trip (Manual)</h1>
      <p className="page-subtitle">Or create a custom trip from scratch by filling out the details below.</p>

      <form className="card-form" onSubmit={handleSubmit}>
        <label>Trip Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Euro Summer Adventure" required />

        <div className="form-row">
          <div>
            <label>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
        </div>

        <label>Total Trip Budget (₹ INR, optional)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="e.g. 25000 (enables automated daily budget tracking)"
        />

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's this trip about?" rows={3} />

        <label>Cover Photo (optional)</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
        {coverPhotoError && <p className="form-error">{coverPhotoError}</p>}
        {coverPhoto && (
          <div className="cover-photo-preview">
            <img src={coverPhoto} alt="Cover preview" />
            <button type="button" className="link-button danger" onClick={() => setCoverPhoto(null)}>Remove photo</button>
          </div>
        )}

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '16px' }}>
          {loading ? 'Creating...' : 'Save & Build Itinerary'}
        </button>
      </form>
    </div>
  );
}
