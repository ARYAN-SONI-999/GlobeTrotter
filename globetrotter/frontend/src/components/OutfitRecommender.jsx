import React from 'react';

export default function OutfitRecommender({ destinationName = 'Destination', temp = 24, condition = 'Clear' }) {
  let recommendations = [];
  let footwear = [];
  let accessories = [];
  let badge = '🌤️ Mild Weather Essentials';

  if (temp > 32) {
    badge = '☀️ Hot Weather Essentials';
    recommendations = ['Light breathable cotton t-shirts', 'Linen shirts/dresses', 'Comfortable shorts/trousers', 'UV protection sunglasses'];
    footwear = ['Breathable mesh sneakers', 'Open sandals / Flip-flops'];
    accessories = ['SPF 50+ Sunscreen', 'Wide-brim hat / Cap', 'Insulated water bottle'];
  } else if (temp < 10) {
    badge = '❄️ Cold Weather Woolens';
    recommendations = ['Thermal innerwear (top & bottom)', 'Puffer jacket / Heavy coat', 'Woolen sweaters & hoodies', 'Warm fleece trousers'];
    footwear = ['Warm boots with grip', 'Thick woolen socks'];
    accessories = ['Woolen beanie / Cap', 'Gloves / Mittens', 'Lip balm & moisturizer'];
  } else {
    badge = '🌿 Moderate Travel Outfits';
    recommendations = ['Comfortable casual t-shirts', 'Light jacket / Windcheater for evenings', 'Jeans / Chinos', 'Cotton shirts'];
    footwear = ['Walking sneakers / Running shoes'];
    accessories = ['Sunscreen SPF 30', 'Sunglasses', 'Light daypack backpack'];
  }

  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15,23,42,0.06)', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          👗 Weather Outfit &amp; Gear Recommender
        </h3>
        <span style={{ background: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}>
          {badge} ({temp}°C)
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {/* Outfits */}
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
          <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '6px' }}>👕 Outfits to Pack:</strong>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
            {recommendations.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Footwear */}
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
          <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '6px' }}>👟 Recommended Footwear:</strong>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
            {footwear.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Accessories */}
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
          <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', marginBottom: '6px' }}>🎒 Key Accessories:</strong>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
            {accessories.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
