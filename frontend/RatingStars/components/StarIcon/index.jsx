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
const content = '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>';

/**
 * The star icon component
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Star = props => <Icon content={content} {...props} />;

Star.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  viewBox: PropTypes.string,
};

Star.defaultProps = {
  className: '',
  color: null,
  viewBox: '0 0 24 24',
  size: 'inherit',
};

export default Star;
