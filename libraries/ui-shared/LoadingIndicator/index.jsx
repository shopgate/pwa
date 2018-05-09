import React from 'react';
import IndicatorCircle from '../IndicatorCircle';
import styles from './style';

/**
 * Renders a loading indicator.
 * @returns {JSX}
 */
const LoadingIndicator = () => (
  <div className={styles}>
    <IndicatorCircle />
  </div>
);

export default LoadingIndicator;
