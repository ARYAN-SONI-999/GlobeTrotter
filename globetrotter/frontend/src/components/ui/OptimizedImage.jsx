import React, { useState } from 'react';

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';

export default function OptimizedImage({
  src,
  alt = '',
  fallbackSrc = FALLBACK_COVER,
  className = '',
  style = {},
  aspectRatio,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imgSrc = error || !src ? fallbackSrc : src;

  return (
    <div className={`ui-img-wrapper ${loaded ? 'loaded' : 'loading'} ${className}`} style={{ aspectRatio, ...style }}>
      {!loaded && <div className="ui-img-skeleton" />}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        className="ui-img-content"
        {...props}
      />
    </div>
  );
}
