import React, { useState, useEffect } from 'react';

export default function AudioGuideButton({ placeName, description, insiderTip, category }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (!supported) return;

    const synth = window.speechSynthesis;

    if (isPlaying && !isPaused) {
      synth.pause();
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      synth.resume();
      setIsPaused(false);
      return;
    }

    synth.cancel(); // Stop any previous speech

    const narrationText = `Welcome to ${placeName}. ${description || ''} ${insiderTip ? `Here is an insider tip for your visit: ${insiderTip}` : ''} Enjoy your trip!`;

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 0.95; // Slightly slower, clear speech rate
    utterance.pitch = 1.0;

    // Pick an English voice if available
    const voices = synth.getVoices();
    const engVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('India') || v.name.includes('Natural') || v.name.includes('Google')));
    if (engVoice) utterance.voice = engVoice;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    synth.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!supported) return null;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <button
        type="button"
        onClick={handleTogglePlay}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: isPlaying ? (isPaused ? '#d97706' : '#16a34a') : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          color: 'white',
          border: 'none',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.78rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(124,58,237,0.25)',
          transition: 'all 0.2s ease',
        }}
        title="Listen to AI Narrated Audio Guide"
      >
        <span>{isPlaying ? (isPaused ? '▶️ Resume' : '⏸️ Pause') : '🎧 Listen Audio Guide'}</span>
      </button>

      {isPlaying && (
        <button
          type="button"
          onClick={handleStop}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '6px 10px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          title="Stop Audio"
        >
          ⏹️ Stop
        </button>
      )}
    </div>
  );
}
