import React from 'react';
import PropTypes from 'prop-types';
import {
  router,
  stack as routeStack,
  onDidPush,
  onDidPop,
  onDidReplace,
  onDidReset,
  onUpdate,
  ACTION_POP,
} from '@virtuous/conductor';
import Route from '@virtuous/conductor/Route';
import {
  RouterContext,
  Router as OrigRouter,
} from '@virtuous/react-conductor';
import { UIEvents } from '@shopgate/pwa-core';
import { hasSGJavaScriptBridge } from '@shopgate/pwa-core/helpers';
import { hasWebBridge } from '@shopgate/engage/core';
import { sanitizeLink } from '../../subscriptions/helpers/handleLinks';
import authRoutes from '../../collections/AuthRoutes';
import { EVENT_USER_INITIALIZED } from '../../constants/user';
import connect from './connector';

/**
 * Adds additional history listeners to compensate bugs and improve the behaviour within
 * browser environments.
 */
const createBrowserListeners = () => {
  const { history } = router;

  // Remove the original listener from the router.
  router.historyListener();

  // Add new one which injects an intermediate function which intercepts history events
  router.historyListener = history.listen((location, action) => {
    const {
      pathname: locationPathname, search, hash, state,
    } = location;

    // Create a pathname which fulfills the router expectations
    const pathname = `${locationPathname}${search}${hash}`;

    if (action === ACTION_POP && router.routeIndex === 0) {
      /**
       * Within browser environments we need to handle situations where users come back to old
       * Engage history entries from previous sessions, Without special handling the page wouldn't
       * render correct content. So we replace the current visible page with content from the route.
       */
      router.replace({
        pathname,
        state,
      });

      return;
    }

    /**
     * Conductor 2.5.0 contains a bug within the handler for native history events. It ignores that
     * the search and hash parameters are stored within separate properties of the history location
     * object. The routing methods expect those parameters as part of the pathname.
     */
    router.handleNativeEvent({
      ...location,
      pathname,
    }, action);
  }).bind(router);
};

/**
 * The Router component.
 */
class Router extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    history: PropTypes.func,
    isUserLoggedIn: PropTypes.bool,
  }

  static defaultProps = {
    history: null,
    isUserLoggedIn: false,
  }

  static Push = OrigRouter.Push;

  static Pop = OrigRouter.Pop;

  static Replace = OrigRouter.Replace;

  static Reset = OrigRouter.Reset;

  static ResetTo = OrigRouter.ResetTo;

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    if (typeof props.history === 'function') {
      router.constructor(props.history);
    }

    this.state = {
      prev: null,
      next: null,
      updated: null,
      userInitialized: false,
      initialRouteProtected: !!this.getRouteProtector(),
    };

    UIEvents.addListener(EVENT_USER_INITIALIZED, this.setUserInitialized);

    onDidPush(this.update);
    onDidPop(this.update);
    onDidReplace(this.update);
    onDidReset(this.update);
    onUpdate(this.update);

    if (hasWebBridge() || hasSGJavaScriptBridge()) {
      createBrowserListeners();
    }
  }

  /**
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { isUserLoggedIn } = this.props;
    const { updated, userInitialized } = this.state;
    return (
      updated !== nextState.updated ||
      userInitialized !== nextState.userInitialized ||
      isUserLoggedIn !== nextProps.isUserLoggedIn
    );
  }

  /**
   * Replaces the initial route with a protector if necessary
   * @param {Object} nextProps The next component props
   * @param {Object} nextState The next components state
   */
  UNSAFE_componentWillUpdate(nextProps, nextState) {
    const { isUserLoggedIn } = nextProps;
    const { userInitialized, initialRouteProtected } = nextState;

    if (initialRouteProtected && userInitialized && !isUserLoggedIn) {
      const protector = this.getRouteProtector();
      const location = this.getHistoryLocation();

      // Get the initial route from the route stack which was created by the router on init
      const initialRoute = routeStack.getByIndex(0);
      const { id } = initialRoute;

      // Prepare the redirect state for the protector route
      const state = {
        redirect: {
          location,
        },
      };

      const routeReplacement = new Route({
        id,
        state,
        pathname: protector,
      });

      // Replace the auto-generated route with the replacement
      routeStack.update(id, routeReplacement);

      // Update the browser url with the protector route
      router.history.replace({
        pathname: protector,
        state: {
          ...state,
          route: { id },
        },
      });

      this.setState({
        initialRouteProtected: false,
      });
    }
  }

  /**
   * Removes the listener for the EVENT_USER_INITIALIZED event
   */
  componentWillUnmount() {
    UIEvents.removeListener(EVENT_USER_INITIALIZED, this.setUserInitialized);
  }

  /**
   * Updates the user initialized component state
   */
  setUserInitialized = () => {
    this.setState({ userInitialized: true });
  };

  /**
   * Determines the current location from the browser history
   * @returns {string}
   */
  getHistoryLocation = () => {
    const { hash, pathname, search } = router.history.location;
    return sanitizeLink(`${pathname}${search}${hash}`);
  }

  /**
   * Determines if the current route is a protected route
   * @returns {null|string}
   */
  getRouteProtector = () => authRoutes.getProtector(this.getHistoryLocation())

  /**
   * @param {Object} data Data for the update method
   */
  update = (data) => {
    const { prev, next } = data;

    if (data?.id) {
      /**
       * The only change right now compared to the original component. When invoked for "onUpdate"
       * only the updated route is passed instead of an object with prev and next.
       */
      this.setState({
        updated: Date.now(),
      });
      return;
    }

    this.setState({
      prev: prev ? prev.id : null,
      next: next.id,
      updated: Date.now(),
    });
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { children } = this.props;
    const {
      prev, next, initialRouteProtected, userInitialized,
    } = this.state;

    if (initialRouteProtected && !userInitialized) {
      /**
       * When the initial route is a protected route, the first rendering of the Router needs to
       * be postponed till we know the final login state of the user.
       */
      return null;
    }

    const stack = Array.from(routeStack.getAll());

    return (
      <RouterContext.Provider value={{ prev, next, stack }}>
        {children}
      </RouterContext.Provider>
    );
  }
}

export default connect(Router);
