import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { router } from '@virtuous/conductor';
import { RouteContext, RouterContext } from '@virtuous/react-conductor';
import Loading from '../Loading';
import ErrorBoundary from '../ErrorBoundary';

/**
 * The Route component.
 */
class Route extends React.Component {
  static contextType = RouterContext;

  static propTypes = {
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.elementType,
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
      /**
       * When a route is "replaced" the router doesn't assign a new route id to the old route
       * stack entry. This can cause issues when a route is replaced by itself, since the content
       * will not remount out of the box.
       *
       * The "replaceRouteId" state prop is injected by the "historyReplace" action. It's used
       * to enforce re-remounting routes which where replaced by itself.
       */
      const replaceRouteId = context?.state?.replaceRouteId || '';

      return (
        <ErrorBoundary key={`error.${route.id}_${replaceRouteId}`}>
          <RouteContext.Provider key={`${route.id}_${replaceRouteId}`} value={context}>
            <Suspense fallback={<Loading />}>
              <Component />
            </Suspense>
          </RouteContext.Provider>
        </ErrorBoundary>
      );
    });
  }
}

export default Route;
