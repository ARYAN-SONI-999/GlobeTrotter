import React, { useState } from 'react';

export default function ShareTripModal({ tripName = 'My Trip', destinationName = 'India', totalDays = 3, cost = 10000, onClose }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`;

  const whatsappMessage = `🌍 *GlobeTrotter Trip Itinerary*\n📍 *Destination:* ${destinationName}\n📅 *Duration:* ${totalDays} Days\n💰 *Est. Budget:* ₹${cost.toLocaleString()}\n\nCheck out the day-wise schedule & route map here: ${shareUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '16px', maxWidth: '420px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', color: '#64748b' }}
        >
          ✕
        </button>

        <span style={{ fontSize: '32px' }}>📲</span>
        <h3 style={{ margin: '6px 0 2px', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Share Trip Itinerary</h3>
        <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748b' }}>{tripName} • {totalDays} Days • ₹{cost.toLocaleString()}</p>

        {/* QR Code */}
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'inline-block', marginBottom: '16px' }}>
          <img src={qrCodeUrl} alt="Trip QR Code" style={{ width: '160px', height: '160px', borderRadius: '8px', display: 'block' }} />
          <span style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', display: 'block', fontWeight: 600 }}>Scan with Phone Camera to Open</span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25D366', color: 'white', border: 'none', borderRadius: '10px', padding: '10px', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}
          >
            <span>💬</span> Share on WhatsApp
          </a>

          <button
            onClick={handleCopyLink}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: copied ? '#16a34a' : '#2563eb', color: 'white', border: 'none', borderRadius: '10px', padding: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
          >
            <span>🔗</span> {copied ? '✓ Link Copied to Clipboard!' : 'Copy Trip Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
