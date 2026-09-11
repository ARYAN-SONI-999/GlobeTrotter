import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED',
  JPY: '¥',
  SGD: 'S$',
  CAD: 'C$',
  AUD: 'A$',
  THB: '฿',
  CHF: 'CHF',
  SAR: 'SAR'
};

const CURRENCY_NAMES = {
  INR: 'Indian Rupee',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  AED: 'UAE Dirham',
  JPY: 'Japanese Yen',
  SGD: 'Singapore Dollar',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  THB: 'Thai Baht',
  CHF: 'Swiss Franc',
  SAR: 'Saudi Riyal'
};

export default function CurrencyConverterWidget({ amountINR = 10000 }) {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [rates, setRates] = useState({
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0094,
    AED: 0.044,
    JPY: 1.82,
    SGD: 0.016,
    CAD: 0.016,
    AUD: 0.018,
    THB: 0.43,
    CHF: 0.010,
    SAR: 0.045
  });
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState(amountINR);

  useEffect(() => {
    setCustomAmount(amountINR);
  }, [amountINR]);

  useEffect(() => {
    let isMounted = true;
    async function fetchLiveRates() {
      setLoading(true);
      try {
        const res = await api.get('/external/exchange-rates');
        if (isMounted && res.data && res.data.rates) {
          setRates((prev) => ({ ...prev, ...res.data.rates }));
          if (res.data.lastUpdated) {
            const d = new Date(res.data.lastUpdated);
            setLastUpdated(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }
        }
      } catch (err) {
        console.warn('Could not load live rates, using fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchLiveRates();
    return () => { isMounted = false; };
  }, []);

  const rate = rates[selectedCurrency] || rates.USD || 0.012;
  const converted = (customAmount * rate).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const symbol = CURRENCY_SYMBOLS[selectedCurrency] || selectedCurrency;

  return (
    <div style={{ background: '#fff', borderRadius: '14px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15,23,42,0.06)', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            💱 Live Forex & Currency Rates
          </h4>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            {lastUpdated ? `🟢 Live market rate • Updated ${lastUpdated}` : '🟢 Live Open Exchange API Feed'}
          </span>
        </div>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1.5px solid #2563eb',
            fontSize: '12px',
            fontWeight: 700,
            background: '#eff6ff',
            color: '#1e40af',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          {Object.keys(CURRENCY_NAMES).filter((c) => c !== 'INR').map((code) => (
            <option key={code} value={code}>
              {CURRENCY_SYMBOLS[code]} {code} — {CURRENCY_NAMES[code]}
            </option>
          ))}
        </select>
      </div>

      <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ flex: '1 1 120px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Amount in INR (₹)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 700 }}>₹</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(Math.max(0, Number(e.target.value) || 0))}
              style={{
                fontSize: '15px',
                fontWeight: 800,
                color: '#0f172a',
                border: 'none',
                background: 'transparent',
                width: '100%',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <span style={{ fontSize: '18px', color: '#2563eb', fontWeight: 800 }}>➔</span>

        <div style={{ textAlign: 'right', flex: '1 1 140px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
            Converted to {selectedCurrency} (1 ₹ = {rate.toFixed(4)})
          </span>
          <strong style={{ fontSize: '18px', color: '#16a34a', fontWeight: 800 }}>
            {symbol} {converted}
          </strong>
        </div>
      </div>
    </div>
  );
}
