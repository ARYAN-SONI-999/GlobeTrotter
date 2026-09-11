import React from 'react';

const STAMPS = [
  { id: 'raj', state: 'Rajasthan', name: 'Royal Rajputana', icon: '🏰', color: '#d97706', bg: '#fef3c7', description: 'Explored Jaipur, Udaipur or Jodhpur forts' },
  { id: 'mah', state: 'Maharashtra', name: 'Sahyadri Nomad', icon: '⛰️', color: '#16a34a', bg: '#dcfce7', description: 'Visited Matheran, Lonavala or Mahabaleshwar' },
  { id: 'ker', state: 'Kerala', name: 'Gods Own Country', icon: '🌴', color: '#0284c7', bg: '#e0f2fe', description: 'Cruised backwaters or tea gardens' },
  { id: 'him', state: 'Himachal', name: 'Himalayan Explorer', icon: '❄️', color: '#7c3aed', bg: '#f3e8ff', description: 'Conquered Manali, Shimla or Dharamshala' },
  { id: 'goa', state: 'Goa', name: 'Sun & Beach Soul', icon: '🏖️', color: '#ea580c', bg: '#ffedd5', description: 'Relaxed on North or South Goa beaches' },
  { id: 'up', state: 'Uttar Pradesh', name: 'Sacred Heritage', icon: '🛕', color: '#dc2626', bg: '#fee2e2', description: 'Visited Varanasi Ghats or Taj Mahal Agra' },
];

export default function PassportStamps({ visitedCount = 3 }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15,23,42,0.06)', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📘 Digital India Travel Passport &amp; Stamps
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Earn stamps as you explore destinations across Indian states</span>
        </div>
        <span style={{ background: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}>
          Stamps Collected: {visitedCount} / {STAMPS.length}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        {STAMPS.map((stamp, idx) => {
          const unlocked = idx < visitedCount;
          return (
            <div
              key={stamp.id}
              style={{
                background: unlocked ? stamp.bg : '#f8fafc',
                border: `2px ${unlocked ? 'solid' : 'dashed'} ${unlocked ? stamp.color : '#cbd5e1'}`,
                borderRadius: '12px',
                padding: '14px 10px',
                textAlign: 'center',
                opacity: unlocked ? 1 : 0.6,
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '4px', filter: unlocked ? 'none' : 'grayscale(100%)' }}>
                {stamp.icon}
              </div>
              <strong style={{ fontSize: '13px', color: unlocked ? stamp.color : '#64748b', display: 'block' }}>
                {stamp.name}
              </strong>
              <span style={{ fontSize: '11px', color: '#475569', display: 'block', marginTop: '2px' }}>
                {stamp.state}
              </span>
              <span style={{ fontSize: '10px', color: unlocked ? '#166534' : '#94a3b8', fontWeight: 700, marginTop: '6px', display: 'inline-block' }}>
                {unlocked ? '✓ STAMPED' : '🔒 LOCKED'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
