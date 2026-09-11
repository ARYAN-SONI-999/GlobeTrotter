import React, { useState } from 'react';

const VR_LANDMARKS = {
  'taj mahal': {
    name: 'Taj Mahal, Agra',
    tag: 'UNESCO World Heritage Wonder',
    panoramaUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80',
    description: 'An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife Mumtaz Mahal.',
    facts: ['Built over 22 years by 20,000 artisans', 'Changes color from pinkish at dawn to milky white at night', 'Made with translucent white marble inlaid with 28 types of precious stones']
  },
  'amber fort': {
    name: 'Amber Fort & Palace, Jaipur',
    tag: 'Royal Rajput Architecture',
    panoramaUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80',
    description: 'Located high on a hill, it is the principal tourist attraction in Jaipur. Known for its artistic Hindu style elements, scenic Maota Lake views and Sheesh Mahal mirror palace.',
    facts: ['Features Sheesh Mahal where a single candle illuminates the entire hall', 'Connected to Jaigarh Fort via subterranean passages', 'Blends Hindu and Mughal architectural styles']
  },
  'hampi': {
    name: 'Stone Chariot & Ruins, Hampi',
    tag: 'Vijayanagara Empire Capital',
    panoramaUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
    description: 'An ancient village dotted with ruined temple complexes from the Vijayanagara Empire. The Vittala Temple Stone Chariot is an iconic Indian heritage symbol.',
    facts: ['Carved out of giant granite boulders', 'Pillars in Vittala Temple produce musical notes when tapped', 'Capital of the wealthy 14th-century Vijayanagara Empire']
  },
  'varanasi': {
    name: 'Dashashwamedh Ghat, Varanasi',
    tag: 'Spiritual Capital of India',
    panoramaUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80',
    description: 'The main ghat on the Ganges River in Varanasi. Famous for the spectacular Ganga Aarti ceremony held every evening with oil lamps and brass cymbals.',
    facts: ['One of the oldest continuously inhabited cities in the world', 'Lord Brahma is believed to have created it to welcome Lord Shiva', 'Ganga Aarti draws thousands of pilgrims daily at sunset']
  },
  'default': {
    name: 'Indian Heritage Landmark',
    tag: 'Cultural Heritage Site',
    panoramaUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80',
    description: 'Explore the rich history, intricate carvings, and timeless majesty of Indian monuments.',
    facts: ['Rich architectural history spanning millennia', 'Preserved cultural monument under ASI care', 'Must-visit spot for photography and history enthusiasts']
  }
};

export default function LandmarkVRViewer({ landmarkKey = 'taj mahal', onClose }) {
  const key = landmarkKey.toLowerCase().replace(/[\s-]+/g, '');
  let data = VR_LANDMARKS['default'];
  for (const k in VR_LANDMARKS) {
    if (key.includes(k) || k.includes(key)) {
      data = VR_LANDMARKS[k];
      break;
    }
  }

  const [activeTab, setActiveTab] = useState('360');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '16px', maxWidth: '720px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', position: 'relative' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontWeight: 700, fontSize: '16px' }}
        >
          ✕
        </button>

        {/* 360 Viewport Header / Image */}
        <div style={{ position: 'relative', height: '320px', background: '#000', overflow: 'hidden' }}>
          <img
            src={data.panoramaUrl}
            alt={data.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.05)', transition: 'transform 10s ease' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px', color: 'white' }}>
            <span style={{ background: '#2563eb', color: 'white', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', display: 'inline-block', width: 'fit-content', marginBottom: '6px' }}>
              🥽 360° Virtual Preview • {data.tag}
            </span>
            <h2 style={{ margin: 0, fontSize: '22px', color: 'white', fontWeight: 800 }}>{data.name}</h2>
          </div>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '20px' }}>
          <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{data.description}</p>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
            <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '8px' }}>💡 Fascinating Historical Facts:</strong>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
              {data.facts.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
