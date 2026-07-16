import React from 'react';

export class SACourseBuilderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught in SACourseBuilderErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', margin: '2rem', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', borderRadius: '0.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Course Builder Crashed</h2>
          <p style={{ marginBottom: '1rem' }}><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
          <pre style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '0.25rem', overflowX: 'auto', fontSize: '0.875rem' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
