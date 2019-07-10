import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
const MediaImage = ({
  url, altText, className, params,
}) => {
  const [placeholder, setPlaceholderEnabled] = useState(!url);

  useEffect(() => setPlaceholderEnabled(!url), [url]);

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
          src={buildMediaImageUrl(url, params)}
          alt={altText}
          className={className}
          backgroundColor={colors.light}
          onError={() => setPlaceholderEnabled(true)}
        />
      </div>
    </SurroundPortals>
  );
};

MediaImage.propTypes = {
  altText: propTypes.altText,
  className: propTypes.className,
  params: PropTypes.shape(),
  url: propTypes.url,
};
MediaImage.defaultProps = {
  url: defaultProps.url,
  altText: defaultProps.altText,
  className: defaultProps.className,
  params: null,
};

export default MediaImage;
