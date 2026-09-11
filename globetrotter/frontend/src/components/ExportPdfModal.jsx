import React from 'react';

export default function ExportPdfModal({ trip, onClose }) {
  if (!trip) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-content card-form"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '650px', width: '100%', borderRadius: '16px', padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>📄 Official PDF Travel Guide</h2>
            <span style={{ fontSize: '13px', color: '#64748b' }}>{trip.name}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}
            >
              🖨️ Print / Save as PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div
          id="printable-travel-guide"
          style={{
            background: '#ffffff',
            padding: '20px',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            color: '#1e293b',
            maxHeight: '480px',
            overflowY: 'auto'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #2563eb', paddingBottom: '12px', marginBottom: '16px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', color: '#1e293b' }}>🌍 GlobeTrotter Travel Guide</h1>
              <h3 style={{ margin: '4px 0 0', color: '#2563eb', fontSize: '16px' }}>{trip.name}</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                📅 {new Date(trip.startDate).toLocaleDateString()} – {new Date(trip.endDate).toLocaleDateString()}
              </p>
            </div>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(window.location.href)}`}
              alt="Itinerary QR"
              style={{ width: '70px', height: '70px', borderRadius: '6px' }}
            />
          </div>

          {/* Emergency Helplines Section */}
          <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px' }}>
            <strong style={{ fontSize: '13px', color: '#991b1b' }}>🚨 Emergency Helplines (India)</strong>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#7f1d1d', marginTop: '4px', flexWrap: 'wrap' }}>
              <span>🚔 Police: 112</span>
              <span>🚑 Ambulance: 108</span>
              <span>👩 Women: 1091</span>
              <span>🏔️ Tourist: 1363</span>
            </div>
          </div>

          {/* Timetable & Stops */}
          <h4 style={{ margin: '0 0 10px', fontSize: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>📍 Day-by-Day Itinerary Timetable</h4>
          {trip.stops && trip.stops.length > 0 ? (
            trip.stops.map((stop, sIdx) => (
              <div key={stop.id || sIdx} style={{ marginBottom: '14px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>Stop {sIdx + 1}: {stop.city?.name}, {stop.city?.country}</strong>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  Dates: {new Date(stop.startDate).toLocaleDateString()} – {new Date(stop.endDate).toLocaleDateString()}
                </div>

                {stop.activities && stop.activities.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {stop.activities.map((act, aIdx) => (
                      <div key={act.id || aIdx} style={{ fontSize: '12px', background: '#fff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        <strong>• {act.name}</strong> ({act.type || 'Sightseeing'}) — ⏳ {act.duration}h | Fee: {act.cost === 0 ? 'Free' : `₹${act.cost}`}
                        {act.description && <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{act.description}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Explore local markets and scenic vistas.</p>
                )}
              </div>
            ))
          ) : (
            <p style={{ fontSize: '12px', color: '#64748b' }}>Custom travel itinerary generated by GlobeTrotter AI Agent.</p>
          )}

          {/* Packing & General Guidelines */}
          <div style={{ marginTop: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px' }}>
            <strong style={{ fontSize: '13px', color: '#166534' }}>🧳 Smart Travel Reminders</strong>
            <ul style={{ margin: '4px 0 0', paddingLeft: '20px', fontSize: '12px', color: '#14532d' }}>
              <li>Carry valid government photo ID (Aadhaar / Passport) and print copies.</li>
              <li>Keep local currency cash for street food and rickshaws.</li>
              <li>Charge power banks and download offline maps.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
