import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
const LoadingIndicator = ({ className }) => {
  if (loadingImageSrc) {
    return (
      <div className={classNames(imgContainer, 'loading-indicator ui-shared__loading-indicator')}>
        <img src={loadingImageSrc} alt="" />
      </div>
    );
  }
  return (
    <div className={classNames(className, styles, 'loading-indicator ui-shared__loading-indicator')}>
      <IndicatorCircle />
    </div>
  );
};

LoadingIndicator.propTypes = {
  className: PropTypes.string,
};

LoadingIndicator.defaultProps = {
  className: null,
};

export default LoadingIndicator;
