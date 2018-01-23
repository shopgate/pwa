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
const contentDefault = '<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>';
const contentShadow = `
  <defs>
    <filter id="shadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
      <feOffset in="blur" dx="0" dy="1" result="offsetBlur" />
      <feMerge>
        <feMergeNode in="offsetBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <path filter="url(#shadow)" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
`;

/**
 * The arrow icon component.
 * @param {Object} props The icon component properties.
 * @param {boolean} props.shadow Whether to show a shadow under the arrow.
 * @returns {JSX}
 */
const ArrowIcon = ({ shadow, ...props }) => {
  const content = (shadow) ? contentShadow : contentDefault;
  return <Icon content={content} {...props} />;
};

ArrowIcon.propTypes = {
  shadow: PropTypes.bool,
};

ArrowIcon.defaultProps = {
  shadow: false,
};

export default ArrowIcon;
