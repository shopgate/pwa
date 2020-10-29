import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getFullImageSource, useWidgetSettings, useLoadImage } from '@shopgate/engage/core';
import { getProductImageSettings } from '@shopgate/engage/product/helpers';
import { Swiper } from '@shopgate/engage/components';
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

  const fullImages = useMemo(() => {
    if (!images || !images.length) {
      return null;
    }
    const { GalleryImage: galleryResolutions } = getProductImageSettings();
    const lowerResolution = galleryResolutions[0];
    const biggerResolution = galleryResolutions[galleryResolutions.length - 1];
    return {
      low: images.map(src => getFullImageSource(src, lowerResolution)),
      big: images.map(src => getFullImageSource(src, biggerResolution)),
    };
  }, [images]);

  const loaded = useLoadImage(fullImages && fullImages.big && fullImages.big[0]);

  if (!Array.isArray(images) || images.length === 0) {
    return <div className={styles.container} />;
  }

  const imagesToShow = loaded ? fullImages.big : fullImages.low;

  return (
    <div className={styles.container}>
      <Swiper
        classNames={styles.sliderStyles}
        className={styles.slider}
        initialSlide={initialSlide}
        indicators
        loop={imagesToShow.length > 1}
        disabled={imagesToShow.length === 1}
        zoom={{
          ...GALLERY_SLIDER_ZOOM,
          ...zoom,
        }}
      >
        {imagesToShow.map(image => (
          <Swiper.Item key={image}>
            <div className="swiper-zoom-container">
              <img
                src={image}
                alt=""
                className={styles.slide}
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

export default connect(ProductGalleryImages);
