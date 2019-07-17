import React from 'react';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { useWidgetSettings } from '../../../core';
import { defaultProps, propTypes } from './props';
import MediaImage from './MediaImage';
import { innerShadow } from './style';

/**
 * The featured image component.
 * @returns {JSX}
 */
const FeaturedImage = ({ url, altText, params }) => {
  const {
    showInnerShadow = !appConfig.hideProductImageShadow,
  } = useWidgetSettings('@shopgate/engage/product/FeaturedImage');

  return (
    <MediaImage
      url={url}
      altText={altText}
      className={showInnerShadow ? innerShadow : null}
      params={params}
    />
  );
};

FeaturedImage.propTypes = propTypes;
FeaturedImage.defaultProps = defaultProps;

export default FeaturedImage;
