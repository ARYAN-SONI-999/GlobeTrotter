import React, { createContext, useContext, useState, useEffect } from 'react';

const OfflineContext = createContext({ isOffline: false });

export function OfflineProvider({ children }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register Service Worker if supported (Vite production build only)
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration failed:', err);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <OfflineContext.Provider value={{ isOffline }}>
      {isOffline && (
        <div
          className="offline-banner"
          style={{
            background: '#475569',
            color: 'white',
            textAlign: 'center',
            padding: '6px 12px',
            fontSize: '0.82rem',
            fontWeight: 600,
            position: 'sticky',
            top: 0,
            zIndex: 1000
          }}
        >
          📡 Offline Mode Active — Displaying Cached Itineraries & Safety Data
        </div>
      )}
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  return useContext(OfflineContext);
}
