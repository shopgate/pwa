import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { MediaSlider, MediaImage } from '@shopgate/engage/product';
import { useProductGallerySettings } from '@shopgate/engage/product/hooks';
import MediaThumbnails from '../MediaThumbnails';
import MediaViewer from '../MediaViewer';
import { useMediaGallery } from '../../hooks';
import VideoSlide from './VideoSlide';
import connect from './connector';

const SLIDE_COMPONENTS = {
  video: VideoSlide,
};

const mediaShape = PropTypes.shape({
  type: PropTypes.string,
  code: PropTypes.string,
  altText: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string,
});

/**
 * The product media slider component.
 * @returns {JSX.Element}
 */
const ProductMediaSlider = ({
  productId,
  media,
  featuredMediaBaseProduct,
  featuredMediaCharacteristics,
  className,
  thumbnailsContainer,
  'aria-hidden': ariaHidden,
  stacked,
}) => {
  const { pagination } = useProductGallerySettings();
  const {
    swiper, setSwiper, viewerIndex, openViewer, closeViewer,
  } = useMediaGallery();

  const swiperProps = useMemo(() => ({
    onSwiper: setSwiper,
    controls: false,
    ...pagination === 'bulletsBelow' && {
      style: {
        marginBottom: -8,
      },
    },
  }), [pagination, setSwiper]);

  return (
    <>
      <MediaSlider
        key={pagination}
        paginationType={pagination}
        productId={productId}
        className={className}
        aria-hidden={ariaHidden}
        stacked={stacked}
        onSlideClick={openViewer}
        slideComponents={SLIDE_COMPONENTS}
        renderPlaceholder={(featuredMedia) => {
          const props = featuredMediaCharacteristics || featuredMedia || featuredMediaBaseProduct;
          return (<MediaImage {...props} className={className} />);
        }}
        swiperProps={swiperProps}
      />
      {thumbnailsContainer && createPortal(
        <MediaThumbnails media={media || []} swiper={swiper} aria-hidden={ariaHidden} />,
        thumbnailsContainer
      )}
      {viewerIndex !== null && media && (
        <MediaViewer media={media} initialIndex={viewerIndex} onClose={closeViewer} />
      )}
    </>
  );
};

ProductMediaSlider.propTypes = {
  'aria-hidden': PropTypes.bool,
  className: PropTypes.string,
  featuredMediaBaseProduct: mediaShape,
  featuredMediaCharacteristics: mediaShape,
  media: PropTypes.arrayOf(mediaShape),
  productId: PropTypes.string,
  stacked: PropTypes.bool,
  thumbnailsContainer: PropTypes.instanceOf(HTMLElement),
  variantId: PropTypes.string,
};

ProductMediaSlider.defaultProps = {
  'aria-hidden': false,
  className: null,
  featuredMediaCharacteristics: null,
  featuredMediaBaseProduct: null,
  media: null,
  productId: null,
  stacked: false,
  thumbnailsContainer: null,
  variantId: null,
};

export default connect(ProductMediaSlider);
