import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="page-container" style={{ maxWidth: '860px', margin: '0 auto', padding: '36px 20px' }}>
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '36px', boxShadow: '0 4px 20px rgba(15,23,42,0.06)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Last updated: September 2026</p>

        <section style={{ marginBottom: '20px', lineHeight: '1.7', color: '#334155' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>1. Information We Collect</h3>
          <p>
            GlobeTrotter collects information you provide directly to us when creating an account, generating travel itineraries, saving destinations, and making tour reservations. This may include your name, email address, phone number, and location preferences.
          </p>
        </section>

        <section style={{ marginBottom: '20px', lineHeight: '1.7', color: '#334155' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>2. How We Use Your Data</h3>
          <p>
            We use collected data to generate personalized AI itineraries, provide live weather and air quality telemetry, calculate accurate travel budgets, and process verified booking reservations. We do not sell your personal data to third parties.
          </p>
        </section>

        <section style={{ marginBottom: '20px', lineHeight: '1.7', color: '#334155' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>3. Third-Party Integrations</h3>
          <p>
            GlobeTrotter interacts with mapping (OpenStreetMap, Mapbox), encyclopedic (Wikipedia), and telemetry services (Open-Meteo). These services receive anonymized coordinates strictly to fulfill navigation and weather requests.
          </p>
        </section>

        <section style={{ marginBottom: '24px', lineHeight: '1.7', color: '#334155' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px' }}>4. Data Deletion &amp; Rights</h3>
          <p>
            You have full control over your itineraries and account profile. You can export your data anytime as JSON backups or delete your trips and account directly from your settings.
          </p>
        </section>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
          <Link to="/terms" style={{ color: '#64748b', fontSize: '0.9rem', textDecoration: 'underline' }}>Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
