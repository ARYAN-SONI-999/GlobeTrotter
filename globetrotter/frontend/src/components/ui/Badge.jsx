import React from 'react';

export default function Badge({
  children,
  variant = 'info', // 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'glass'
  icon = null,
  className = '',
  style = {}
}) {
  return (
    <span className={`ui-badge ui-badge-${variant} ${className}`.trim()} style={style}>
      {icon && <span className="ui-badge-icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
