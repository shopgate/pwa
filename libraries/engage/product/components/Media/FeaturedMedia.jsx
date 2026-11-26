import React from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import { MEDIA_TYPE_IMAGE, MEDIA_TYPE_VIDEO } from '@shopgate/engage/product';
import { useProductImageSettings } from '@shopgate/engage/settings/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import { PORTAL_PRODUCT_MEDIA } from '../../../components/constants';
import MediaImage from './MediaImage';
import FeaturedVideo from './FeaturedVideo';
import { defaultProps, propTypes } from './props';

const types = {
  [MEDIA_TYPE_IMAGE]: MediaImage,
  [MEDIA_TYPE_VIDEO]: FeaturedVideo,
};

const useStyles = makeStyles()(theme => ({
  rounded: {
    borderRadius: theme.components.productImage.borderRadius,
    overflow: 'hidden',
  },
}));

/**
 * The featured media component.
 * @returns {JSX}
 */
const FeaturedMedia = ({ type, url, altText }) => {
  const TypeRenderer = types[type] || MediaImage;
  const { list } = useProductImageSettings();
  const { classes } = useStyles();

  return (
    <SurroundPortals portalName={PORTAL_PRODUCT_MEDIA}>
      <TypeRenderer
        className={classes.rounded}
        url={url}
        altText={altText}
        resolutions={list.resolutions}
        ratio={list.ratio}
      />
    </SurroundPortals>
  );
};

FeaturedMedia.propTypes = propTypes;
FeaturedMedia.defaultProps = defaultProps;

export default FeaturedMedia;
