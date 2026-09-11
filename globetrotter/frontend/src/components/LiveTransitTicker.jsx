import React, { useState, useEffect } from 'react';

const TRANSIT_DEALS = [
  { id: 't1', type: '✈️ Flight', route: 'Mumbai → Goa', operator: 'IndiGo Air', fare: 2850, duration: '1h 15m', bookUrl: 'https://www.makemytrip.com/flights/' },
  { id: 't2', type: '🚂 Train', route: 'Mumbai → Neral (Matheran)', operator: 'Central Railway (Deccan Express)', fare: 120, duration: '1h 45m', bookUrl: 'https://www.irctc.co.in/nget/train-search' },
  { id: 't3', type: '🚌 Volvo Bus', route: 'Delhi → Manali', operator: 'HRTC Volvo AC', fare: 1150, duration: '11h 30m', bookUrl: 'https://www.redbus.in/' },
  { id: 't4', type: '🚂 Train', route: 'Jaipur → Udaipur', operator: 'Vande Bharat Express', fare: 920, duration: '6h 10m', bookUrl: 'https://www.irctc.co.in/nget/train-search' },
  { id: 't5', type: '✈️ Flight', route: 'Delhi → Dehradun (Rishikesh)', operator: 'Air India Express', fare: 3200, duration: '55m', bookUrl: 'https://www.makemytrip.com/flights/' },
  { id: 't6', type: '🚌 Bus', route: 'Bengaluru → Coorg', operator: 'KSRTC Club Class', fare: 680, duration: '5h 30m', bookUrl: 'https://www.redbus.in/' },
  { id: 't7', type: '✈️ Flight', route: 'Bengaluru → Goa', operator: 'IndiGo Air', fare: 3100, duration: '1h 05m', bookUrl: 'https://www.makemytrip.com/flights/' },
  { id: 't8', type: '🚌 Volvo Bus', route: 'Pune → Goa', operator: 'Paulo Travels', fare: 720, duration: '8h 00m', bookUrl: 'https://www.redbus.in/' },
  { id: 't9', type: '🚂 Train', route: 'Delhi → Shimla (via Kalka)', operator: 'Shatabdi Express', fare: 680, duration: '5h 30m', bookUrl: 'https://www.irctc.co.in/nget/train-search' },
  { id: 't10', type: '✈️ Flight', route: 'Mumbai → Udaipur', operator: 'SpiceJet', fare: 4200, duration: '1h 20m', bookUrl: 'https://www.makemytrip.com/flights/' },
  { id: 't11', type: '🚌 Bus', route: 'Bengaluru → Ooty', operator: 'TNSTC Deluxe', fare: 390, duration: '7h 00m', bookUrl: 'https://www.redbus.in/' },
  { id: 't12', type: '🚂 Train', route: 'Kolkata → Darjeeling (via NJP)', operator: 'Padatik Express', fare: 550, duration: '10h', bookUrl: 'https://www.irctc.co.in/nget/train-search' },
  { id: 't13', type: '✈️ Flight', route: 'Mumbai → Leh (Ladakh)', operator: 'Air India', fare: 6800, duration: '2h 20m', bookUrl: 'https://www.makemytrip.com/flights/' },
  { id: 't14', type: '🚌 Volvo Bus', route: 'Delhi → Amritsar', operator: 'PRTC Volvo AC', fare: 750, duration: '6h 30m', bookUrl: 'https://www.redbus.in/' },
  { id: 't15', type: '🚂 Train', route: 'Chennai → Ooty (Toy Train)', operator: 'Nilgiri Express', fare: 310, duration: '8h 30m', bookUrl: 'https://www.irctc.co.in/nget/train-search' }
];

