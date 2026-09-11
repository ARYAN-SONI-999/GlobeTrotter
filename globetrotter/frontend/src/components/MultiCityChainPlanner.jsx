import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TOURISM_CIRCUITS = [
  {
    id: 'golden-triangle',
    name: 'Golden Triangle (Delhi ➔ Agra ➔ Jaipur)',
    days: 6,
    cities: ['Delhi', 'Agra', 'Jaipur'],
    cover: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80',
    vibe: 'Taj Mahal, Red Fort & Pink City Palaces',
    estCost: 22000
  },
  {
    id: 'maharashtra-hills',
    name: 'Maharashtra Green Circuit (Mumbai ➔ Lonavala ➔ Matheran ➔ Mahabaleshwar)',
    days: 5,
    cities: ['Mumbai', 'Lonavala', 'Matheran', 'Mahabaleshwar'],
    cover: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&q=80',
    vibe: 'Automobile-Free Hills, Waterfalls & Strawberry Farms',
    estCost: 18000
  },
  {
    id: 'rajasthan-royal',
    name: 'Royal Rajasthan (Jaipur ➔ Jodhpur ➔ Jaisalmer ➔ Udaipur)',
    days: 8,
    cities: ['Jaipur', 'Jodhpur', 'Jaisalmer', 'Udaipur'],
    cover: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80',
    vibe: 'Blue City, Desert Dunes & Lake Palaces',
    estCost: 32000
  },
  {
    id: 'kerala-nature',
    name: 'Kerala Backwaters & Hills (Kochi ➔ Munnar ➔ Alleppey)',
    days: 5,
    cities: ['Kochi', 'Munnar', 'Alleppey'],
    cover: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    vibe: 'Tea Gardens, Waterfalls & Houseboat Cruise',
    estCost: 24000
  }
];

export default function MultiCityChainPlanner({ onSelectCircuit }) {
  const navigate = useNavigate();
  const [selectedCircuit, setSelectedCircuit] = useState(TOURISM_CIRCUITS[0]);

  const handlePlanCircuit = (circuit) => {
    if (typeof onSelectCircuit === 'function') {
      onSelectCircuit(circuit);
    } else {
      navigate(`/planner?dest=${encodeURIComponent(circuit.cities[0])}&days=${circuit.days}`);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15,23,42,0.06)', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🛣️ Popular Multi-City Travel Circuits
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Connect multiple top Indian destinations into a master road trip</span>
        </div>
        <span style={{ background: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}>
          🇮🇳 Chained Itineraries
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        {TOURISM_CIRCUITS.map(circuit => (
          <div key={circuit.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fafafa', display: 'flex', flexDirection: 'column' }}>
            <img src={circuit.cover} alt={circuit.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
            <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block', marginBottom: '4px' }}>{circuit.name}</strong>
                <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#64748b' }}>{circuit.vibe}</p>

                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {circuit.cities.map((c, i) => (
                    <span key={i} style={{ background: '#e0e7ff', color: '#3730a3', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
                      {i + 1}. {c}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a' }}>Est. ₹{circuit.estCost.toLocaleString()} ({circuit.days} Days)</span>
                <button
                  type="button"
                  onClick={() => handlePlanCircuit(circuit)}
                  style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  ⚡ Plan Circuit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
