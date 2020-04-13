import React from 'react';
import PropTypes from 'prop-types';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import styles from './style';

/**
 * The circle indicator component.
 * @param {Object} props The component props.
 * @param {Object} props.size Width and height of the circle.
 * @param {Object} props.color Color of the circle.
 * @param {Object} props.strokeWidth Stroke width of the circle.
 * @param {bool} props.paused Animation should be paused.
 * @returns {JSX}
 */
const IndicatorCircle = ({
  size,
  color,
  strokeWidth,
  paused,
}) => (
  <svg
    className={styles.spinner(paused)}
    viewBox="25 25 50 50"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    data-test-id="loadingIndicator"
  >
    <circle
      className={styles.circle(color, strokeWidth, paused)}
      cx="50"
      cy="50"
      r="20"
    />
  </svg>
);

IndicatorCircle.propTypes = {
  color: PropTypes.string,
  paused: PropTypes.bool,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
};

IndicatorCircle.defaultProps = {
  color: `var(--color-secondary, ${themeConfig.colors.accent})`,
  paused: false,
  size: themeConfig.variables.loadingIndicator.size,
  strokeWidth: themeConfig.variables.loadingIndicator.strokeWidth,
};

export default IndicatorCircle;
