import React, { useState } from 'react';

const DESTINATION_PROFILES = {
  jaipur: { name: 'Jaipur', country: 'India', budgetStay: 1200, midStay: 4500, luxuryStay: 18000, dailyFood: 800, dailyTransit: 400, safety: 'Safe (95%)', climate: 'Warm & Sunny' },
  udaipur: { name: 'Udaipur', country: 'India', budgetStay: 1500, midStay: 5500, luxuryStay: 22000, dailyFood: 950, dailyTransit: 350, safety: 'Safe (96%)', climate: 'Lakeside Cool' },
  goa: { name: 'Goa', country: 'India', budgetStay: 1800, midStay: 6000, luxuryStay: 25000, dailyFood: 1200, dailyTransit: 600, safety: 'Moderate (90%)', climate: 'Coastal Warm' },
  manali: { name: 'Manali', country: 'India', budgetStay: 1000, midStay: 3800, luxuryStay: 16000, dailyFood: 750, dailyTransit: 500, safety: 'Safe (98%)', climate: 'Cold Alpine' },
  rishikesh: { name: 'Rishikesh', country: 'India', budgetStay: 800, midStay: 3000, luxuryStay: 14000, dailyFood: 600, dailyTransit: 300, safety: 'Safe (99%)', climate: 'Pleasant Valley' },
  matheran: { name: 'Matheran', country: 'India', budgetStay: 1000, midStay: 3500, luxuryStay: 12000, dailyFood: 700, dailyTransit: 250, safety: 'Safe (99%)', climate: 'Misty Rainforest' },
  lonavala: { name: 'Lonavala', country: 'India', budgetStay: 1200, midStay: 4200, luxuryStay: 15000, dailyFood: 850, dailyTransit: 400, safety: 'Safe (97%)', climate: 'Monsoon Waterfalls' },
  paris: { name: 'Paris', country: 'France', budgetStay: 5000, midStay: 16000, luxuryStay: 55000, dailyFood: 3500, dailyTransit: 1500, safety: 'Safe (92%)', climate: 'Temperate European' },
  dubai: { name: 'Dubai', country: 'UAE', budgetStay: 4500, midStay: 14000, luxuryStay: 60000, dailyFood: 3000, dailyTransit: 1200, safety: 'Safe (99%)', climate: 'Hot & Sunny' }
};

export default function DestinationCompareModal({ isOpen, onClose, onSelectDestination }) {
  const [city1Key, setCity1Key] = useState('jaipur');
  const [city2Key, setCity2Key] = useState('udaipur');

  if (!isOpen) return null;

  const c1 = DESTINATION_PROFILES[city1Key] || DESTINATION_PROFILES['jaipur'];
  const c2 = DESTINATION_PROFILES[city2Key] || DESTINATION_PROFILES['udaipur'];

  const est3DaysC1 = (c1.midStay * 3) + (c1.dailyFood * 3) + (c1.dailyTransit * 3);
  const est3DaysC2 = (c2.midStay * 3) + (c2.dailyFood * 3) + (c2.dailyTransit * 3);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15,23,42,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        maxWidth: '820px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚖️ Side-by-Side Destination &amp; Budget Comparison
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
              Compare estimated stay, food, transit costs, and safety between any two destinations
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800, color: '#64748b' }}
          >
            ✕
          </button>
        </div>

        {/* City Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Destination 1</label>
            <select
              value={city1Key}
              onChange={(e) => setCity1Key(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700, background: 'white' }}
            >
              {Object.entries(DESTINATION_PROFILES).map(([k, v]) => (
                <option key={k} value={k}>{v.name}, {v.country}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Destination 2</label>
            <select
              value={city2Key}
              onChange={(e) => setCity2Key(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700, background: 'white' }}
            >
              {Object.entries(DESTINATION_PROFILES).map(([k, v]) => (
                <option key={k} value={k}>{v.name}, {v.country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          {/* City 1 Card */}
          <div style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '16px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '1.1rem', color: '#1e3a8a', fontWeight: 800 }}>📍 {c1.name}, {c1.country}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Budget Stay:</span>
                <strong>₹{c1.budgetStay.toLocaleString()}/night</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Mid-Range Stay:</span>
                <strong>₹{c1.midStay.toLocaleString()}/night</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Luxury Stay:</span>
                <strong>₹{c1.luxuryStay.toLocaleString()}/night</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Daily Food:</span>
                <strong>~₹{c1.dailyFood.toLocaleString()}/day</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Daily Transit:</span>
                <strong>~₹{c1.dailyTransit.toLocaleString()}/day</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Safety Score:</span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>{c1.safety}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed #cbd5e1' }}>
                <strong style={{ color: '#0f172a' }}>3-Day Mid-Range Total:</strong>
                <strong style={{ color: '#2563eb', fontSize: '0.95rem' }}>₹{est3DaysC1.toLocaleString()}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onSelectDestination) onSelectDestination(c1.name);
                onClose();
              }}
              style={{ width: '100%', marginTop: '14px', background: '#2563eb', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              ⚡ Plan Trip to {c1.name}
            </button>
          </div>

          {/* City 2 Card */}
          <div style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '16px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '1.1rem', color: '#1e3a8a', fontWeight: 800 }}>📍 {c2.name}, {c2.country}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Budget Stay:</span>
                <strong>₹{c2.budgetStay.toLocaleString()}/night</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Mid-Range Stay:</span>
                <strong>₹{c2.midStay.toLocaleString()}/night</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Luxury Stay:</span>
                <strong>₹{c2.luxuryStay.toLocaleString()}/night</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Daily Food:</span>
                <strong>~₹{c2.dailyFood.toLocaleString()}/day</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Daily Transit:</span>
                <strong>~₹{c2.dailyTransit.toLocaleString()}/day</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Safety Score:</span>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>{c2.safety}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed #cbd5e1' }}>
                <strong style={{ color: '#0f172a' }}>3-Day Mid-Range Total:</strong>
                <strong style={{ color: '#2563eb', fontSize: '0.95rem' }}>₹{est3DaysC2.toLocaleString()}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onSelectDestination) onSelectDestination(c2.name);
                onClose();
              }}
              style={{ width: '100%', marginTop: '14px', background: '#2563eb', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              ⚡ Plan Trip to {c2.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
