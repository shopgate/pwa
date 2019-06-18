import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Image from '@shopgate/pwa-common/components/Image';
import appConfig, { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { SurroundPortals, PlaceholderIcon } from '../../../components';
import { useWidgetSettings } from '../../../core';
import { PORTAL_PRODUCT_IMAGE } from '../../../components/constants';
import { buildFeaturedImageUrl } from './helpers';
import { defaultProps, propTypes } from './props';
import {
  innerShadow,
  placeholderContainer,
  placeholderContent,
  placeholderIcon,
} from './style';

const { colors } = themeConfig;

/**
 * The featured image component.
 * @returns {JSX}
 */
const FeaturedImage = ({ url, altText, hideImageShadow }) => {
  let {
    showInnerShadow = !appConfig.hideProductImageShadow,
  } = useWidgetSettings('@shopgate/engage/product/FeaturedImage');

  if (hideImageShadow) {
    showInnerShadow = false;
  }

  const [placeholder, showPlaceholder] = useState(false);

  const imageFailed = useCallback(() => {
    showPlaceholder(true);
  });

  if (placeholder) {
    return (
      <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE} >
        <div className={classnames(placeholderContainer, {
          [innerShadow]: showInnerShadow,
        })}
        >
          <div className={placeholderContent} data-test-id="placeHolder">
            <PlaceholderIcon className={placeholderIcon} />
          </div>
        </div>
      </SurroundPortals>
    );
  }

  return (
    <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE}>
      <div className={showInnerShadow ? innerShadow : ''}>
        <Image
          src={buildFeaturedImageUrl(url)}
          alt={altText}
          className={showInnerShadow ? innerShadow : ''}
          backgroundColor={colors.light}
          onError={imageFailed}
        />
      </div>
    </SurroundPortals>
  );
};

FeaturedImage.propTypes = {
  ...propTypes,
  hideImageShadow: PropTypes.bool,
};
FeaturedImage.defaultProps = {
  ...defaultProps,
  hideImageShadow: false,
};
FeaturedImage.displayName = 'FeaturedImage';

export default FeaturedImage;
