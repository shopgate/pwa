/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Dotdotdot from 'react-dotdotdot';

/**
 * The ellipsis text component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Ellipsis = props => (
  <Dotdotdot clamp={props.rows} ellipsis={props.ellipsis} className={props.className}>
    {props.children}
  </Dotdotdot>
);

Ellipsis.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  ellipsis: PropTypes.string,
  rows: PropTypes.number,
};

Ellipsis.defaultProps = {
  className: '',
  ellipsis: '...',
  rows: 3,
};

export default Ellipsis;
