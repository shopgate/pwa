import React from 'react';
import { themeConfig } from '@shopgate/engage';
import IndicatorCircle from '../IndicatorCircle';
import styles, { imgContainer } from './style';

const {
  loadingIndicator: { imgSrc: loadingImageSrc } = {},
} = themeConfig.variables;

/**
 * Renders a loading indicator.
 * @returns {JSX}
 */
const LoadingIndicator = () => {
  if (loadingImageSrc) {
    return (
      <div className={`${imgContainer} loading-indicator`}>
        <img src={loadingImageSrc} alt="" />
      </div>
    );
  }

  return (
    <div className={`${styles} loading-indicator`}>
      <IndicatorCircle />
    </div>
  );
};

export default LoadingIndicator;
