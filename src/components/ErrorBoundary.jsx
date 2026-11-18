import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[VidyaVerse Error]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#f5efe2',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'DM Sans', sans-serif",
          padding: 32,
          textAlign: 'center',
        }}>
          <div style={{
            background: '#fff',
            border: '3px solid #17140d',
            borderRadius: 20,
            boxShadow: '8px 8px 0 #17140d',
            padding: '40px 48px',
            maxWidth: 480,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: '#17140d',
              marginBottom: 12,
            }}>
              Something went wrong
            </h2>
            <p style={{ color: '#555', fontSize: 15, marginBottom: 24 }}>
              VidyaVerse hit an unexpected error. Please try refreshing the page.
            </p>
            <details style={{ textAlign: 'left', marginBottom: 24 }}>
              <summary style={{ cursor: 'pointer', color: '#ff5b57', fontWeight: 700 }}>
                Error details
              </summary>
              <pre style={{
                marginTop: 8,
                padding: 12,
                background: '#f0f0f0',
                borderRadius: 8,
                fontSize: 11,
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 28px',
                background: '#ffc531',
                border: '3px solid #17140d',
                borderRadius: 999,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '4px 4px 0 #17140d',
              }}
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
