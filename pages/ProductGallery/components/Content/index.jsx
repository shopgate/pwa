import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Image from '@shopgate/pwa-common/components/Image';
import ZoomPanSlider from '../ZoomPanSlider';
import styles from './style';
import connect from './connector';

/**
 * @param {Array} images array of images formats
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
 * @return {JSX}
 */
const ProductGalleryContent = ({ initialSlide, images }) => {
  let content = null;
  if (images) {
    const imagesByIndex = getImagesByIndex(images);
    content = imagesByIndex.map(imagesInIndex => (
      <div className={styles.slide} key={JSON.stringify(imagesInIndex)}>
        <Image srcmap={imagesInIndex} />
      </div>
    ));
  }

  return (
    <Fragment>
      <div className={styles.container}>
        <ZoomPanSlider
          classNames={styles.sliderStyles}
          className={styles.slider}
          initialSlide={initialSlide}
          indicators
          loop
        >
          {images ? content : <div />}
        </ZoomPanSlider>
      </div>
    </Fragment>
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
