import React from 'react';
import PropTypes from 'prop-types';
import { Swiper, Image } from '@shopgate/pwa-common/components';
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

const zoom = {
  maxRatio: 3,
  minRation: 1,
};

/**
 * The Product Gallery content component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ProductGalleryContent = ({ initialSlide, images }) => {
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
        loop={images.length > 1}
        disabled={images.length === 1}
        zoom={zoom}
      >
        {imagesByIndex.map(imagesInIndex => (
          <Swiper.Item key={imagesInIndex[0]}>
            <div className="swiper-zoom-container">
              <Image srcmap={imagesInIndex} className={styles.slide} animating={false} />
            </div>
          </Swiper.Item>
        ))}
      </Swiper>
    </div>
  );
};

ProductGalleryContent.propTypes = {
  initialSlide: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape()),
};

ProductGalleryContent.defaultProps = {
  images: null,
};

export default connect(ProductGalleryContent);
