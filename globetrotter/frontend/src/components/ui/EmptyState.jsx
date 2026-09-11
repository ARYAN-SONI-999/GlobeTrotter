import React from 'react';

export default function EmptyState({
  icon = '🔍',
  title = 'No results found',
  description = 'Try adjusting your search filters or keyword.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`ui-empty-state ${className}`}>
      <div className="ui-empty-icon">{icon}</div>
      <h3 className="ui-empty-title">{title}</h3>
      {description && <p className="ui-empty-desc">{description}</p>}
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction} style={{ marginTop: '14px' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
