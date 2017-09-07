/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connect from './connector';

/**
 * The route guard is a component that will take care of hiding or removing components
 * from the component hierarchy based on the current route the component is mounted.
 */
class RouteGuard extends Component {

  static propTypes = {
    currentRoute: PropTypes.string.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  /**
   * Creates a new route guard.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.mountedPath = null;
  }

  /**
   * Stores the mounted path of the component.
   */
  componentWillMount() {
    this.mountedPath = this.props.currentRoute;
  }

  /**
   * Conditionally renders the guard if the mounted route is active.
   * @return {JSX}
   */
  render() {
    const { currentRoute, children } = this.props;

    /**
     * If the current path does not match the mounted path, do not render the component.
     */
    if (currentRoute !== this.mountedPath) {
      return null;
    }

    /**
     * Render the component depending on the current route.
     */
    return (
      <div>
        {children}
      </div>
    );
  }
}

export default connect(RouteGuard);
