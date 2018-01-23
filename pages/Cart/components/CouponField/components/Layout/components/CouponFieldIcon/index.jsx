/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@shopgate/pwa-common/components/Icon';
import styles from './style';

/**
 * Coupon field add icon.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CouponFieldIcon = ({ disabled, ...props }) => {
  const content = `
    <g transform="translate(1357 5547)">
      <g>
        <path
          class="${(disabled ? styles.iconCircleDisabled : styles.iconCircleEnabled)}"
          d="M15,0A15,15,0,1,1,0,15,15,15,0,0,1,15,0Z"
          transform="translate(314 377)"
        />
        <path
          class="${(disabled ? styles.iconArrowDisabled : styles.iconArrowEnabled)}"
          d="M20,11H7.8l5.6-5.6L12,4,4,12l8,8,1.4-1.4L7.8,13H20V11Z"
          transform="translate(341 404) rotate(180)"
        />
      </g>
    </g>
  `;

  return (
    <Icon viewBox="1671 5924 30 30" content={content} {...props} />
  );
};

CouponFieldIcon.propTypes = {
  disabled: PropTypes.bool,
};

CouponFieldIcon.defaultProps = {
  disabled: false,
};

export default CouponFieldIcon;
