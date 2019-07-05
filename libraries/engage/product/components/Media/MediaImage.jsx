import React, { useState, useEffect } from 'react';
import ImageComponent from '@shopgate/pwa-common/components/Image';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { SurroundPortals } from '../../../components';
import { PORTAL_PRODUCT_IMAGE } from '../../../components/constants';
import { buildMediaImageUrl } from './helpers';
import { defaultProps, propTypes } from './props';
import MediaPlaceholder from './MediaPlaceholder';

const { colors } = themeConfig;

/**
 * The featured image component.
 * @returns {JSX}
 */
const MediaImage = ({ url, altText, className }) => {
  const [placeholder, showPlaceholder] = useState(!url);

  useEffect(() => showPlaceholder(!url), [url]);

  if (placeholder) {
    return (
      <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE} >
        <MediaPlaceholder className={className} />
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
