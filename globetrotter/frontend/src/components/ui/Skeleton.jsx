import React from 'react';

export default function Skeleton({
  variant = 'text', // 'text' | 'card' | 'circle' | 'rect'
  width,
  height,
  borderRadius,
  className = '',
  style = {}
}) {
  const inlineStyles = {
    width: width || (variant === 'circle' ? '40px' : '100%'),
    height: height || (variant === 'circle' ? '40px' : variant === 'card' ? '200px' : '16px'),
    borderRadius: borderRadius || (variant === 'circle' ? '50%' : '8px'),
    ...style
  };

  return <div className={`ui-skeleton ui-skeleton-${variant} ${className}`.trim()} style={inlineStyles} aria-hidden="true" />;
}

export function CardSkeleton() {
  return (
    <div className="ui-card-skeleton">
      <Skeleton variant="rect" height="180px" borderRadius="14px 14px 0 0" />
      <div style={{ padding: '16px' }}>
        <Skeleton variant="text" width="60%" height="20px" style={{ marginBottom: '8px' }} />
        <Skeleton variant="text" width="90%" height="14px" style={{ marginBottom: '12px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width="40%" height="14px" />
          <Skeleton variant="rect" width="70px" height="28px" borderRadius="20px" />
        </div>
      </div>
    </div>
  );
}
