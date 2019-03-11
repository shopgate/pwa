import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connector from './connector';

/**
 * The App error boundary component.
 */
class ErrorBoundary extends PureComponent {
  static propTypes = {
    appError: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    fallbackUi: PropTypes.node,
  };

  static defaultProps = {
    fallbackUi: null,
  }

  state = { hasError: false };

  /**
   * @returns {{hasError: boolean}}
   */
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /**
   * @param {Object} error The error object.
   * @param {Object} errorInfo The error information.
   */
  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-param-reassign
    error.stack = errorInfo.componentStack;
    this.props.appError(error);
  }

  /**
   * @returns {JSX}
   */
  render() {
    if (this.state.hasError) {
      return this.props.fallbackUi;
    }

    return this.props.children;
  }
}

export default connector(ErrorBoundary);
