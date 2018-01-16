/**
 *  Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Container component.
 * @param {Object} props Props.
 * @returns {function}
 */
const Container = props => (
  <div>
    {props.children}
  </div>
);

Container.prototype.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};
Container.prototype.defaultProps = {
  children: [],
};

export default Container;
