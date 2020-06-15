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
import {
  RouterContext,
  Router as OrigRouter,
} from '@virtuous/react-conductor';
import { hasSGJavaScriptBridge } from '@shopgate/pwa-core/helpers';
import { hasWebBridge } from '@shopgate/engage/core';

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
  }

  static defaultProps = {
    history: null,
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
    };

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
    const { updated } = this.state;
    return updated !== nextState.updated;
  }

  /**
   * @param {Object} data Data for the update method
   */
  update = (data) => {
    const { prev, next } = data;

    if (data.constructor.name === 'Route') {
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
    const { prev, next } = this.state;
    const stack = Array.from(routeStack.getAll());

    return (
      <RouterContext.Provider value={{ prev, next, stack }}>
        {children}
      </RouterContext.Provider>
    );
  }
}

export default Router;
