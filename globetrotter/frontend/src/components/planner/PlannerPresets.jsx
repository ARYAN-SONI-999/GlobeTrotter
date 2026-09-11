import React from 'react';
import OptimizedImage from '../ui/OptimizedImage';

export default function PlannerPresets({
  presetTab,
  setPresetTab,
  domesticPresets,
  internationalPresets,
  onSelectPreset
}) {
  const currentPresets = presetTab === 'domestic' ? domesticPresets : internationalPresets;

  return (
    <div className="planner-presets-section" style={{ marginTop: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔥</span> Instant AI Trip Recommendations
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '2px 0 0' }}>
            Tap any curated destination to pre-fill your AI travel parameters
          </p>
        </div>

        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '20px' }}>
          <button
            type="button"
            className={`btn ${presetTab === 'domestic' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '16px', padding: '6px 14px', fontSize: '0.82rem' }}
            onClick={() => setPresetTab('domestic')}
          >
            🇮🇳 India ({domesticPresets.length})
          </button>
          <button
            type="button"
            className={`btn ${presetTab === 'international' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '16px', padding: '6px 14px', fontSize: '0.82rem' }}
            onClick={() => setPresetTab('international')}
          >
            🌐 International ({internationalPresets.length})
          </button>
        </div>
      </div>

      <div className="presets-scroll-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {currentPresets.map((preset) => (
          <div
            key={preset.name}
            className="preset-card-item"
            style={{
              background: 'white',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            onClick={() => onSelectPreset(preset)}
          >
            <OptimizedImage
              src={preset.cover}
              alt={preset.name}
              style={{ height: '130px', width: '100%' }}
            />
            <div style={{ padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{preset.name}</h4>
                <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#1e40af', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                  {preset.days} Days
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {preset.vibe}
              </p>
              {preset.agencyBadge && (
                <span style={{ fontSize: '0.72rem', color: '#065f46', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                  🏆 {preset.agencyBadge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
