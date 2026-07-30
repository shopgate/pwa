import React from 'react';
import PropTypes from 'prop-types';
import Image from '@shopgate/pwa-common/components/Image';
import appConfig from '@shopgate/pwa-common/helpers/config';
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
      boxShadow: 'inset 0 0 20px rgba(0, 0, 0, .05)',
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
  const { classes, cx } = useStyles();

  const {
    showInnerShadow = !appConfig.hideProductImageShadow,
  } = useWidgetSettings('@shopgate/engage/product/MediaImage');

  const mergedClassName = cx(className, {
    [classes.innerShadow]: showInnerShadow,
  });

  return (
    <SurroundPortals
      portalName={PORTAL_PRODUCT_IMAGE}
      // Nothing is passed on without a url, so portals keep seeing what they saw before the
      // placeholder moved into the Image component.
      portalProps={url ? {
        src: url,
        resolutions,
      } : undefined}
    >
      <Image
        src={url}
        resolutions={resolutions}
        alt={altText}
        className={mergedClassName}
        backgroundColor="transparent"
        placeholder={<MediaPlaceholder className={mergedClassName} />}
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
