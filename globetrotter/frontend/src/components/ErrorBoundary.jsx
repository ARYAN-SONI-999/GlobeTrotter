import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('GlobeTrotter ErrorBoundary caught an exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: '24px',
            margin: '20px auto',
            maxWidth: '600px',
            background: '#fef2f2',
            border: '1.5px solid #fecaca',
            borderRadius: '16px',
            color: '#991b1b',
            fontFamily: 'Segoe UI, sans-serif',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '28px' }}>⚠️</span>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#991b1b' }}>
              {this.props.title || 'Component Load Warning'}
            </h3>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#7f1d1d', lineHeight: '1.5' }}>
            {this.state.error?.message || 'Something went wrong while rendering this section.'}
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={this.handleReset}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(220,38,38,0.25)'
              }}
            >
              🔄 Retry Section
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'white',
                color: '#991b1b',
                border: '1px solid #fca5a5',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🌐 Reload Full Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