export default function LiveTransitTicker() {
  const [activeDeal, setActiveDeal] = useState(null);
  const [loadedAt] = useState(() => Date.now());
  const [elapsedLabel, setElapsedLabel] = useState('just now');
  const [filter, setFilter] = useState('all');
  const [flashed, setFlashed] = useState(false);

  useEffect(() => {
    const updateLabel = () => {
      const elapsed = Math.floor((Date.now() - loadedAt) / 1000);
      if (elapsed < 60) {
        setElapsedLabel('just now');
      } else if (elapsed < 120) {
        setElapsedLabel('1 min ago');
      } else {
        setElapsedLabel(`${Math.floor(elapsed / 60)} mins ago`);
      }
    };
    
    const timer = setInterval(updateLabel, 60000);
    return () => clearInterval(timer);
  }, [loadedAt]);

  useEffect(() => {
    const t1 = setTimeout(() => setFlashed(true), 400);
    const t2 = setTimeout(() => setFlashed(false), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const filteredDeals = TRANSIT_DEALS.filter(deal => {
    if (filter === 'all') return true;
    if (filter === 'flights') return deal.type.includes('Flight');
    if (filter === 'trains') return deal.type.includes('Train');
    if (filter === 'buses') return deal.type.includes('Bus');
    return true;
  });

  const getPillStyle = (pill) => ({
    background: filter === pill ? '#2563eb' : 'transparent',
    border: filter === pill ? '1px solid #2563eb' : '1px solid white',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    outline: 'none'
  });

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        borderRadius: '14px',
        padding: '14px 18px',
        color: 'white',
        margin: '20px 0',
        boxShadow: '0 4px 14px rgba(15,23,42,0.15)',
        border: '1px solid #334155'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: '#ef4444', color: 'white', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
            LIVE TICKER
          </span>
          <strong style={{ fontSize: '14px' }}>✈️ Live Train &amp; Flight Fare Monitor (INR ₹)</strong>
        </div>
        <span style={{ fontSize: '11px', opacity: 0.7 }}>Updated {elapsedLabel}</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={getPillStyle('all')}>All</button>
        <button onClick={() => setFilter('flights')} style={getPillStyle('flights')}>✈️ Flights</button>
        <button onClick={() => setFilter('trains')} style={getPillStyle('trains')}>🚂 Trains</button>
        <button onClick={() => setFilter('buses')} style={getPillStyle('buses')}>🚌 Buses</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
        {filteredDeals.map((deal) => (
          <div
            key={deal.id}
            onClick={() => setActiveDeal(deal)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '10px 12px',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>{deal.type} • {deal.operator}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, margin: '2px 0', color: '#f8fafc' }}>{deal.route}</div>
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}>⏱️ {deal.duration}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '15px',
                fontWeight: 800,
                color: '#4ade80',
                background: flashed ? 'rgba(74,222,128,0.2)' : 'transparent',
                borderRadius: '4px',
                transition: 'background 0.4s',
                padding: '2px 4px',
                marginRight: '-4px'
              }}>
                ₹{deal.fare.toLocaleString()}
              </div>
              <a
                href={deal.bookUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ fontSize: '10px', color: '#38bdf8', textDecoration: 'underline' }}
              >
                Book →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Transit Booking Modal */}
      {activeDeal && (
        <div className="modal-overlay" onClick={() => setActiveDeal(null)} style={{ zIndex: 9999 }}>
          <div
            className="modal-content card-form"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '400px', width: '100%', borderRadius: '14px', padding: '20px' }}
          >
            <h3>Transit Deal: {activeDeal.route}</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 12px' }}>
              {activeDeal.type} operated by <strong>{activeDeal.operator}</strong> ({activeDeal.duration})
            </p>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '15px', color: '#16a34a' }}>
                <span>Fare per Passenger:</span>
                <span>₹{activeDeal.fare.toLocaleString()} INR</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href={activeDeal.bookUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#2563eb',
                  color: 'white',
                  textDecoration: 'none',
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px'
                }}
              >
                🔗 Proceed to {activeDeal.type.includes('Flight') ? 'MakeMyTrip' : activeDeal.type.includes('Train') ? 'IRCTC Official' : 'RedBus'} Booking →
              </a>
              <button type="button" className="btn btn-outline" onClick={() => setActiveDeal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
