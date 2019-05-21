import React from 'react';
import PropTypes from 'prop-types';
import { Swiper } from '@shopgate/engage/components';
import { GALLERY_SLIDER_ZOOM } from './../../../../constants';
import styles from './style';
import connect from './connector';

/**
 * @param {Array} images array of format images
 * @returns {Array} array of indexed images
 */
const getImagesByIndex = (images) => {
  const imagesByIndex = [];

  images.forEach((format) => {
    if (!format.sources || !format.sources.length) return;
    format.sources.forEach((src, index) => {
      if (!imagesByIndex[index]) imagesByIndex[index] = [];
      imagesByIndex[index].push(src);
    });
  });

  return imagesByIndex;
};

/**
 * The Product Gallery content component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ProductGalleryImages = ({ initialSlide, images }) => {
  if (!Array.isArray(images) || images.length === 0) {
    return <div className={styles.container} />;
  }

  const imagesByIndex = getImagesByIndex(images);

  return (
    <div className={styles.container}>
      <Swiper
        classNames={styles.sliderStyles}
        className={styles.slider}
        initialSlide={initialSlide}
        indicators
        loop={imagesByIndex.length > 1}
        disabled={imagesByIndex.length === 1}
        zoom={GALLERY_SLIDER_ZOOM}
      >
        {imagesByIndex.map(imagesInIndex => (
          <Swiper.Item key={imagesInIndex[0]}>
            <div className="swiper-zoom-container">
              <img
                src={imagesInIndex[imagesInIndex.length - 1]}
                alt={imagesInIndex[imagesInIndex.length - 1]}
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
  images: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  initialSlide: PropTypes.number.isRequired,
};

export default connect(ProductGalleryImages);
