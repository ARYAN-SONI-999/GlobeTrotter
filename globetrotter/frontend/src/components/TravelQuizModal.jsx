import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QUIZ_DESTINATIONS = {
  hills: [
    { name: 'Matheran', cover: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&q=80', vibe: 'Automobile-Free Hill Station & Charlotte Lake', tag: 'Eco Peace', country: 'India' },
    { name: 'Lonavala', cover: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=600&q=80', vibe: 'Waterfalls, Bhushi Dam & Tiger Leap', tag: 'Monsoon Choice', country: 'India' },
    { name: 'Mahabaleshwar', cover: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80', vibe: 'Arthur Seat & Strawberry Estates', tag: 'Valley Views', country: 'India' },
    { name: 'Shimla', cover: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&q=80', vibe: 'The Ridge & Colonial Pine Trails', tag: 'Colonial Hills', country: 'India' },
    { name: 'Munnar', cover: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', vibe: 'Misty Tea Gardens & Eravikulam', tag: 'Tea Estates', country: 'India' },
  ],
  heritage: [
    { name: 'Jaipur', cover: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80', vibe: 'Amber Fort, Hawa Mahal & Pink City', tag: 'Royal Heritage', country: 'India' },
    { name: 'Udaipur', cover: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=600&q=80', vibe: 'Floating City Palace & Lake Pichola', tag: 'Romantic Pick', country: 'India' },
    { name: 'Varanasi', cover: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80', vibe: 'Sacred Ganges Ghats & Evening Aarti', tag: 'Spiritual Capital', country: 'India' },
    { name: 'Agra', cover: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80', vibe: 'Taj Mahal Sunrise & Mughal Fort', tag: 'World Wonder', country: 'India' },
    { name: 'Jodhpur', cover: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=600&q=80', vibe: 'Mehrangarh Fort & Blue City Lanes', tag: 'Blue Fortress', country: 'India' },
  ],
  beach: [
    { name: 'Goa', cover: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', vibe: 'Baga Watersports & Anjuna Sunset Shacks', tag: 'Beach & Sun', country: 'India' },
    { name: 'Kerala (Alleppey)', cover: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', vibe: 'Emerald Backwaters & Houseboat Cruises', tag: 'Serene Lagoon', country: 'India' },
    { name: 'Pondicherry', cover: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', vibe: 'French White Town & Rock Beach Walk', tag: 'French Riviera', country: 'India' },
  ],
  adventure: [
    { name: 'Manali', cover: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', vibe: 'Solang Paragliding & Snow Peaks', tag: 'Adventure Hub', country: 'India' },
    { name: 'Rishikesh', cover: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e13?w=600&q=80', vibe: 'Ganga White Water Rafting & Yoga', tag: 'Rafting Capital', country: 'India' },
    { name: 'Ladakh (Leh)', cover: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600&q=80', vibe: 'Pangong Lake & Nubra Desert Dunes', tag: 'High Altitude Pass', country: 'India' },
  ],
  global: [
    { name: 'Paris', cover: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&q=80', vibe: 'Eiffel Tower, Louvre Art & Seine Cruises', tag: 'City of Light', country: 'France' },
    { name: 'Tokyo', cover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80', vibe: 'Shibuya Neon, Senso-ji & Ramen Trails', tag: 'Future Metropol', country: 'Japan' },
    { name: 'Bali', cover: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', vibe: 'Ubud Rice Terraces & Uluwatu Cliff Temple', tag: 'Island Oasis', country: 'Indonesia' },
    { name: 'Dubai', cover: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', vibe: 'Burj Khalifa, Fountains & Desert Safari', tag: 'Skyline Marvel', country: 'UAE' },
    { name: 'Singapore', cover: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80', vibe: 'Gardens by the Bay & Marina Bay Sands', tag: 'Garden City', country: 'Singapore' },
  ]
};

export default function TravelQuizModal({ onClose, onSelectDestination }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [vibe, setVibe] = useState('hills');
  const [days, setDays] = useState(3);
  const [groupType, setGroupType] = useState('couple');
  const [budget, setBudget] = useState('Moderate');

  const handleSelectVibe = (v) => {
    setVibe(v);
    setStep(2);
  };

  const handleSelectDays = (d) => {
    setDays(d);
    setStep(3);
  };

  const handleSelectGroup = (g) => {
    setGroupType(g);
    setStep(4);
  };

  const handleSelectBudget = (b) => {
    setBudget(b);
    setStep(5);
  };

  const handleChooseDestination = (destName) => {
    onClose();
    if (typeof onSelectDestination === 'function') {
      onSelectDestination(destName, days, budget, groupType);
    } else {
      navigate(`/planner?dest=${encodeURIComponent(destName)}&days=${days}&budget=${encodeURIComponent(budget)}&group=${groupType}&auto=1`);
    }
  };

  const recommendations = QUIZ_DESTINATIONS[vibe] || QUIZ_DESTINATIONS['hills'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          maxWidth: '560px',
          width: '100%',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          animation: 'fadeIn 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '15px',
            color: '#64748b'
          }}
        >
          ✕
        </button>

        {/* Quiz Progress Indicator Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', background: '#eff6ff', color: '#2563eb', fontWeight: 800, padding: '4px 12px', borderRadius: '20px' }}>
            🎯 Step {step} of 5
          </span>
          <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '10px', margin: '0 14px', overflow: 'hidden' }}>
            <div style={{ width: `${(step / 5) * 100}%`, height: '100%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', transition: 'width 0.3s ease' }}></div>
          </div>
        </div>

        {/* Step 1: Pick Vibe */}
        {step === 1 && (
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>✨ What is your travel vibe?</h3>
            <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#64748b' }}>Select the holiday experience you are craving right now.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => handleSelectVibe('hills')}
                style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fafafa', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
              >
                <div style={{ fontSize: '26px' }}>⛰️</div>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', marginTop: '6px' }}>Hills &amp; Lakes</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Matheran, Lonavala, Shimla, Munnar</span>
              </button>

              <button
                onClick={() => handleSelectVibe('heritage')}
                style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fafafa', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
              >
                <div style={{ fontSize: '26px' }}>🏰</div>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', marginTop: '6px' }}>Forts &amp; Heritage</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Jaipur, Udaipur, Varanasi, Agra</span>
              </button>

              <button
                onClick={() => handleSelectVibe('beach')}
                style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fafafa', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
              >
                <div style={{ fontSize: '26px' }}>🏖️</div>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', marginTop: '6px' }}>Beach &amp; Backwaters</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Goa, Kerala, Pondicherry</span>
              </button>

              <button
                onClick={() => handleSelectVibe('adventure')}
                style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fafafa', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
              >
                <div style={{ fontSize: '26px' }}>🏔️</div>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', marginTop: '6px' }}>Snow &amp; Adventure</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Manali, Rishikesh, Ladakh</span>
              </button>

              <button
                onClick={() => handleSelectVibe('global')}
                style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fafafa', cursor: 'pointer', textAlign: 'left', gridColumn: 'span 2', transition: 'all 0.2s' }}
              >
                <div style={{ fontSize: '26px' }}>🌐</div>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', marginTop: '6px' }}>Global International Metropolises</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Paris, Tokyo, Dubai, Singapore, Bali</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Trip Duration */}
        {step === 2 && (
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>📅 How long is your trip?</h3>
            <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#64748b' }}>Select available travel days.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[2, 3, 4, 5, 6, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => handleSelectDays(d)}
                  style={{
                    padding: '16px 8px',
                    borderRadius: '12px',
                    border: days === d ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
                    background: days === d ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <strong style={{ fontSize: '18px', color: '#1d4ed8', display: 'block' }}>{d} Days</strong>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{d <= 2 ? 'Weekend Getaway' : (d <= 4 ? 'Standard Holiday' : 'Full Expedition')}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Traveler Group */}
        {step === 3 && (
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>👥 Who are you traveling with?</h3>
            <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#64748b' }}>Optimizes schedule, dining, and activity pace.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => handleSelectGroup('solo')}
                style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ fontSize: '24px' }}>👤</div>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', marginTop: '4px' }}>Solo Traveler</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Hostels, cafes &amp; quiet spots</span>
              </button>
              <button
                onClick={() => handleSelectGroup('couple')}
                style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ fontSize: '24px' }}>❤️ Couple / Honeymoon</div>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', marginTop: '4px' }}>Romantic Getaway</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Sunsets &amp; romantic dinners</span>
              </button>
              <button
                onClick={() => handleSelectGroup('family')}
                style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ fontSize: '24px' }}>👨‍👩‍👧‍👦 Family &amp; Kids</div>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', marginTop: '4px' }}>Family Vacation</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Comfortable pace &amp; parks</span>
              </button>
              <button
                onClick={() => handleSelectGroup('friends')}
                style={{ padding: '14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ fontSize: '24px' }}>👥 Friends Group</div>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', marginTop: '4px' }}>Friends Adventure</strong>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Night markets &amp; adventure</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Budget Level */}
        {step === 4 && (
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>💰 What is your target budget level?</h3>
            <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#64748b' }}>Calculated in ₹ Indian Rupees.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => handleSelectBudget('Budget')}
                style={{ padding: '14px', borderRadius: '12px', border: '2px solid #86efac', background: '#f0fdf4', cursor: 'pointer', textAlign: 'left' }}
              >
                <strong style={{ fontSize: '14px', color: '#166534', display: 'block' }}>🏕️ Pocket-Friendly / Backpacker (₹)</strong>
                <span style={{ fontSize: '12px', color: '#475569' }}>Guesthouses, local transport &amp; street food (~₹1,500/day)</span>
              </button>

              <button
                onClick={() => handleSelectBudget('Moderate')}
                style={{ padding: '14px', borderRadius: '12px', border: '2px solid #93c5fd', background: '#eff6ff', cursor: 'pointer', textAlign: 'left' }}
              >
                <strong style={{ fontSize: '14px', color: '#1d4ed8', display: 'block' }}>🏩 Comfortable / Mid-Range (₹₹)</strong>
                <span style={{ fontSize: '12px', color: '#475569' }}>3-Star hotels, cabs &amp; heritage dining (~₹4,000/day)</span>
              </button>

              <button
                onClick={() => handleSelectBudget('Luxury')}
                style={{ padding: '14px', borderRadius: '12px', border: '2px solid #fcd34d', background: '#fffbeb', cursor: 'pointer', textAlign: 'left' }}
              >
                <strong style={{ fontSize: '14px', color: '#b45309', display: 'block' }}>🏰 Premium Luxury Resort (₹₹₹)</strong>
                <span style={{ fontSize: '12px', color: '#475569' }}>5-Star luxury resorts &amp; fine dining (~₹15,000/day)</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Recommendations */}
        {step === 5 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <span style={{ fontSize: '36px' }}>🎉</span>
              <h3 style={{ margin: '4px 0 2px', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Top Destination Recommendations</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Matched for {days} Days • {groupType.toUpperCase()} • {budget} Budget in ₹ INR</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
              {recommendations.map((dest) => (
                <div
                  key={dest.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px',
                    transition: 'all 0.2s'
                  }}
                >
                  <img src={dest.cover} alt={dest.name} style={{ width: '68px', height: '68px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>{dest.name}</strong>
                      <span style={{ background: '#2563eb', color: 'white', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>{dest.tag}</span>
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>{dest.vibe}</p>
                  </div>
                  <button
                    onClick={() => handleChooseDestination(dest.name)}
                    style={{
                      background: 'linear-gradient(135deg, #16a34a, #15803d)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                    }}
                  >
                    ⚡ Auto-Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
