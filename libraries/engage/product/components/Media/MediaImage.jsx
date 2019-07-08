import React, { useState, useEffect } from 'react';
import Image from '@shopgate/pwa-common/components/Image';
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
  const [placeholder, enablePlaceholder] = useState(!url);

  useEffect(() => enablePlaceholder(!url), [url]);

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
        <Image
          src={buildMediaImageUrl(url)}
          alt={altText}
          className={className}
          backgroundColor={colors.light}
          onError={() => enablePlaceholder(true)}
        />
      </div>
    </SurroundPortals>
  );
};

MediaImage.propTypes = propTypes;
MediaImage.defaultProps = defaultProps;

export default MediaImage;
