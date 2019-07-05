import React from 'react';
import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import { MEDIA_TYPE_IMAGE, MEDIA_TYPE_VIDEO } from '@shopgate/pwa-common-commerce/product';
import { PORTAL_PRODUCT_MEDIA } from '../../../components/constants';
import FeaturedImage from './FeaturedImage';
import FeaturedVideo from './FeaturedVideo';
import { defaultProps, propTypes } from './props';

const types = {
  [MEDIA_TYPE_IMAGE]: FeaturedImage,
  [MEDIA_TYPE_VIDEO]: FeaturedVideo,
};

/**
 * The featured media component.
 * @returns {JSX}
 */
const FeaturedMedia = ({ type, url, altText }) => {
  const TypeRenderer = types[type] || FeaturedImage;

  return (
    <SurroundPortals portalName={PORTAL_PRODUCT_MEDIA} >
      <TypeRenderer url={url} altText={altText} />
    </SurroundPortals>
  );
};

FeaturedMedia.propTypes = propTypes;
FeaturedMedia.defaultProps = defaultProps;
FeaturedMedia.displayName = 'FeaturedMedia';

export default FeaturedMedia;
