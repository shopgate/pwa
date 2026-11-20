import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { Swiper, SurroundPortals } from '@shopgate/engage/components';
import {
  PRODUCT_IMAGE,
  MEDIA_TYPE_IMAGE,
  loadProductImage,
  ProductImage,
} from '@shopgate/engage/product';
import { useImageServiceSettings, useProductImageSettings } from '@shopgate/engage/settings/hooks';
import { PRODUCT_GALLERY_PAGINATIONS } from '@shopgate/engage/settings/constants/appSettings';
import { useProductGallerySettings } from '@shopgate/engage/product/hooks';
import MediaThumbnails from '../MediaThumbnails';
import MediaViewer from '../MediaViewer';
import { useMediaGallery } from '../../hooks';
import connect from './connector';

const WRAPPER_STYLE = {
  transform: 'translate3d(0, 0, 0)',
};

/**
 * Keeps showing the current images until the first image of new ones has loaded, so switching
 * between variants doesn't flash an empty slider.
 * @param {string[]|null} images The images of the product, null while they load.
 * @param {string|null} featuredImage The featured image of the product.
 * @returns {string[]|null} The images to show.
 */
const useShownImages = (images, featuredImage) => {
  const [shownImages, setShownImages] = useState(images);
  const { pdp } = useProductImageSettings();
  const imageServiceSettings = useImageServiceSettings();

  useEffect(() => {
    if (!images || isEqual(images, shownImages)) {
      return undefined;
    }

    const firstImage = images[0] || featuredImage;

    if (!firstImage) {
      setShownImages(images);
      return undefined;
    }

    let active = true;

    loadProductImage(firstImage, pdp.resolutions[0], imageServiceSettings)
      .catch(() => null)
      .then(() => {
        if (active) {
          setShownImages(images);
        }
      });

    return () => {
      active = false;
    };
  }, [featuredImage, imageServiceSettings, images, pdp.resolutions, shownImages]);

  return shownImages;
};

/**
 * The image slider of the product page. A single image is shown without a slider, and stacked
 * images are listed below each other.
 * @returns {JSX.Element}
 */
const ProductImageSlider = ({
  product,
  productId,
  images,
  'aria-hidden': ariaHidden,
  className,
  paginationType,
  stacked,
  onOpen,
  onSwiper,
}) => {
  const featuredImage = product?.featuredImageBaseUrl || null;

  if (stacked && images?.length > 1) {
    return (
      <div
        className="theme__product__product-image-slider"
        data-test-id={`product: ${product?.name ?? ''}`}
        style={WRAPPER_STYLE}
      >
        <div className={className} aria-hidden={ariaHidden} data-stacked>
          {images.map((image, index) => (
            <div
              key={`${productId}-${image}`}
              onClick={() => onOpen(index)}
              onKeyDown={() => onOpen(index)}
              role="presentation"
            >
              <ProductImage src={image} context="pdp" noBackground naturalRatio />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (images?.length > 1) {
    return (
      <div
        className="theme__product__product-image-slider"
        data-test-id={`product: ${product?.name ?? ''}`}
        onClick={() => onOpen(0)}
        onKeyDown={() => onOpen(0)}
        role="presentation"
        style={WRAPPER_STYLE}
      >
        <Swiper
          paginationType={paginationType}
          loop
          indicators
          onSwiper={onSwiper}
          className={className}
          aria-hidden={ariaHidden}
          {...paginationType === 'bulletsBelow' && {
            style: {
              marginBottom: -8,
            },
          }}
        >
          {images.map(image => (
            <Swiper.Item key={`${productId}-${image}`}>
              <ProductImage src={image} context="pdp" noBackground />
            </Swiper.Item>
          ))}
        </Swiper>
      </div>
    );
  }

  const src = featuredImage || images?.[0] || null;

  return (
    <div
      className="theme__product__product-image-slider"
      data-test-id={`product: ${product?.name ?? ''}`}
      onClick={src ? () => onOpen(0) : undefined}
      onKeyDown={src ? () => onOpen(0) : undefined}
      role="presentation"
      style={WRAPPER_STYLE}
    >
      <ProductImage
        src={src}
        className={className}
        forcePlaceholder={!src}
        context="pdp"
        noBackground
        alt={product?.name ?? ''}
        aria-hidden={ariaHidden}
      />
    </div>
  );
};

ProductImageSlider.propTypes = {
  onOpen: PropTypes.func.isRequired,
  onSwiper: PropTypes.func.isRequired,
  'aria-hidden': PropTypes.bool,
  className: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string),
  paginationType: PropTypes.oneOf(PRODUCT_GALLERY_PAGINATIONS),
  product: PropTypes.shape({
    featuredImageBaseUrl: PropTypes.string,
    name: PropTypes.string,
  }),
  productId: PropTypes.string,
  stacked: PropTypes.bool,
};

ProductImageSlider.defaultProps = {
  'aria-hidden': false,
  className: null,
  images: null,
  paginationType: undefined,
  product: null,
  productId: null,
  stacked: false,
};

/**
 * Connects the image slider with its thumbnails and the media viewer.
 * @returns {JSX.Element}
 */
const Wrapper = ({ thumbnailsContainer, ...props }) => {
  const { images: imagesProp, product } = props;
  const featuredImage = product?.featuredImageBaseUrl || null;
  const images = useShownImages(imagesProp, featuredImage);
  const { pagination } = useProductGallerySettings();
  const {
    swiper, setSwiper, viewerIndex, openViewer, closeViewer,
  } = useMediaGallery();

  const media = useMemo(() => {
    const urls = images?.length > 1 ? images : [featuredImage || images?.[0]];
    return urls.filter(Boolean).map(url => ({
      type: MEDIA_TYPE_IMAGE,
      url,
    }));
  }, [images, featuredImage]);

  return (
    <SurroundPortals portalName={PRODUCT_IMAGE} portalProps={props}>
      <ProductImageSlider
        {...props}
        images={images}
        key={pagination}
        paginationType={pagination}
        onOpen={openViewer}
        onSwiper={setSwiper}
      />
      {thumbnailsContainer && createPortal(
        <MediaThumbnails media={media} swiper={swiper} aria-hidden={props['aria-hidden']} />,
        thumbnailsContainer
      )}
      {viewerIndex !== null && (
        <MediaViewer media={media} initialIndex={viewerIndex} onClose={closeViewer} />
      )}
    </SurroundPortals>
  );
};

Wrapper.propTypes = {
  'aria-hidden': PropTypes.bool,
  images: PropTypes.arrayOf(PropTypes.string),
  product: PropTypes.shape({
    featuredImageBaseUrl: PropTypes.string,
  }),
  thumbnailsContainer: PropTypes.instanceOf(HTMLElement),
};

Wrapper.defaultProps = {
  'aria-hidden': false,
  images: null,
  product: null,
  thumbnailsContainer: null,
};

export default connect(Wrapper);
