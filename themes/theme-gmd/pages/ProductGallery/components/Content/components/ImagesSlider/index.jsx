import React from 'react';
import PropTypes from 'prop-types';
import { getActualImageSource, getThemeSettings, useWidgetSettings } from '@shopgate/engage/core';
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
  if (!Array.isArray(images) || images.length === 0) {
    return <div className={styles.container} />;
  }

  const { zoom = {} } = useWidgetSettings('@shopgate/engage/product/Gallery') || {};

  const { GalleryImage: galleryResolutions } = getThemeSettings('AppImages') || {};

  const resolution = galleryResolutions[galleryResolutions.length - 1];

  const imagesWithResolutions = images.map(src => getActualImageSource(src, resolution));

  return (
    <div className={styles.container}>
      <Swiper
        classNames={styles.sliderStyles}
        className={styles.slider}
        initialSlide={initialSlide}
        indicators
        loop={imagesWithResolutions.length > 1}
        disabled={imagesWithResolutions.length === 1}
        zoom={{
          ...GALLERY_SLIDER_ZOOM,
          ...zoom,
        }}
      >
        {imagesWithResolutions.map(image => (
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
