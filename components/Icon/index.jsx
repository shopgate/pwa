/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The icon component.
 * @param {Object} props The component props.
 * @param {string} props.content The SVG content of the icon
 * @param {string} [props.className] Additional CSS styles for this component
 * @param {string} [props.viewBox] The viewBox attribute passed to the SVG
 * @param {number} [props.size=24] The icon size
 * @returns {JSX}
 */
const Icon = props =>
  <svg
    className={`${styles} ${props.className}`}
    viewBox={props.viewBox}
    xmlns="http://www.w3.org/2000/svg"
    dangerouslySetInnerHTML={{ __html: props.content }}
    style={{
      fontSize: props.size,
      fill: props.color,
    }}
  />;

Icon.propTypes = {
  content: PropTypes.string.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  viewBox: PropTypes.string,
};

Icon.defaultProps = {
  className: '',
  color: null,
  viewBox: '0 0 24 24',
  size: 'inherit',
};

export default Icon;
