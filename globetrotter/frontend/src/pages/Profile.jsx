import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PassportStamps from '../components/PassportStamps';

const TRAVEL_PREFERENCE_OPTIONS = [
  { id: 'solo', label: '🎒 Solo Backpacking' },
  { id: 'couples', label: '💑 Couples & Romance' },
  { id: 'heritage', label: '🏰 Royal Forts & Heritage' },
  { id: 'photography', label: '📸 Landscape Photography' },
  { id: 'foodie', label: '🍱 Street Food & Fine Dining' },
  { id: 'adventure', label: '🏄 River Rafting & Treks' },
  { id: 'budget', label: '💵 Smart Budget Traveling' },
  { id: 'luxury', label: '💎 5-Star Heritage Resorts' }
];

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('INR');
  const [bio, setBio] = useState(() => localStorage.getItem('gt_profile_bio') || 'Wanderlust explorer seeking top heritage sights, mountain views, and authentic local food!');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [userTripsCount, setUserTripsCount] = useState(0);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'passport' | 'saved' | 'preferences'
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Travel Preferences Selection
  const [selectedVibes, setSelectedVibes] = useState(() => {
    try {
      const stored = localStorage.getItem('gt_profile_vibes');
      return stored ? JSON.parse(stored) : ['solo', 'heritage', 'photography'];
    } catch (e) {
      return ['solo', 'heritage'];
    }
  });

  const toggleVibePreference = (vibeId) => {
    setSelectedVibes((prev) => {
      const next = prev.includes(vibeId) ? prev.filter((id) => id !== vibeId) : [...prev, vibeId];
      try {
        localStorage.setItem('gt_profile_vibes', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  useEffect(() => {
    async function loadProfileData() {
      try {
        const [meRes, savedRes, tripsRes, prefsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/saved').catch(() => ({ data: [] })),
          api.get('/trips').catch(() => ({ data: [] })),
          api.get('/auth/preferences').catch(() => ({ data: {} }))
        ]);
        setName(meRes.data.name);
        setLanguage(meRes.data.language || 'English');
        setPhotoUrl(meRes.data.photoUrl || '');
        setSavedDestinations(savedRes.data || []);
        setUserTripsCount(Array.isArray(tripsRes.data) ? tripsRes.data.length : 0);
        // Load preferences from backend (falls back to localStorage for backwards compat)
        if (prefsRes.data.bio !== undefined) {
          setBio(prefsRes.data.bio || localStorage.getItem('gt_profile_bio') || '');
        }
        if (prefsRes.data.vibes && prefsRes.data.vibes.length > 0) {
          setSelectedVibes(prefsRes.data.vibes);
        }
        if (prefsRes.data.currency) {
          setCurrency(prefsRes.data.currency);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load your profile.');
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo is too large (max 5MB). Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setSaving(true);
    try {
      // Save profile and preferences concurrently
      const [res] = await Promise.all([
        api.put('/auth/me', { name, language, photoUrl }),
        api.put('/auth/preferences', { bio, vibes: selectedVibes, currency })
      ]);
      const updatedUser = {
        ...user,
        name: res.data.name,
        language: res.data.language,
        photoUrl: res.data.photoUrl
      };
      localStorage.setItem('gt_user', JSON.stringify(updatedUser));
      // Keep localStorage in sync for backwards compat with any widget reading it
      localStorage.setItem('gt_profile_bio', bio);
      setUser(updatedUser);
      setName(res.data.name);
      setLanguage(res.data.language);
      setPhotoUrl(res.data.photoUrl || '');
      setMsg('✓ Profile & preferences updated successfully.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleUnsave = async (cityId) => {
    try {
      await api.delete(`/saved/${cityId}`);
      setSavedDestinations((prev) => prev.filter((item) => item.cityId !== cityId));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not remove saved destination.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('This will permanently delete your account and all trips. Continue?')) return;
    try {
      await api.delete('/auth/me');
      logout();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete account.');
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading your traveler profile...</p></div>;

  const initials = (name || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="page-container profile-advanced-page">
      {/* Cover Header Banner */}
      <div
        style={{
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0284c7 100%)',
          color: 'white',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 20px 40px rgba(15,23,42,0.18)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Avatar Wrap */}
          <div style={{ position: 'relative' }}>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile"
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid rgba(255,255,255,0.85)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                }}
              />
            ) : (
              <div
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '4px solid rgba(255,255,255,0.85)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                }}
              >
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Change Photo"
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                background: '#2563eb',
                color: 'white',
                border: '2px solid white',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            >
              📷
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
          </div>

          {/* Profile Name & Badges */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', margin: 0 }}>{name}</h1>
              <span style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #34d399', color: '#6ee7b7', padding: '3px 10px', borderRadius: '16px', fontWeight: 800, fontSize: '0.78rem' }}>
                ✓ Verified GlobeTrotter
              </span>
            </div>
            <p style={{ color: 'rgba(241, 245, 249, 0.9)', fontSize: '0.94rem', margin: '0 0 12px' }}>{user?.email}</p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
                🧳 {userTripsCount} Trip{userTripsCount !== 1 ? 's' : ''} Created
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
                ❤️ {savedDestinations.length} Saved Sights
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
                🌐 {language}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 'details', label: '👤 Personal Details' },
          { id: 'passport', label: '📘 Passport & Stamps' },
          { id: 'saved', label: `❤️ Saved Destinations (${savedDestinations.length})` },
          { id: 'preferences', label: '⚙️ Preferences & Security' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: activeTab === tab.id ? '1px solid #2563eb' : '1px solid #e2e8f0',
              background: activeTab === tab.id ? '#2563eb' : 'white',
              color: activeTab === tab.id ? 'white' : '#475569',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Personal Details Form */}
      {activeTab === 'details' && (
        <div style={{ background: 'white', padding: '28px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.04)', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Personal Profile &amp; Bio</h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#334155', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#334155', marginBottom: '6px' }}>Email Address (Read-only)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #cbd5e1', background: '#f8fafc', color: '#64748b', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#334155', marginBottom: '6px' }}>Traveler Bio &amp; Motto</label>
              <textarea
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your travel style or favorite places..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', fontFamily: 'inherit' }}
              />
            </div>

            {/* Travel Style Preferences Chips */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#334155', marginBottom: '8px' }}>
                🌟 Your Travel Preferences &amp; Vibe Chips
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {TRAVEL_PREFERENCE_OPTIONS.map((vibe) => {
                  const isSelected = selectedVibes.includes(vibe.id);
                  return (
                    <button
                      key={vibe.id}
                      type="button"
                      onClick={() => toggleVibePreference(vibe.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0',
                        background: isSelected ? '#e0f2fe' : '#f8fafc',
                        color: isSelected ? '#0369a1' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isSelected ? '✓ ' : ''}{vibe.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {msg && <p style={{ color: '#16a34a', fontWeight: 700, margin: 0 }}>{msg}</p>}
            {error && <p style={{ color: '#dc2626', fontWeight: 700, margin: 0 }}>{error}</p>}

            <div style={{ marginTop: '8px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ borderRadius: '16px', padding: '12px 24px', fontWeight: 800 }}
              >
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Passport & Stamps */}
      {activeTab === 'passport' && (
        <div style={{ marginBottom: '28px' }}>
          <PassportStamps visitedCount={Math.min(6, Math.max(2, userTripsCount + 1))} />
        </div>
      )}

      {/* TAB 3: Saved Destinations */}
      {activeTab === 'saved' && (
        <div style={{ background: 'white', padding: '28px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.04)', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>💖 Saved Destinations ({savedDestinations.length})</h3>
            <Link to="/places" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>+ Discover More Places &rarr;</Link>
          </div>

          {savedDestinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '18px', border: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>📍</span>
              <p style={{ color: '#64748b', margin: '0 0 12px', fontWeight: 600 }}>You haven't saved any destination spots yet.</p>
              <Link to="/places" className="btn btn-primary" style={{ borderRadius: '16px', padding: '8px 20px', textDecoration: 'none', fontWeight: 800 }}>
                Browse Places to Visit
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {savedDestinations.map((item) => (
                <div key={item.id} style={{ background: '#f8fafc', padding: '18px', borderRadius: '18px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{item.city?.name}</h4>
                      <button
                        type="button"
                        onClick={() => handleUnsave(item.cityId)}
                        title="Remove from saved"
                        style={{ background: '#ffe4e6', color: '#be185d', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 800 }}
                      >
                        ♥
                      </button>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
                      📍 {item.city?.country} • {item.city?.region}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: '10px', borderTop: '1px solid #e2e8f0', marginTop: '12px' }}>
                    <Link to={`/places?search=${encodeURIComponent(item.city?.name || '')}`} style={{ color: '#2563eb', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}>
                      Explore Sights &rarr;
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleUnsave(item.cityId)}
                      style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Preferences & Security */}
      {activeTab === 'preferences' && (
        <div style={{ background: 'white', padding: '28px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(15,23,42,0.04)', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>App Preferences &amp; Security</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#334155', marginBottom: '6px' }}>Default Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem' }}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Gujarati</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#334155', marginBottom: '6px' }}>Display Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem' }}
              >
                <option value="INR">🇮🇳 INR (₹ - Indian Rupee)</option>
                <option value="USD">🇺🇸 USD ($ - US Dollar)</option>
                <option value="EUR">🇪🇺 EUR (€ - Euro)</option>
                <option value="GBP">🇬🇧 GBP (£ - British Pound)</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '18px', border: '1px solid #fca5a5', marginTop: '20px' }}>
            <h4 style={{ color: '#dc2626', margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 800 }}>🚨 Danger Zone</h4>
            <p style={{ color: '#991b1b', fontSize: '0.88rem', margin: '0 0 14px' }}>Deleting your account will permanently remove all your trips, itineraries, saved wishlist, and profile data.</p>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteAccount}
              style={{ borderRadius: '14px', padding: '10px 20px', fontWeight: 800 }}
            >
              Delete My Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
