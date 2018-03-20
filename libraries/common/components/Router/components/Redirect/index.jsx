import { Component } from 'react';
import PropTypes from 'prop-types';
import connect from './connector';

/**
 * The Redirect component.
 */
class Redirect extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    trampolineRedirect: PropTypes.func.isRequired,
  };

  static contextTypes = {
    registerRoute: PropTypes.func.isRequired,
  };

  /**
   * Initializes the Redirect component.
   * @param {Object} props The component props.
   * @param {Object} context The component context.
   */
  constructor(props, context) {
    super(props, context);

    // Register to the router with all callbacks.
    this.context.registerRoute(
      props.path,
      this.addRoute,
      null,
      null,
      null,
      props
    );
  }

  /**
   * Perform the trampoline- (2-step-) redirect
   * @param {Object} location The location of the new route
   */
  addRoute = (location) => {
    // Perform the 2-step-redirect (first redirect to this.props.to, later redirect to location)
    this.props.trampolineRedirect({ pathname: this.props.to }, location);
  };

  /**
   * Renders the route
   * @returns {JSX}
   */
  render() {
    return null;
  }
}

export default connect(Redirect);
