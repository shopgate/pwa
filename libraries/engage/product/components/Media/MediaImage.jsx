import React, { useState } from 'react';
import classnames from 'classnames';
import ImageComponent from '@shopgate/pwa-common/components/Image';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { PlaceholderIcon, SurroundPortals } from '../../../components';
import { PORTAL_PRODUCT_IMAGE } from '../../../components/constants';
import { buildMediaImageUrl } from './helpers';
import { defaultProps, propTypes } from './props';
import { placeholderContainer, placeholderContent, placeholderIcon } from './style';

const { colors } = themeConfig;

/**
 * The featured image component.
 * @returns {JSX}
 */
const MediaImage = ({ url, altText, className }) => {
  const [placeholder, showPlaceholder] = useState(false);

  if (placeholder) {
    return (
      <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE} >
        <div className={classnames(placeholderContainer, className)}>
          <div className={placeholderContent} data-test-id="placeHolder">
            <PlaceholderIcon className={placeholderIcon} />
          </div>
        </div>
      </SurroundPortals>
    );
  }

  return (
    <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE}>
      <div className={className}>
        <ImageComponent
          src={buildMediaImageUrl(url)}
          alt={altText}
          className={className}
          backgroundColor={colors.light}
          onError={() => showPlaceholder(true)}
        />
      </div>
    </SurroundPortals>
  );
};

MediaImage.propTypes = propTypes;
MediaImage.defaultProps = defaultProps;

export default MediaImage;
