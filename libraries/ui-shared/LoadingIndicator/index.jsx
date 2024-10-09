import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/engage';
import IndicatorCircle from '../IndicatorCircle';
import { container, imgContainer } from './style';

const {
  loadingIndicator: { imgSrc: loadingImageSrc } = {},
} = themeConfig.variables;

/**
 * Renders a loading indicator.
 * @returns {JSX}
 */
const LoadingIndicator = ({ className }) => (
  <div className={classNames(
    className,
    {
      [container]: !loadingImageSrc,
      [imgContainer]: !!loadingImageSrc,
    },
    'loading-indicator',
    'ui-shared__loading-indicator'
  )}
  >
    { loadingImageSrc ? (
      <img src={loadingImageSrc} alt="" />
    ) : (
      <IndicatorCircle />
    )}
  </div>
);

LoadingIndicator.propTypes = {
  className: PropTypes.string,
};

LoadingIndicator.defaultProps = {
  className: null,
};

export default LoadingIndicator;

