import React, { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '600px',
  showCloseBtn = true,
  className = ''
}) {
  useEffect(() => {
    if (!isOpen) return;

    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    // Lock body scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="ui-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ui-modal-title"
    >
      <div className={`ui-modal-card ${className}`} style={{ maxWidth }}>
        <div className="ui-modal-header">
          <div>
            {title && <h3 id="ui-modal-title" className="ui-modal-title">{title}</h3>}
            {subtitle && <p className="ui-modal-subtitle">{subtitle}</p>}
          </div>
          {showCloseBtn && (
            <button className="ui-modal-close" onClick={onClose} aria-label="Close dialog">
              ✕
            </button>
          )}
        </div>
        <div className="ui-modal-body">{children}</div>
      </div>
    </div>
  );
}
