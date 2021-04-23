import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Backdrop, ArrowIcon, Ripple,
} from '@shopgate/engage/components';
import { ProductImage } from '@shopgate/engage/product';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import { css } from 'glamor';
import connect from './Media.connector';

const styles = {
  root: css({
    paddingRight: 32,
    width: '100%',
  }).toString(),
  image: css({
    cursor: 'pointer',
  }).toString(),
  gallery: css({
    display: 'flex',
    paddingTop: 16,
    width: 'calc(100% + 16px)',
    margin: -8,
    flexWrap: 'wrap',
  }).toString(),
  item: css({
    cursor: 'pointer',
    margin: 8,
    width: 'calc(33.3% - 16px)',
    [responsiveMediaQuery('<=md')]: {
      width: 'calc(50% - 16px)',
    },
  }).toString(),
  modalContainer: css({
    display: 'flex',
    width: '100vw',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  }).toString(),
  modal: css({
    minWidth: 400,
    maxWidth: 600,
    width: '50%',
  }).toString(),
  modalGallery: css({
    display: 'flex',
    flexDirection: 'row',
    margin: '16px -7px -7px -7px',
    flexWrap: 'wrap',
  }).toString(),
  modalPreview: css({
    cursor: 'pointer',
    width: 'calc(12.5% - 14px)',
    [responsiveMediaQuery('<=sm')]: {
      width: 'calc(20% - 14px)',
    },
    margin: 7,
  }).toString(),
  modalPreviewActive: css({
    border: '2px solid var(--color-primary)',
  }).toString(),
  leftArrow: css({
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 50,
    background: 'rgba(255, 255, 255, 0.2)',
    marginRight: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontSize: 28,
    cursor: 'pointer',
  }).toString(),
  rightArrow: css({
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 50,
    background: 'rgba(255, 255, 255, 0.2)',
    marginLeft: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontSize: 28,
    transform: 'scaleX(-1)',
    cursor: 'pointer',
  }).toString(),
};

/**
 * Media
 * @params {Object} featuredImage The featured image url.
 * @returns {JSX}
 */
const Media = ({ featuredImage, images }) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  /**
   * @param {number} index Image index.
   */
  const handleOpenGallery = (index) => {
    if (images.length <= 1) {
      return;
    }
    setGalleryOpen(true);
    setImageIndex(index);
  };

  /**
   * @param {number} value Image index mod.
   */
  const handleNextPrev = (value) => {
    const lastIndex = images.length - 1;
    const newIndex = imageIndex + value;
    if (newIndex < 0) {
      setImageIndex(lastIndex);
      return;
    }
    if (newIndex > lastIndex) {
      setImageIndex(0);
      return;
    }
    setImageIndex(newIndex);
  };

  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div className={styles.root}>
      {galleryOpen ? (
        <Modal>
          <Backdrop
            isVisible
            level={0}
            opacity={80}
            onClick={() => setGalleryOpen(false)}
          />
          <div className={styles.modalContainer}>
            <Ripple
              onClick={() => handleNextPrev(-1)}
              color="#fff"
              className={styles.leftArrow}
            >
              <ArrowIcon />
            </Ripple>
            <div className={styles.modal}>
              <div className={styles.modalActive}>
                <ProductImage
                  onClick={() => handleOpenGallery(0)}
                  src={images[imageIndex]}
                />
              </div>
              <div className={styles.modalGallery}>
                {images.map((image, index) => (
                  <div
                    key={image}
                    onClick={() => handleOpenGallery(index)}
                    className={`${styles.modalPreview} ${index === imageIndex && styles.modalPreviewActive}`}
                  >
                    <ProductImage src={image} />
                  </div>
                ))}
              </div>
            </div>
            <Ripple
              onClick={() => handleNextPrev(1)}
              color="#fff"
              className={styles.rightArrow}
            >
              <ArrowIcon />
            </Ripple>
          </div>
        </Modal>
      ) : null}
      <div onClick={() => handleOpenGallery(0)}>
        <ProductImage
          className={styles.image}
          src={featuredImage}
        />
      </div>
      <div className={styles.gallery}>
        {images.length > 1
          ? (images.slice(1).map((image, index) => (
            <div
              key={image}
              onClick={() => handleOpenGallery(index + 1)}
              className={styles.item}
            >
              <ProductImage src={image} />
            </div>
          )))
          : null
        }
      </div>
    </div>
  );
  /* eslint-enable jsx-a11y/click-events-have-key-events */
  /* eslint-enable jsx-a11y/no-static-element-interactions */
};

Media.propTypes = {
  featuredImage: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string),
};

Media.defaultProps = {
  featuredImage: '',
  images: [],
};

export default connect(Media);
