import React, { useState } from 'react';

export default function UploadReelModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !location) {
      alert('Please fill out the reel title and destination location.');
      return;
    }
    setSuccessMsg('🎬 Reel published successfully! Your travel reel is now live in the community feed.');
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-content card-form"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', width: '100%', borderRadius: '16px', padding: '22px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>📹 Upload Travel Reel</h3>
          <button type="button" onClick={onClose} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>✕</button>
        </div>

        {successMsg ? (
          <p className="form-success">{successMsg}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Reel Title *</label>
              <input
                type="text"
                placeholder="e.g. Early Morning Waterfall Walk in Matheran"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Destination Location *</label>
              <input
                type="text"
                placeholder="e.g. Matheran, Maharashtra"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Video MP4 URL or File Sample</label>
              <input
                type="url"
                placeholder="https://assets.mixkit.co/.../sample.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
              <span style={{ fontSize: '11px', color: '#64748b' }}>If left empty, a sample HD travel reel clip will be assigned automatically.</span>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              🚀 Publish Travel Reel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
