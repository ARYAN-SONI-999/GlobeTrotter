import React from 'react';

export default function PlannerLoadingStep({ currentStepIndex, agentSteps }) {
  return (
    <div className="planner-loading-card" style={{
      background: 'white',
      borderRadius: '20px',
      padding: '40px 24px',
      textAlign: 'center',
      maxWidth: '560px',
      margin: '40px auto',
      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0'
    }}>
      <div className="spinner" style={{ margin: '0 auto 20px', width: '48px', height: '48px', borderWidth: '4px' }}></div>
      <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '8px' }}>🤖 GlobeTrotter AI Engine at Work</h3>
      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
        Synthesizing live weather, traffic patterns, and optimal routes...
      </p>

      <div style={{ textAlign: 'left', background: '#f8fafc', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
        {agentSteps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 0',
                opacity: isDone || isCurrent ? 1 : 0.4,
                fontWeight: isCurrent ? 700 : 500,
                color: isCurrent ? '#3b82f6' : isDone ? '#10b981' : '#64748b'
              }}
            >
              <span>{isDone ? '✅' : isCurrent ? '⏳' : '⚪'}</span>
              <span style={{ fontSize: '0.88rem' }}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
