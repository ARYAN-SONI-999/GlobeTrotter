import React from 'react';

export default function BudgetPieChart({ budget = 10000, days = 3 }) {
  // Typical breakdown ratios for Indian tourism
  const stay = Math.round(budget * 0.40);       // 40% Accommodation
  const food = Math.round(budget * 0.25);       // 25% Food & Dining
  const transit = Math.round(budget * 0.20);    // 20% Transit & Cabs
  const activities = Math.round(budget * 0.15); // 15% Sightseeing & Entry Fees

  const items = [
    { label: '🏨 Stay & Hotels', amount: stay, color: '#2563eb', pct: 40 },
    { label: '🍽️ Food & Dining', amount: food, color: '#16a34a', pct: 25 },
    { label: '🚕 Transit & Cabs', amount: transit, color: '#d97706', pct: 20 },
    { label: '🎟️ Tickets & Sightseeing', amount: activities, color: '#7c3aed', pct: 15 },
  ];

  // SVG Donut Chart angles
  let cumulativePercent = 0;

  function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  const slices = items.map((item) => {
    const startPercent = cumulativePercent;
    cumulativePercent += item.pct / 100;
    const endPercent = cumulativePercent;

    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);
    const largeArcFlag = item.pct / 100 > 0.5 ? 1 : 0;

    const pathData = [
      `M ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `L 0 0`,
    ].join(' ');

    return { ...item, pathData };
  });

  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15,23,42,0.06)', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          📊 Estimated Spend Breakdown — ₹{budget.toLocaleString()} total
        </h3>
        <span style={{ fontSize: '12px', background: '#f0fdf4', color: '#166534', padding: '3px 10px', borderRadius: '20px', fontWeight: 700 }}>
          ~₹{Math.round(budget / days).toLocaleString()}/day
        </span>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* SVG Donut */}
        <div style={{ width: '160px', height: '160px', position: 'relative' }}>
          <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)', borderRadius: '50%' }}>
            {slices.map((slice, i) => (
              <path key={i} d={slice.pathData} fill={slice.color} />
            ))}
          </svg>
          <div style={{ position: 'absolute', inset: '30px', background: 'white', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Total Est.</span>
            <strong style={{ fontSize: '14px', color: '#0f172a' }}>₹{budget.toLocaleString()}</strong>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', borderLeft: `4px solid ${item.color}` }}>
              <span style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>{item.label}</span>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>₹{item.amount.toLocaleString()}</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>({item.pct}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
