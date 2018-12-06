import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_IMAGE,
  PRODUCT_IMAGE_AFTER,
  PRODUCT_IMAGE_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import Hammer from 'react-hammerjs';
import ProductImage from 'Components/ProductImage';
import BaseImageSlider from '@shopgate/pwa-ui-shared/ImageSlider';
import connect from './connector';

const fallbackResolutions = [
  {
    width: 440,
    height: 440,
  },
  {
    width: 1024,
    height: 1024,
  },
];

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
 * The product image slider component.
 * @param {number} currentSlide The index of the current visible slide.
 */
class ImageSlider extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape()),
    navigate: PropTypes.func,
    product: PropTypes.shape(),
  };

  static defaultProps = {
    images: null,
    product: null,
    navigate: () => { },
  };

  /**
   * @param {Object} nextProps the next props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    if (this.props.product !== nextProps.product || this.props.navigate !== nextProps.navigate) {
      return true;
    }

    if (this.props.images && nextProps.images) {
      if (this.props.images.length !== nextProps.images.length) return true;
    }

    return !isEqual(this.props.images, nextProps.images);
  }

  currentSlide = 0;

  handleOpenGallery = () => {
    const { images } = this.props;

    if (!images || (Array.isArray(images) && !images.length)) {
      return;
    }

    this.props.navigate(this.currentSlide);
  };

  handleSlideChange = (currentSlide) => {
    this.currentSlide = currentSlide;
  };

  /**
   * Renders the product image slider component.
   * @returns {JSX}
   */
  render() {
    const { product, images } = this.props;
    let content;

    if (product && Array.isArray(images)) {
      const imagesByIndex = getImagesByIndex(images);

      if (imagesByIndex.length) {
        content = (
          <BaseImageSlider loop indicators onSlideChange={this.handleSlideChange}>
            {imagesByIndex.map((imagesInIndex, index) =>
              (
                <ProductImage
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${product.id}-${index}`}
                  srcmap={imagesInIndex}
                  animating={false}
                />
              ))}
          </BaseImageSlider>
        );
      }
    }

    if (!content) {
      content = (
        <ProductImage
          src={product ? product.featuredImageUrl : null}
          forcePlaceholder={!product}
          resolutions={fallbackResolutions}
        />
      );
    }

    return (
      <Fragment>
        <Portal name={PRODUCT_IMAGE_BEFORE} />
        <Portal name={PRODUCT_IMAGE}>
          <Hammer
            onPinchStart={this.handleOpenGallery}
            onTap={this.handleOpenGallery}
            direction="DIRECTION_ALL"
            options={{
              touchAction: 'pan-x pan-y',
              recognizers: {
                pinch: { enable: true },
              },
            }}
          >
            <div data-test-id={`product: ${product ? product.name : ''}`}>{content}</div>
          </Hammer>
        </Portal>
        <Portal name={PRODUCT_IMAGE_AFTER} />
      </Fragment>
    );
  }
}

export default connect(ImageSlider);
