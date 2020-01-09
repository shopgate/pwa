import React from 'react';
import PropTypes from 'prop-types';
import { router } from '@virtuous/conductor';
import { RouteContext, RouterContext } from '@virtuous/react-conductor';
import ErrorBoundary from '../ErrorBoundary';

/**
 * The Route component.
 */
class Route extends React.Component {
  static contextType = RouterContext;

  static propTypes = {
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
      PropTypes.shape(),
    ]).isRequired,
    pattern: PropTypes.string.isRequired,
    cache: PropTypes.bool,
    transform: PropTypes.func,
  }

  static defaultProps = {
    cache: false,
    transform: null,
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);
    router.register(props.pattern, props.transform);
  }

  /**
   * TODO: Move to router
   */
  get currentRoute() {
    const { [router.routeIndex]: [, route] } = this.context;

    return route;
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { cache, component: Component, pattern } = this.props;

    let matches = [];

    // If the current pattern does not match the whitelist but matches the current route
    // then add the current route as the only match.
    if (!cache && pattern === this.currentRoute.pattern) {
      matches = [[this.currentRoute.id, this.currentRoute]];
    } else if (cache) {
      const subset = this.context.slice(0, router.routeIndex + 1);
      // Find matching patterns.
      matches = subset.filter(([, route]) => route.pattern === pattern);
    }

    if (!matches.length) {
      return null;
    }

    return matches.map(([, route]) => {
      const { setPattern, ...context } = route;
      context.open = true;
      context.visible = route.id === this.currentRoute.id;

      return (
        <ErrorBoundary key={`error.${route.id}`}>
          <RouteContext.Provider key={route.id} value={context}>
            <Component />
          </RouteContext.Provider>
        </ErrorBoundary>
      );
    });
  }
}

export default Route;
