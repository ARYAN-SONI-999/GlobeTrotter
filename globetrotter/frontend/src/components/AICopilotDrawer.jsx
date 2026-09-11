import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const QUICK_PROMPTS = [
  '💡 Top hidden gems nearby',
  '🍜 Best local street food',
  '🌤️ Weather & travel advice',
  '🎒 What should I pack?',
  '🚌 Best local transport options'
];

export default function AICopilotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '👋 Hi! I am your GlobeTrotter AI Copilot. Ask me anything about destinations, itineraries, safety, or local food!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const location = useLocation();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = generateAIReply(query, location.pathname);
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIReply = (q, path) => {
    const lower = q.toLowerCase();
    if (lower.includes('food') || lower.includes('street') || lower.includes('eat')) {
      return '🍜 Top local picks: Try regional thalis, artisanal chikki in Lonavala, spicy dal baati churma in Rajasthan, or fresh seafood in Goa!';
    } else if (lower.includes('weather') || lower.includes('pack') || lower.includes('wear')) {
      return '🌤️ Best Advice: Pack lightweight cottons for summer/coastal trips, warm woolens for hill stations, and waterproof jackets if traveling during monsoons (Jul-Sep).';
    } else if (lower.includes('hidden') || lower.includes('gem') || lower.includes('secret')) {
      return '💎 Insider Gem: Visit Echo Point at sunrise in Matheran, explore Pataleshwar Caves, or take an early morning boat ride on Lake Pichola in Udaipur!';
    } else if (lower.includes('transport') || lower.includes('bus') || lower.includes('cab')) {
      return '🚌 Transit Tip: Pre-book IRCTC trains early for long distance travel. For local sightseeing, auto-rickshaws or rented two-wheelers are ideal!';
    } else {
      return `✨ GlobeTrotter AI Recommendation: Based on your current view (${path}), make sure to check local crowd ratings, pack hydration, and save your favorite spots to your wishlist!`;
    }
  };

  return (
    <>
      {/* Floating Copilot Toggle Button */}
      <button
        className="ai-copilot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Open GlobeTrotter AI Copilot"
        aria-label="Open GlobeTrotter AI Copilot"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 998,
          background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 20px',
          fontWeight: 700,
          fontSize: '0.92rem',
          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🤖</span>
        <span className="copilot-btn-label">AI Copilot</span>
      </button>

      {/* Copilot Chat Drawer / Window */}
      {isOpen && (
        <div
          className="ai-copilot-drawer"
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            width: '360px',
            maxHeight: '520px',
            height: '80vh',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
            border: '1px solid #e2e8f0',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            color: 'white',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>🤖</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>GlobeTrotter Copilot</h4>
                <span style={{ fontSize: '0.72rem', opacity: 0.9 }}>🟢 Live AI Travel Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.sender === 'user' ? '#3b82f6' : '#f1f5f9',
                  color: m.sender === 'user' ? 'white' : '#0f172a',
                  padding: '10px 14px',
                  borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  fontSize: '0.86rem',
                  lineHeight: 1.4
                }}
              >
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: '#f1f5f9', padding: '8px 14px', borderRadius: '14px', fontSize: '0.8rem', color: '#64748b' }}>
                Copilot is thinking... 💭
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '6px 12px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', overflowX: 'auto', display: 'flex', gap: '6px', whiteSpace: 'nowrap' }}>
            {QUICK_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                style={{
                  background: 'white',
                  border: '1px solid #cbd5e1',
                  borderRadius: '14px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#334155'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Row */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ padding: '10px 12px', display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', background: 'white' }}
          >
            <input
              type="text"
              placeholder="Ask Copilot travel questions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                fontSize: '0.84rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </>
  );
}
