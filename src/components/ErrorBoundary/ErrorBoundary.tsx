import * as Sentry from '@sentry/react-native';
import React from 'react';

import ErrorView from './ErrorView';

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<any, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    Sentry.captureException(error, errorInfo);
  }

  render() {
    const { children } = this.props;
    if (this.state.hasError) {
      // render error page
      return <ErrorView onLogout={() => this.setState({ hasError: false })} />;
    }

    return children;
  }
}

export default ErrorBoundary;
