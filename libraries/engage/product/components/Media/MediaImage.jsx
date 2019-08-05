import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Image from '@shopgate/pwa-common/components/Image';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { SurroundPortals } from '../../../components';
import { PORTAL_PRODUCT_IMAGE } from '../../../components/constants';
import { buildMediaImageUrl } from './helpers';
import { useWidgetSettings } from '../../../core';
import { defaultProps, propTypes } from './props';
import MediaPlaceholder from './MediaPlaceholder';
import { innerShadow } from './style';

/**
 * The featured image component.
 * @returns {JSX}
 */
const MediaImage = ({
  url, altText, className, params,
}) => {
  const [placeholder, setPlaceholderEnabled] = useState(!url);

  const {
    showInnerShadow = !appConfig.hideProductImageShadow,
  } = useWidgetSettings('@shopgate/engage/product/MediaImage');

  useEffect(() => setPlaceholderEnabled(!url), [url]);

  const classes = classnames(className, {
    [innerShadow]: showInnerShadow,
  });

  if (placeholder) {
    return (
      <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE} >
        <MediaPlaceholder className={classes} />
      </SurroundPortals>
    );
  }

  return (
    <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE}>
      <Image
        src={buildMediaImageUrl(url, params)}
        alt={altText}
        className={classes}
        backgroundColor="transparent"
        onError={() => setPlaceholderEnabled(true)}
      />
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
