import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Backdrop, ArrowIcon, Ripple,
} from '@shopgate/engage/components';
import {
  ProductImage,
  getProductImageSettings,
  ProductListTypeProvider,
  ProductListEntryProvider,
} from '@shopgate/engage/product';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import connect from './Media.connector';

const {
  HeroImage: pdpResolutions,
  GalleryImage: galleryResolutions,
} = getProductImageSettings();

const useStyles = makeStyles()({
  root: {
    paddingRight: 32,
    width: '100%',
  },
  image: {
    cursor: 'pointer',
  },
  gallery: {
    display: 'flex',
    paddingTop: 16,
    width: 'calc(100% + 16px)',
    margin: -8,
    flexWrap: 'wrap',
  },
  item: {
    cursor: 'pointer',
    margin: 8,
    width: 'calc(33.3% - 16px)',
    [responsiveMediaQuery('<=md')]: {
      width: 'calc(50% - 16px)',
    },
  },
  modalContainer: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    minWidth: 400,
    maxWidth: 600,
    width: '50%',
  },
  modalGallery: {
    display: 'flex',
    flexDirection: 'row',
    margin: '16px -7px -7px -7px',
    flexWrap: 'wrap',
  },
  modalPreview: {
    cursor: 'pointer',
    width: 'calc(12.5% - 14px)',
    [responsiveMediaQuery('<=sm')]: {
      width: 'calc(20% - 14px)',
    },
    margin: 7,
  },
  modalPreviewActive: {
    border: '2px solid var(--color-primary)',
  },
  leftArrow: {
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
  },
  rightArrow: {
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
  },
});

/**
 * Media
 * @params {Object} featuredImage The featured image url.
 * @returns {JSX}
 */
const Media = ({
  featuredImage,
  images,
  productId,
  variantId,
}) => {
  const { classes } = useStyles();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  /**
   * @param {number} index Image index.
   */
  const handleOpenGallery = (index) => {
    if (images.length < 1) {
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
    <div className={classes.root}>
      {galleryOpen ? (
        <Modal>
          <ProductListTypeProvider type="productGallery">
            <ProductListEntryProvider productId={variantId || productId}>
              <Backdrop
                isVisible
                level={0}
                opacity={80}
                onClick={() => setGalleryOpen(false)}
              />
              <div className={classes.modalContainer}>
                <Ripple
                  onClick={() => handleNextPrev(-1)}
                  color="#fff"
                  className={classes.leftArrow}
                >
                  <ArrowIcon />
                </Ripple>
                <div className={classes.modal}>
                  <div className={classes.modalActive}>
                    <ProductImage
                      onClick={() => handleOpenGallery(0)}
                      src={images[imageIndex]}
                      resolutions={galleryResolutions}
                    />
                  </div>
                  <div className={classes.modalGallery}>
                    {images.map((image, index) => (
                      <div
                        key={image}
                        onClick={() => handleOpenGallery(index)}
                        className={`${classes.modalPreview} ${index === imageIndex && classes.modalPreviewActive}`}
                      >
                        <ProductImage
                          src={image}
                          resolutions={galleryResolutions}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <Ripple
                  onClick={() => handleNextPrev(1)}
                  color="#fff"
                  className={classes.rightArrow}
                >
                  <ArrowIcon />
                </Ripple>
              </div>
            </ProductListEntryProvider>
          </ProductListTypeProvider>
        </Modal>
      ) : null}
      <ProductListTypeProvider type="pdp" subType="mediaSection">
        <ProductListEntryProvider productId={variantId || productId}>
          <div onClick={() => handleOpenGallery(0)}>
            <ProductImage
              className={classes.image}
              src={featuredImage}
              resolutions={pdpResolutions}
            />
          </div>
          <div className={classes.gallery}>
            {images.length > 1
              ? (images.slice(1).map((image, index) => (
                <div
                  key={image}
                  onClick={() => handleOpenGallery(index + 1)}
                  className={classes.item}
                >
                  <ProductImage
                    src={image}
                    resolutions={pdpResolutions}
                  />
                </div>
              )))
              : null}
          </div>
        </ProductListEntryProvider>
      </ProductListTypeProvider>
    </div>
  );
  /* eslint-enable jsx-a11y/click-events-have-key-events */
  /* eslint-enable jsx-a11y/no-static-element-interactions */
};

Media.propTypes = {
  productId: PropTypes.string.isRequired,
  featuredImage: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string),
  variantId: PropTypes.string,
};

Media.defaultProps = {
  featuredImage: '',
  images: [],
  variantId: null,
};

export default connect(Media);
