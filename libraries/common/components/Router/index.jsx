/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import pathMatch from 'path-match';
import HistoryStack from './helpers/HistoryStack';

// Configure the path matcher that will parse the url.
const matcher = pathMatch({
  sensitive: false,
  strict: false,
  end: true,
});

/**
 * The Router component.
 * @see https://shopgate.atlassian.net/wiki/display/CONSUMER/Shopgate+React+Router
 */
class Router extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    history: PropTypes.shape().isRequired,
  };

  static childContextTypes = {
    registerRoute: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
  };

  /**
   * Initializes the router component.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.routeRegistry = {};
  }

  /**
   * Sets the context for the current router.
   * @returns {Object}
   */
  getChildContext() {
    return {
      history: this.props.history,

      /**
       * Registers a route.
       * @param {string} route Route definition.
       * @param {Function} add Callback that is executed when route needs to be added.
       * @param {Function} remove Callback that is executed when a active route needs to be removed.
       * @param {Function} show Callback that is executed when a hidden route needs to be shown.
       * @param {Function} hide Callback that is executed when a active route needs to be hidden.
       * @param {Object} options Options for the route.
       */
      registerRoute: (route, add, remove, show, hide, options) => {
        this.routeRegistry[route] = {
          add,
          remove,
          show,
          hide,
          options,
          matcher: matcher(route),
        };
      },
    };
  }

  /**
   * The first time the component is mounted the current history will be used as initial route.
   */
  componentDidMount() {
    /**
     * Notifies a route using the given action and location
     * @param {Object} location The location object.
     * @param {string} action The action that is requested.
     * @param {Object} [updatedLocation] The updated location object.
     */
    const notifyRoute = (location, action, updatedLocation) => {
      const result = this.findRouteForLocation(location);

      if (!result) {
        return;
      }

      if (typeof result.route[action] === 'function') {
        result.route[action](location, result.params, updatedLocation);
      }
    };

    // Notify initial / first root.
    notifyRoute(this.props.history.getActive(), 'add');

    // Listen on relevant history changes.
    this.props.history
      .on(HistoryStack.EVENT_ENTRY_ADDED, location => notifyRoute(location, 'add'))
      .on(HistoryStack.EVENT_ENTRY_REMOVED, location => notifyRoute(location, 'remove'))
      .on(HistoryStack.EVENT_ENTRY_ACTIVE, location => notifyRoute(location, 'show'))
      .on(HistoryStack.EVENT_ENTRY_INACTIVE, location => notifyRoute(location, 'hide'));
  }

  /**
   * Searches for a registered route that matches given location.
   * If no matching route was found the 'missmatch' route will be used (if available)
   * @param {Object} location Location object.
   * @returns {Object} The registered route instance.
   */
  findRouteForLocation(location) {
    let matchParams = null;
    let matchRoute = null;
    let missMatch = null;

    Object.keys(this.routeRegistry).some((defintion) => {
      const route = this.routeRegistry[defintion];

      // If route is a miss route save it for later use.
      if (route.options.miss) {
        missMatch = route;
      }

      // If we find a match we will take this as active route.
      const tempMatch = route.matcher(location.pathname);
      if (tempMatch) {
        matchParams = tempMatch;
        matchRoute = route;

        return true;
      }

      return false;
    });

    if (matchParams) {
      return {
        route: matchRoute,
        params: matchParams,
      };
    } else if (missMatch) {
      return {
        route: missMatch,
        params: {},
      };
    }

    return null;
  }

  /**
   * Renders the component children.
   * @returns {JSX}
   */
  render() {
    return this.props.children;
  }
}

export default Router;
