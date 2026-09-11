import React, { useState, useEffect } from 'react';

export default function VoicePlannerButton({ onSpeechResult }) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const handleStartListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      if (onSpeechResult && transcript) {
        onSpeechResult(transcript);
      }
    };

    recognition.onerror = (err) => {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={handleStartListening}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: isListening ? '#dc2626' : 'linear-gradient(135deg, #0284c7, #2563eb)',
        color: 'white',
        border: 'none',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(2,132,199,0.3)',
        transition: 'all 0.2s ease',
        animation: isListening ? 'pulse 1.2s infinite' : 'none',
      }}
      title="Speak destination (e.g., 'Plan a 3 day trip to Jaipur')"
    >
      <span>{isListening ? '🎙️ Listening... Speak now' : '🎤 Voice Input'}</span>
    </button>
  );
}
