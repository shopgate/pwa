/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import Redirect from '../Redirect';

/**
 * The AuthRoutes component
 * @param {Object} props The props of the component
 * @constructor
 */
const AuthRoutes = props => (
  <div>
    {React.Children.map(props.children, child => (
      props.isLoggedIn
        ? child
        : <Redirect to={props.to} path={child.props.path} />
    ))}
  </div>
);

AuthRoutes.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  isLoggedIn: PropTypes.bool.isRequired,
  to: PropTypes.string.isRequired,
};

AuthRoutes.contextTypes = {
  registerRoute: PropTypes.func.isRequired,
};

export default connect(AuthRoutes);
