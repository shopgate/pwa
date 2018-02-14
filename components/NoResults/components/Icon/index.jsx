/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The no search results icon component.
 * @param {Object} props Props of the component
 * @returns {JSX}
 */
const NoResultIcon = props => (
  <svg
    className={props.className}
    viewBox="-2698 6977 216 216"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="no-search-results-shadow" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="2" dy="2" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.1" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g transform="translate(-2770 6819)">
      <g transform="translate(0 46)">
        <circle className={styles.background} cx="104" cy="104" r="104" transform="translate(76 116)" />
      </g>
      <g transform="translate(-4 42)">
        <circle className={styles.background} cx="108" cy="108" r="108" transform="translate(76 116)" />
      </g>
      <g>
        <circle className={styles.circle} cx="104" cy="104" r="104" transform="translate(76 162)" />
        <circle className={styles.circle} cx="92" cy="92" r="92" transform="translate(88 174)" />
        <circle className={styles.circle} cx="80" cy="80" r="80" transform="translate(100 186)" />
      </g>
      <g name="cloud" filter="url(#no-search-results-shadow)" transform="translate(83.6 235.124)">
        <g transform="matrix(1, 0, 0, 1, 2686.4, -7054.12)">
          <path className={styles.background} d="M90.216,116.652a24.732,24.732,0,0,1-20.61-10.992,13.394,13.394,0,0,1-7.263-1.374,20,20,0,0,1-7.655,1.767,20.473,20.473,0,0,1-18.255-10.6,20.009,20.009,0,0,1-6.478.981A23.584,23.584,0,0,1,6.4,73.076c0-10.6,6.085-19.236,15.507-22.181V50.11A13.07,13.07,0,0,1,34.862,37.155a13.905,13.905,0,0,1,2.748.2A18.6,18.6,0,0,1,52.724,29.7,19.248,19.248,0,0,1,65.876,35,14.4,14.4,0,0,1,75.1,31.659a13.191,13.191,0,0,1,6.281,1.963,24.851,24.851,0,0,1,40.239,1.767,21.962,21.962,0,0,1,20.61,5.3c.393-.2.589-.393.981-.589a16.9,16.9,0,0,1,7.459-1.963,15.491,15.491,0,0,1,15.311,13.937A22.951,22.951,0,0,1,181.49,64.439c2.944,6.478,2.355,13.544-1.57,20.218a21.266,21.266,0,0,1-18.059,10.011h-.2c-4.122,0-7.459-.785-10.207-2.552a13.109,13.109,0,0,1-7.263.393,24.871,24.871,0,0,1-15.311,15.114,24.1,24.1,0,0,1-18.451-.981A25.762,25.762,0,0,1,90.216,116.652Z" transform="translate(-2686.4 7054.12)" />
        </g>
      </g>
      <g name="magnifier" filter="url(#no-search-results-shadow)">
        <g transform="matrix(1, 0, 0, 1, 2770, -6819)">
          <rect className={styles.magnifier} width="13.003" height="3.855" transform="matrix(0.53, 0.85, -0.85, 0.53, -2613.92, 7029.38)" />
        </g>
        <g transform="matrix(1, 0, 0, 1, 2770, -6819)">
          <rect className={styles.magnifier} width="3.855" height="13.003" transform="translate(-2566.07 7029.56) rotate(37.01)" />
        </g>
        <g transform="matrix(1, 0, 0, 1, 2770, -6819)">
          <rect className={styles.magnifier} width="3.856" height="13.002" transform="translate(-2592.67 7023)" />
        </g>
        <circle className={styles.background} cx="34" cy="34" r="34" transform="translate(147 223)" />
        <g transform="translate(136 -7)">
          <g transform="translate(10.699 229.942)">
            <g transform="translate(0 0)">
              <g transform="matrix(1, 0, 0, 1, 2623.3, -7041.94)">
                <path className={styles.magnifier} d="M83.335,33.853a34.228,34.228,0,1,0-1.494,49.8l4.482,4.482L84.63,89.829a1.926,1.926,0,0,0,0,2.789l17.032,16.932a1.926,1.926,0,0,0,2.789,0l5.677-5.677a1.926,1.926,0,0,0,0-2.789L93.1,84.152a1.926,1.926,0,0,0-2.789,0l-1.1,1.1-4.482-4.482A34.352,34.352,0,0,0,83.335,33.853Zm22.51,68.625-2.789,2.789L88.912,91.124,91.7,88.335ZM37.718,79.47a30.214,30.214,0,1,1,42.729,0A30.3,30.3,0,0,1,37.718,79.47Z" transform="translate(-2648.22 7018.1)" />
              </g>
              <path className={styles.magnifier} d="M111.291,55.583a1.972,1.972,0,1,0,2.789-2.789,28.585,28.585,0,0,0-40.338-.1,1.972,1.972,0,0,0,2.789,2.789A24.557,24.557,0,0,1,111.291,55.583Z" transform="translate(-59.748 -38.701)" />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

NoResultIcon.propTypes = {
  className: PropTypes.string,
};

NoResultIcon.defaultProps = {
  className: '',
};

export default NoResultIcon;
