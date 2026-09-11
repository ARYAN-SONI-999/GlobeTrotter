import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  isDisabled = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseClass = `ui-btn ui-btn-${variant} ui-btn-${size} ${isLoading ? 'ui-btn-loading' : ''} ${className}`;

  return (
    <button
      type={type}
      className={baseClass.trim()}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <span className="ui-btn-spinner" aria-hidden="true"></span>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="ui-btn-icon left">{icon}</span>}
          <span className="ui-btn-label">{children}</span>
          {icon && iconPosition === 'right' && <span className="ui-btn-icon right">{icon}</span>}
        </>
      )}
    </button>
  );
}
