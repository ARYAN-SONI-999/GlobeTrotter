import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ExpenseSplitter from '../components/ExpenseSplitter';
import GroupExpenseSplitter from '../components/GroupExpenseSplitter';
import CurrencyConverterWidget from '../components/CurrencyConverterWidget';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function BudgetView() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingBudget, setEditingBudget] = useState(false);
  const [targetBudget, setTargetBudget] = useState('');
  const [savingBudget, setSavingBudget] = useState(false);

  const loadData = async () => {
    try {
      const [tripRes, budgetRes] = await Promise.all([
        api.get(`/trips/${tripId}`),
        api.get(`/trips/${tripId}/budget`)
      ]);
      setTrip(tripRes.data);
      setBudget(budgetRes.data);
      setTargetBudget(tripRes.data.budget !== null ? tripRes.data.budget : '');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load budget.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tripId]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    setSavingBudget(true);
    try {
      await api.put(`/trips/${tripId}`, {
        budget: targetBudget ? Number(targetBudget) : null
      });
      setEditingBudget(false);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update budget.');
    } finally {
      setSavingBudget(false);
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Calculating budget...</p></div>;
  if (error) return <div className="page-container"><p className="form-error">{error}</p></div>;

  const { total, breakdown, averagePerDay, tripBudget, dailyBudgetThreshold, dailyBudget, perStop } = budget;
  const maxBar = Math.max(breakdown.stay, breakdown.transport, breakdown.activities, breakdown.meals, 1);

  const pieColors = { stay: '#2563eb', transport: '#f59e0b', activities: '#10b981', meals: '#ef4444' };
  let cumulativePct = 0;
  const pieSlices = Object.entries(breakdown).map(([key, value]) => {
    const pct = total > 0 ? (value / total) * 100 : 0;
    const start = cumulativePct;
    cumulativePct += pct;
    return { key, value, pct, start, end: cumulativePct, color: pieColors[key] || '#999' };
  });
  const pieGradient = total > 0
    ? `conic-gradient(${pieSlices.map((s) => `${s.color} ${s.start}% ${s.end}%`).join(', ')})`
    : '#e5e7eb';

  const overbudgetDaysCount = (dailyBudget || []).filter((d) => d.isOverBudget).length;

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1>Budget & Cost Breakdown</h1>
          <p className="page-subtitle">{trip.name}</p>
        </div>
        <div className="header-actions">
          <Link to={`/trips/${tripId}`} className="btn btn-outline">Back to Itinerary</Link>
          <button className="btn btn-primary" onClick={() => setEditingBudget(!editingBudget)}>
            {editingBudget ? 'Close' : tripBudget ? 'Edit Target Budget' : '+ Set Target Budget'}
          </button>
        </div>
      </div>

      {editingBudget && (
        <form className="card-form" onSubmit={handleSaveBudget} style={{ marginBottom: '20px' }}>
          <h3>Set Trip Target Budget</h3>
          <p className="page-subtitle" style={{ fontSize: '0.85rem' }}>
            Setting a target budget calculates daily limits and flags overbudget days automatically.
          </p>
          <div className="form-row">
            <input
              type="number"
              placeholder="Total Budget (₹ INR)"
              value={targetBudget}
              onChange={(e) => setTargetBudget(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={savingBudget}>
              {savingBudget ? 'Saving...' : 'Save Target Budget'}
            </button>
          </div>
        </form>
      )}

      <div className="budget-summary-grid">
        <div className="budget-total-card">
          <span className="budget-total-label">Estimated Total Cost</span>
          <span className="budget-total-value">₹{total.toLocaleString()}</span>
          <span className="budget-total-sub">≈ ₹{averagePerDay.toLocaleString()} / day average</span>
        </div>

        <div className="budget-stat-card">
          <span className="budget-stat-label">Daily Budget Limit</span>
          <span className="budget-stat-value">₹{dailyBudgetThreshold.toLocaleString()}</span>
          <span className="budget-stat-sub">
            {tripBudget ? `Based on target budget of ₹${tripBudget.toLocaleString()}` : 'Default limit (1.5× avg daily spend)'}
          </span>
        </div>

        <div className={`budget-stat-card ${overbudgetDaysCount > 0 ? 'alert' : 'success'}`}>
          <span className="budget-stat-label">Overbudget Days</span>
          <span className="budget-stat-value" style={{ color: overbudgetDaysCount > 0 ? '#dc2626' : '#16a34a' }}>
            {overbudgetDaysCount} {overbudgetDaysCount === 1 ? 'day' : 'days'}
          </span>
          <span className="budget-stat-sub">
            {overbudgetDaysCount > 0 ? '⚠️ Days exceeding daily threshold' : '✓ All days within budget'}
          </span>
        </div>
      </div>

      {/* Multi-Currency Conversion Widget */}
      <div style={{ marginTop: '20px', marginBottom: '24px' }}>
        <CurrencyConverterWidget amountINR={total} />
      </div>

      <section className="builder-section" style={{ marginTop: '24px' }}>
        <h2>📅 Daily Budget & Overbudget Alerts</h2>
        {(!dailyBudget || dailyBudget.length === 0) ? (
          <p className="empty-state">Add stops and dates to your itinerary to view daily budget breakdown.</p>
        ) : (
          <div className="daily-budget-table-wrap">
            <div className="daily-budget-table">
              <div className="daily-budget-row daily-budget-row-head">
                <span>Date</span>
                <span>Destination</span>
                <span>Est. Spend</span>
                <span>Threshold</span>
                <span>Status</span>
              </div>
              {dailyBudget.map((day) => (
                <div className={`daily-budget-row ${day.isOverBudget ? 'row-overbudget' : ''}`} key={day.date}>
                  <span className="day-date-col">{formatDate(day.date)}</span>
                  <span className="day-city-col">{day.city}</span>
                  <span className="day-cost-col">₹{day.dayCost.toLocaleString()}</span>
                  <span className="day-limit-col">₹{day.budgetThreshold.toLocaleString()}</span>
                  <span className="day-status-col">
                    {day.isOverBudget ? (
                      <span className="badge-overbudget">⚠ Over Budget (+₹{(day.dayCost - day.budgetThreshold).toLocaleString()})</span>
                    ) : (
                      <span className="badge-onbudget">✓ Within Budget</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="builder-section">
        <h2>Cost Breakdown by Category</h2>
        <div className="budget-bar-chart">
          {Object.entries(breakdown).map(([key, value]) => (
            <div className="budget-bar-row" key={key}>
              <span className="budget-bar-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <div className="budget-bar-track">
                <div className="budget-bar-fill" style={{ width: `${(value / maxBar) * 100}%` }} />
              </div>
              <span className="budget-bar-value">₹{value.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="budget-pie-row">
          <div className="budget-pie-chart" style={{ background: pieGradient }} role="img" aria-label="Cost breakdown pie chart">
            <div className="budget-pie-center">
              <span className="budget-pie-center-value">₹{total.toLocaleString()}</span>
              <span className="budget-pie-center-label">Total</span>
            </div>
          </div>
          <div className="budget-pie-legend">
            {pieSlices.map(({ key, value, pct, color }) => (
              <div className="pie-legend-item" key={key}>
                <span className="pie-swatch" style={{ background: color }} />
                {key.charAt(0).toUpperCase() + key.slice(1)}: {Math.round(pct)}% (₹{value.toLocaleString()})
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="builder-section">
        <h2>Cost by Stop</h2>
        {perStop.length === 0 ? (
          <p className="empty-state">Add stops to your trip to see a per-stop cost breakdown.</p>
        ) : (
          <div className="stop-budget-list">
            {perStop.map((stop) => {
              const stopTotal = stop.stayCost + stop.activityCost;
              return (
                <div className="stop-budget-row" key={stop.stopId}>
                  <div>
                    <strong>{stop.city}</strong>
                    <span className="stop-budget-meta">{stop.nights} night(s) · {stop.activityCount} activities</span>
                  </div>
                  <div className="stop-budget-amount">
                    ₹{stopTotal.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="builder-section" style={{ marginTop: '24px' }}>
        <GroupExpenseSplitter tripName={trip?.name || 'Our Trip'} />
      </section>

      <section className="builder-section" style={{ marginTop: '24px' }}>
        <ExpenseSplitter tripName={trip?.name || 'Our Trip'} />
      </section>
    </div>
  );
}
