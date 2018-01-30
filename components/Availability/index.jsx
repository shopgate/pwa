/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_WARNING,
  AVAILABILITY_STATE_ALERT,
} from '@shopgate/pwa-common-commerce/product/constants';
import styles from './style';

/**
 * This component renders the availability text for a product
 * @param {Object} props The component props
 * @param {string} props.text The availability text
 * @param {string} props.state The state of the availability text
 * @param {boolean} [props.showWhenAvailable] Tells, if the component shall be rendered, when the
 *   state of the availability text is "ok"
 * @param {string} [props.className] CSS classes
 * @return {JSX}
 */
const Availability = ({ text, state, showWhenAvailable = false, className = null }) => {
  if (!text || (state === AVAILABILITY_STATE_OK && !showWhenAvailable)) {
    return null;
  }

  let style = styles.stateOk;

  if (state === AVAILABILITY_STATE_WARNING) {
    style = styles.stateWarning;
  }

  if (state === AVAILABILITY_STATE_ALERT) {
    style = styles.stateAlert;
  }

  return (
    <div className={`${className} ${style}`}>
      {text}
    </div>
  );
};

Availability.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  showWhenAvailable: PropTypes.bool,
  state: PropTypes.string,
};

Availability.defaultProps = {
  className: '',
  showWhenAvailable: false,
  state: AVAILABILITY_STATE_OK,
};

export default Availability;
