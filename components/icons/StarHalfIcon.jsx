/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = (
  `<defs><path id="a" d="M0 0h24v24H0z"/></defs>
  <clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath>
  <path clip-path="ul(#b)" d="M12 2L9.2 8.6 2 9.2 7.5 14l-1.6 7 6.2-3.7m-.1-1.9V6.1m2.8 7.3"/>`
);

/**
 * The half-filled star icon component
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const StarHalfIcon = props => <Icon content={content} {...props} />;

StarHalfIcon.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  viewBox: PropTypes.string,
};

StarHalfIcon.defaultProps = {
  className: '',
  color: null,
  viewBox: '0 0 24 24',
  size: 'inherit',
};

export default StarHalfIcon;
