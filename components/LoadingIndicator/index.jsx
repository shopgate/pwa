import React from 'react';
import IndicatorCircle from 'Components/IndicatorCircle';
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
