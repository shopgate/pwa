import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core';
import { getProductImageSettings } from '@shopgate/engage/product/helpers';
import { Image, SurroundPortals, Swiper } from '@shopgate/engage/components';
import { PRODUCT_GALLERY_IMAGES } from '@shopgate/engage/product';
import { GALLERY_SLIDER_ZOOM } from '../../../../constants';
import styles from './style';
import connect from './connector';

/**
 * The Product Gallery content component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ProductGalleryImages = ({ initialSlide, images }) => {
  const { zoom = {} } = useWidgetSettings('@shopgate/engage/product/Gallery') || {};

  const { GalleryImage: galleryResolutions } = getProductImageSettings();

  if (!Array.isArray(images) || images.length === 0) {
    return <div className={styles.container} />;
  }

  return (
    <div className={styles.container}>
      <Swiper
        classNames={styles.sliderStyles}
        className={styles.slider}
        initialSlide={initialSlide}
        indicators
        loop={images.length > 1}
        disabled={images.length === 1}
        zoom={{
          ...GALLERY_SLIDER_ZOOM,
          ...zoom,
        }}
      >
        {images.map(image => (
          <Swiper.Item key={image}>
            <div className="swiper-zoom-container">
              <Image
                src={image}
                alt=""
                classNameImg={styles.slide}
                resolutions={galleryResolutions}
                animating={false}
                backgroundColor="transparent"
                unwrapped
              />
            </div>
          </Swiper.Item>
        ))}
      </Swiper>
    </div>
  );
};

ProductGalleryImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialSlide: PropTypes.number.isRequired,
};

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Wrapper = props => (
  <SurroundPortals portalName={PRODUCT_GALLERY_IMAGES} portalProps={props}>
    <ProductGalleryImages {...props} />
  </SurroundPortals>
);

export default connect(Wrapper);
