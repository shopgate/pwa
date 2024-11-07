import React from 'react';
import PropTypes from 'prop-types';
import { router } from '@virtuous/conductor';
import { RouteContext, RouterContext } from '@virtuous/react-conductor';
import ErrorBoundary from '../ErrorBoundary';

/**
 * The RouteNotFound component
 */
class RouteNotFound extends React.Component {
  static contextType = RouterContext;

  static propTypes = {
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.elementType,
    ]).isRequired,
  }

  /**
   * @returns {Object}
   */
  get currentRoute() {
    const { [router.routeIndex]: [, route] } = this.context.stack;

    return route;
  }

  /**
   * @returns {JSX}
   */
  render() {
    if (router.match(this.currentRoute.pathname)) {
      return null;
    }

    const { component: Component } = this.props;
    const { setPattern, ...context } = this.currentRoute;
    context.open = true;
    context.visible = true;
    context.pattern = '';
    context.is404 = true;

    return (
      <ErrorBoundary key="error.404">
        <RouteContext.Provider key="404" value={context}>
          <Component />
        </RouteContext.Provider>
      </ErrorBoundary>
    );
  }
}

export default RouteNotFound;
