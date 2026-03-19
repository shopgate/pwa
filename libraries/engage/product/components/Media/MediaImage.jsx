import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Image from '@shopgate/pwa-common/components/Image';
import appConfig, { themeShadows } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import { SurroundPortals } from '../../../components';
import { PORTAL_PRODUCT_IMAGE } from '../../../components/constants';
import { useWidgetSettings } from '../../../core';
import { defaultProps, propTypes } from './props';
import MediaPlaceholder from './MediaPlaceholder';

const useStyles = makeStyles()({
  innerShadow: {
    ':after': {
      display: 'block',
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      boxShadow: themeShadows.productImage,
      pointerEvents: 'none',
    },
  },
});

/**
 * The featured image component.
 * @returns {JSX.Element}
 */
const MediaImage = ({
  url, altText, className, resolutions,
}) => {
  const { classes } = useStyles();
  const [placeholder, setPlaceholderEnabled] = useState(!url);

  const {
    showInnerShadow = !appConfig.hideProductImageShadow,
  } = useWidgetSettings('@shopgate/engage/product/MediaImage');

  useEffect(() => setPlaceholderEnabled(!url), [url]);

  const mergedClassName = classnames(className, {
    [classes.innerShadow]: showInnerShadow,
  });

  if (placeholder) {
    return (
      <SurroundPortals portalName={PORTAL_PRODUCT_IMAGE}>
        <MediaPlaceholder className={mergedClassName} />
      </SurroundPortals>
    );
  }

  return (
    <SurroundPortals
      portalName={PORTAL_PRODUCT_IMAGE}
      portalProps={{
        src: url,
        resolutions,
      }}
    >
      <Image
        src={url}
        resolutions={resolutions}
        alt={altText}
        className={mergedClassName}
        backgroundColor="transparent"
        onError={() => setPlaceholderEnabled(true)}
        animating
      />
    </SurroundPortals>
  );
};

MediaImage.propTypes = {
  altText: propTypes.altText,
  className: propTypes.className,
  resolutions: PropTypes.arrayOf(PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    blur: PropTypes.number,
  })),
  url: propTypes.url,
};
MediaImage.defaultProps = {
  url: defaultProps.url,
  altText: defaultProps.altText,
  className: defaultProps.className,
  resolutions: undefined,
};

export default MediaImage;
