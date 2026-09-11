import React, { useState } from 'react';

const LOCAL_GUIDES = [
  {
    id: 'g1',
    name: 'Rajesh Sharma',
    city: 'Jaipur',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    experience: '8 Years Experience',
    rating: '4.9 ★ (124 reviews)',
    languages: ['Gujarati', 'Hindi', 'English'],
    specialties: ['Amber Fort Expert', 'Heritage Palaces', 'Street Food Walks'],
    ratePerDay: 2200,
    verified: true
  },
  {
    id: 'g2',
    name: 'Pooja Kulkarni',
    city: 'Matheran / Lonavala',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
    experience: '6 Years Experience',
    rating: '4.8 ★ (98 reviews)',
    languages: ['Marathi', 'Hindi', 'English', 'Gujarati'],
    specialties: ['Trekking Trails', 'Toy Train History', 'Valley Views'],
    ratePerDay: 1800,
    verified: true
  },
  {
    id: 'g3',
    name: 'Suresh Menon',
    city: 'Kerala (Alleppey)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    experience: '10 Years Experience',
    rating: '5.0 ★ (210 reviews)',
    languages: ['Malayalam', 'English', 'Hindi'],
    specialties: ['Houseboat Captain', 'Backwater Village Tours', 'Spice Gardens'],
    ratePerDay: 2500,
    verified: true
  },
  {
    id: 'g4',
    name: 'Vikram Joshi',
    city: 'Varanasi',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    experience: '7 Years Experience',
    rating: '4.9 ★ (140 reviews)',
    languages: ['Hindi', 'Gujarati', 'English'],
    specialties: ['Ghats & Aarti Walks', 'Old Temple History', 'Boat Sunrise Tours'],
    ratePerDay: 2000,
    verified: true
  }
];

export default function LocalGuidesWidget({ selectedCity = '' }) {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [hireMsg, setHireMsg] = useState('');

  const filteredGuides = selectedCity
    ? LOCAL_GUIDES.filter((g) => g.city.toLowerCase().includes(selectedCity.toLowerCase()))
    : LOCAL_GUIDES;

  const guidesToShow = filteredGuides.length > 0 ? filteredGuides : LOCAL_GUIDES;

  const handleHireGuideSubmit = (e) => {
    e.preventDefault();
    setHireMsg(`Success! Booking request sent to ${selectedGuide.name}. They will call/WhatsApp you shortly.`);
    setTimeout(() => {
      setSelectedGuide(null);
      setHireMsg('');
    }, 3000);
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🚩 Certified Local Tour Guides &amp; Experts
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>
            Hire government-verified local storytellers &amp; experts who speak your language.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {guidesToShow.map((guide) => (
          <div
            key={guide.id}
            style={{
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                <img
                  src={guide.avatar}
                  alt={guide.name}
                  style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <strong style={{ fontSize: '15px', color: '#1e293b' }}>{guide.name}</strong>
                    {guide.verified && <span title="Verified Tour Guide" style={{ color: '#2563eb', fontSize: '14px' }}>✓</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>📍 {guide.city} • {guide.experience}</div>
                  <div style={{ fontSize: '12px', color: '#d97706', fontWeight: 600 }}>{guide.rating}</div>
                </div>
              </div>

              {/* Language Chips */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {guide.languages.map((lang) => (
                  <span
                    key={lang}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontWeight: 600
                    }}
                  >
                    🗣️ {lang}
                  </span>
                ))}
              </div>

              {/* Specialties */}
              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '12px' }}>
                {guide.specialties.map((s) => `• ${s}`).join(' ')}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
              <div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#16a34a' }}>₹{guide.ratePerDay.toLocaleString()}</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}> / day</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuide(guide)}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                💬 Hire Guide
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hire Guide Modal */}
      {selectedGuide && (
        <div className="modal-overlay" onClick={() => setSelectedGuide(null)} style={{ zIndex: 9999 }}>
          <div
            className="modal-content card-form"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '420px', width: '100%', borderRadius: '16px', padding: '20px' }}
          >
            <h3>Hire Guide: {selectedGuide.name}</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Request verified guide service for <strong>{selectedGuide.city}</strong> at ₹{selectedGuide.ratePerDay}/day.
            </p>

            {hireMsg ? (
              <p className="form-success">{hireMsg}</p>
            ) : (
              <form onSubmit={handleHireGuideSubmit}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Your Travel Date</label>
                <input type="date" required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '12px' }} />

                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Your Mobile / WhatsApp Number</label>
                <input type="tel" placeholder="+91 9876543210" required style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px' }} />

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Send Hire Request</button>
                  <button type="button" className="btn btn-outline" onClick={() => setSelectedGuide(null)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
