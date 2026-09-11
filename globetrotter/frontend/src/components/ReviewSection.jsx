import { useState, useEffect } from 'react';
import api from '../api/axios';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Format an ISO date string as "12 Aug 2026"
 */
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Deterministic background colour for an avatar initial circle based on userName.
 */
function avatarColor(name = '') {
  const palette = [
    '#6366f1', '#f59e0b', '#10b981', '#ef4444',
    '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

// ─── Sub-components ─────────────────────────────────────────────────────────

/** Renders N filled + (5-N) empty stars */
function StarRow({ rating, size = 18 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: size,
            color: s <= Math.round(rating) ? '#f59e0b' : '#d1d5db',
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/** Interactive star selector for the write-review form */
function StarSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <span style={{ display: 'inline-flex', gap: 4, cursor: 'pointer' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: 32,
            color: s <= (hovered || value) ? '#f59e0b' : '#d1d5db',
            transition: 'color 0.1s',
            userSelect: 'none',
          }}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          role="button"
          aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/** Single review card */
function ReviewCard({ review }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount ?? 0);
  const [voting, setVoting] = useState(false);

  async function handleHelpful() {
    if (voting) return;
    setVoting(true);
    try {
      const res = await api.post(`/reviews/${review.id}/helpful`);
      setHelpfulCount(res.data?.helpfulCount ?? helpfulCount + 1);
    } catch {
      // Optimistic fallback
      setHelpfulCount((c) => c + 1);
    } finally {
      setVoting(false);
    }
  }

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '18px 20px',
        marginBottom: 14,
      }}
    >
      {/* Header: avatar + name + date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: avatarColor(review.userName),
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {(review.userName || '?')[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: '#111827', fontSize: 15 }}>
            {review.userName || 'Anonymous'}
          </div>
          <div style={{ color: '#6b7280', fontSize: 13 }}>{formatDate(review.createdAt)}</div>
        </div>
        <StarRow rating={review.rating} size={16} />
      </div>

      {/* Review text */}
      {review.text && (
        <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.6, margin: '0 0 12px' }}>
          {review.text}
        </p>
      )}

      {/* Optional photo */}
      {review.photoUrl && (
        <img
          src={review.photoUrl}
          alt="Review photo"
          style={{
            width: '100%',
            maxHeight: 260,
            objectFit: 'cover',
            borderRadius: 8,
            marginBottom: 12,
          }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}

      {/* Helpful button */}
      <button
        onClick={handleHelpful}
        disabled={voting}
        style={{
          background: 'none',
          border: '1px solid #d1d5db',
          borderRadius: 20,
          padding: '4px 14px',
          cursor: voting ? 'default' : 'pointer',
          fontSize: 13,
          color: '#374151',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          opacity: voting ? 0.6 : 1,
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { if (!voting) e.currentTarget.style.background = '#f3f4f6'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
      >
        👍 Helpful ({helpfulCount})
      </button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

/**
 * ReviewSection — full review display + submission widget.
 *
 * Props:
 *   destinationKey  {string}       Unique slug / key for the destination
 *   destinationName {string}       Human-readable name shown in UI copy
 *   currentUser     {object|null}  Logged-in user object; null means guest
 */
export default function ReviewSection({ destinationKey, destinationName, currentUser }) {
  // ── State ────────────────────────────────────────────────────────────────
  const [reviews, setReviews]           = useState([]);
  const [avgRating, setAvgRating]       = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [newReview, setNewReview]       = useState({ rating: 5, text: '', photoUrl: '' });
  const [submitting, setSubmitting]     = useState(false);
  const [submitMsg, setSubmitMsg]       = useState('');
  const [showAll, setShowAll]           = useState(false);

  // ── Fetch reviews ────────────────────────────────────────────────────────
  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await api.get(`/reviews/${destinationKey}`);
      const data = res.data;
      setReviews(data.reviews ?? []);
      setAvgRating(data.avgRating ?? 0);
      setTotalReviews(data.totalReviews ?? data.reviews?.length ?? 0);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (destinationKey) fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationKey]);

  // ── Rating distribution counts ───────────────────────────────────────────
  function ratingCounts() {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const rounded = Math.round(r.rating);
      if (rounded >= 1 && rounded <= 5) counts[rounded]++;
    });
    return counts;
  }

  // ── Submit new review ────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (!newReview.text.trim()) {
      setSubmitMsg('❗ Please write your review before submitting.');
      return;
    }
    setSubmitting(true);
    setSubmitMsg('');
    try {
      await api.post(`/reviews/${destinationKey}`, {
        rating: newReview.rating,
        text: newReview.text.trim(),
        photoUrl: newReview.photoUrl.trim(),
      });
      setSubmitMsg('✅ Your review was submitted successfully!');
      setNewReview({ rating: 5, text: '', photoUrl: '' });
      setShowForm(false);
      await fetchReviews();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review. Please try again.';
      setSubmitMsg(`❌ ${msg}`);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Derived values ───────────────────────────────────────────────────────
  const displayedReviews = showAll ? reviews : reviews.slice(0, 5);
  const counts           = ratingCounts();
  const maxCount         = Math.max(...Object.values(counts), 1);

  // ── Shared styles ────────────────────────────────────────────────────────
  const cardStyle = {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: '24px 28px',
    marginBottom: 20,
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section
      style={{ fontFamily: "'Segoe UI', sans-serif", maxWidth: 760, margin: '0 auto', padding: '32px 0' }}
      aria-label="Reviews"
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 20 }}>
        Traveller Reviews{destinationName ? ` — ${destinationName}` : ''}
      </h2>

      {/* ── Aggregate Rating Summary ─────────────────────────────────────── */}
      {!loading && totalReviews > 0 && (
        <div
          style={{
            ...cardStyle,
            display: 'flex',
            gap: 36,
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          {/* Large number + star row + count */}
          <div style={{ textAlign: 'center', minWidth: 120 }}>
            <div style={{ fontSize: 56, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
              {Number(avgRating).toFixed(1)}
            </div>
            <div style={{ margin: '8px 0 4px' }}>
              <StarRow rating={avgRating} size={22} />
            </div>
            <div style={{ color: '#6b7280', fontSize: 14 }}>
              ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
            </div>
          </div>

          {/* Distribution bar chart: 5★ → 1★ */}
          <div style={{ flex: 1, minWidth: 220 }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = counts[star];
              const pct   = Math.round((count / maxCount) * 100);
              return (
                <div
                  key={star}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}
                >
                  <span style={{ width: 22, color: '#374151', fontSize: 13, textAlign: 'right' }}>
                    {star}★
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 10,
                      background: '#e5e7eb',
                      borderRadius: 5,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: '#f59e0b',
                        borderRadius: 5,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                  <span style={{ width: 22, color: '#6b7280', fontSize: 13 }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Loading state ────────────────────────────────────────────────── */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
          Loading reviews…
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {!loading && totalReviews === 0 && (
        <div style={{ ...cardStyle, textAlign: 'center', color: '#6b7280', padding: '32px' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>✈️</div>
          <p style={{ margin: 0 }}>
            No reviews yet for {destinationName || 'this destination'}. Be the first!
          </p>
        </div>
      )}

      {/* ── Review Cards ─────────────────────────────────────────────────── */}
      {!loading && displayedReviews.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Show all / collapse toggle */}
      {!loading && reviews.length > 5 && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button
            onClick={() => setShowAll((v) => !v)}
            style={{
              background: 'none',
              border: '1px solid #6366f1',
              color: '#6366f1',
              borderRadius: 8,
              padding: '8px 20px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ede9fe'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
          >
            {showAll ? '▲ Show fewer reviews' : `▼ Show all ${totalReviews} reviews`}
          </button>
        </div>
      )}

      {/* ── Write Review Section ──────────────────────────────────────────── */}
      <div style={cardStyle}>
        {currentUser ? (
          <>
            {/* Toggle button (when form is hidden) */}
            {!showForm && (
              <button
                onClick={() => { setShowForm(true); setSubmitMsg(''); }}
                style={{
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 22px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 15,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#4f46e5'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#6366f1'; }}
              >
                ✍️ Write a Review
              </button>
            )}

            {/* Success message shown after form is closed */}
            {!showForm && submitMsg && (
              <p style={{ marginTop: 12, color: '#059669', fontWeight: 500 }}>{submitMsg}</p>
            )}

            {/* Review form */}
            {showForm && (
              <form onSubmit={handleSubmit} noValidate>
                <h3 style={{ margin: '0 0 16px', color: '#111827', fontSize: 18 }}>
                  ✍️ Write a Review
                </h3>

                {/* Interactive star selector */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#374151' }}>
                    Your Rating
                  </label>
                  <StarSelector
                    value={newReview.rating}
                    onChange={(r) => setNewReview((prev) => ({ ...prev, rating: r }))}
                  />
                  <span style={{ marginLeft: 10, color: '#6b7280', fontSize: 14 }}>
                    {newReview.rating} / 5
                  </span>
                </div>

                {/* Review textarea */}
                <div style={{ marginBottom: 16 }}>
                  <label
                    htmlFor="review-text"
                    style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#374151' }}
                  >
                    Your Review
                  </label>
                  <textarea
                    id="review-text"
                    value={newReview.text}
                    onChange={(e) =>
                      setNewReview((prev) => ({ ...prev, text: e.target.value.slice(0, 500) }))
                    }
                    placeholder={`Share your experience at ${destinationName || 'this destination'}…`}
                    rows={5}
                    maxLength={500}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 15,
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#6366f1'; }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = '#d1d5db'; }}
                  />
                  <div style={{ textAlign: 'right', fontSize: 12, color: '#9ca3af', marginTop: 3 }}>
                    {newReview.text.length} / 500
                  </div>
                </div>

                {/* Optional photo URL */}
                <div style={{ marginBottom: 20 }}>
                  <label
                    htmlFor="review-photo"
                    style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#374151' }}
                  >
                    Photo URL{' '}
                    <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span>
                  </label>
                  <input
                    id="review-photo"
                    type="url"
                    value={newReview.photoUrl}
                    onChange={(e) =>
                      setNewReview((prev) => ({ ...prev, photoUrl: e.target.value }))
                    }
                    placeholder="https://example.com/my-photo.jpg"
                    style={{
                      width: '100%',
                      padding: '9px 14px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#6366f1'; }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = '#d1d5db'; }}
                  />
                </div>

                {/* Submission feedback */}
                {submitMsg && (
                  <p
                    style={{
                      marginBottom: 14,
                      fontWeight: 500,
                      color: submitMsg.startsWith('✅') ? '#059669' : '#dc2626',
                    }}
                  >
                    {submitMsg}
                  </p>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      background: submitting ? '#a5b4fc' : '#6366f1',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 24px',
                      cursor: submitting ? 'default' : 'pointer',
                      fontWeight: 600,
                      fontSize: 15,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = '#4f46e5'; }}
                    onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = '#6366f1'; }}
                  >
                    {submitting ? 'Submitting…' : 'Submit Review'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setSubmitMsg(''); }}
                    style={{
                      background: 'none',
                      border: '1px solid #d1d5db',
                      color: '#374151',
                      borderRadius: 8,
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontSize: 15,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          /* Guest / not-logged-in state */
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 28 }}>🔒</span>
            <p style={{ margin: 0, color: '#374151', fontSize: 15 }}>
              <strong>Login</strong> to write a review for{' '}
              {destinationName || 'this destination'}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
