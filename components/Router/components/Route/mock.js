/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Mock route for testing purposes.
 */
class MockRoute extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    mockAdd: PropTypes.func,
    mockHide: PropTypes.func,
    mockRemove: PropTypes.func,
    mockShow: PropTypes.func,
  };

  static contextTypes = {
    registerRoute: PropTypes.func,
  };

  static defaultProps = {
    mockAdd: () => {},
    mockRemove: () => {},
    mockShow: () => {},
    mockHide: () => {},
  };

  /**
   * Initializes the mock component
   * @param {Object} props The components props.
   * @param {Object} context The components context.
   */
  constructor(props, context) {
    super(props, context);

    context.registerRoute(
      props.path,
      props.mockAdd,
      props.mockRemove,
      props.mockShow,
      props.mockHide,
      props
    );
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return null;
  }
}

export default MockRoute;
