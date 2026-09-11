import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TRAVEL_REELS = [
  {
    id: 'reel-matheran',
    title: 'Misty Matheran Toy Train & Forest Trails 🚂',
    location: 'Matheran, Maharashtra',
    destinationKey: 'Matheran',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-train-travelling-through-a-forest-41584-large.mp4',
    cover: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&q=80',
    likes: '4.8k',
    author: '@sahayadri_explorer',
    days: 2,
    vibe: 'Automobile-Free Hills & Waterfalls'
  },
  {
    id: 'reel-taj',
    title: 'Golden Hour Sunrise at Taj Mahal Agra 🏰',
    location: 'Agra, Uttar Pradesh',
    destinationKey: 'Agra',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-resort-in-the-maldives-41484-large.mp4',
    cover: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80',
    likes: '12.4k',
    author: '@heritage_india',
    days: 2,
    vibe: 'Mughal Architecture & White Marble'
  },
  {
    id: 'reel-kerala',
    title: 'Serene Alleppey Houseboat Backwater Cruise 🌴',
    location: 'Alleppey, Kerala',
    destinationKey: 'Kerala (Alleppey)',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-floating-on-a-boat-in-a-lake-41566-large.mp4',
    cover: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    likes: '9.1k',
    author: '@gods_own_country',
    days: 4,
    vibe: 'Emerald Backwaters & Tea Gardens'
  },
  {
    id: 'reel-goa',
    title: 'Sunset Waves & Coastal Shacks at Goa Beach 🏖️',
    location: 'Palolem, Goa',
    destinationKey: 'Goa',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    cover: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
    likes: '15.2k',
    author: '@beach_vibes_india',
    days: 4,
    vibe: 'Beach Shacks & Watersports'
  },
  {
    id: 'reel-varanasi',
    title: 'Mesmerizing Ganga Aarti Lights at Evening Ghats 🛕',
    location: 'Varanasi, Uttar Pradesh',
    destinationKey: 'Varanasi',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4',
    cover: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80',
    likes: '8.3k',
    author: '@sacred_ganges',
    days: 3,
    vibe: 'Spiritual Ghats & Temple Lights'
  }
];

export default function TravelReelsModal({ initialReelIndex = 0, onClose }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(initialReelIndex);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState({});

  const videoRef = useRef(null);

  const reel = TRAVEL_REELS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TRAVEL_REELS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TRAVEL_REELS.length) % TRAVEL_REELS.length);
  };

  const toggleLike = () => {
    setLiked((prev) => ({ ...prev, [reel.id]: !prev[reel.id] }));
  };

  const handlePlanThisTrip = () => {
    onClose();
    navigate(`/planner?dest=${encodeURIComponent(reel.destinationKey)}&days=${reel.days}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000, background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(8px)' }}>
      <div
        className="reel-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          height: '640px',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}
      >
        {/* Top Close & Sound Bar */}
        <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', zIndex: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', backdropFilter: 'blur(4px)', fontWeight: 600 }}>
            🎬 Travel Reel {currentIndex + 1} of {TRAVEL_REELS.length}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              style={{ background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '14px' }}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Video Element */}
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            src={reel.videoUrl}
            poster={reel.cover}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Reel Gradient Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.85) 100%)', pointerEvents: 'none' }} />

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', zIndex: 2 }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={handleNext}
            style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', zIndex: 2 }}
          >
            ›
          </button>
        </div>

        {/* Bottom Reel Meta & CTAs */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', zIndex: 3, color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
            <div style={{ flex: 1, paddingRight: '12px' }}>
              <span style={{ fontSize: '11px', background: '#2563eb', color: 'white', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                📍 {reel.location}
              </span>
              <h4 style={{ margin: '6px 0 2px', fontSize: '15px', fontWeight: 700, lineHeight: 1.3 }}>{reel.title}</h4>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.85 }}>{reel.author} • {reel.vibe}</p>
            </div>

            {/* Like & Share Action Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={toggleLike}
                style={{ background: 'none', border: 'none', color: liked[reel.id] ? '#ef4444' : 'white', cursor: 'pointer', fontSize: '24px' }}
              >
                {liked[reel.id] ? '❤️' : '🤍'}
                <span style={{ display: 'block', fontSize: '10px', color: 'white', textAlign: 'center', marginTop: '2px' }}>
                  {liked[reel.id] ? 'Liked' : reel.likes}
                </span>
              </button>
            </div>
          </div>

          {/* Direct CTA */}
          <button
            type="button"
            onClick={handlePlanThisTrip}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>⚡ Plan This Reel Trip ({reel.days} Days)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
