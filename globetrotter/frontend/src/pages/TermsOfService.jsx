import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="page-container" style={{ maxWidth: '860px', margin: '0 auto', padding: '36px 20px' }}>
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '36px', boxShadow: '0 4px 20px rgba(15,23,42,0.06)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Terms of Service</h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Last updated: September 2026</p>

        <section style={{ marginBottom: '20px', lineHeight: '1.7', color: '#334155' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>1. Acceptance of Terms</h3>
          <p>
            By accessing or using GlobeTrotter, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
          </p>
        </section>

        <section style={{ marginBottom: '20px', lineHeight: '1.7', color: '#334155' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>2. Travel Planning &amp; Booking Disclaimer</h3>
          <p>
            GlobeTrotter provides travel planning tools, route optimization, and tour reservation facilitation. While we strive for maximum accuracy in transit rates, weather forecasts, and opening hours, actual conditions and pricing are subject to local provider availability.
          </p>
        </section>

        <section style={{ marginBottom: '20px', lineHeight: '1.7', color: '#334155' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>3. User Conduct</h3>
          <p>
            Users agree not to use the platform for fraudulent activity, unauthorized scraping, or publishing inappropriate or abusive content in public community travel itineraries.
          </p>
        </section>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
          <Link to="/privacy" style={{ color: '#64748b', fontSize: '0.9rem', textDecoration: 'underline' }}>Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
