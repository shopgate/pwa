import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { Swiper, Portal } from '@shopgate/pwa-common/components';
import {
  PRODUCT_IMAGE,
  PRODUCT_IMAGE_AFTER,
  PRODUCT_IMAGE_BEFORE,
} from '@shopgate/pwa-common-commerce/product';
import ProductImage from 'Components/ProductImage';
import connect from './connector';

const fallbackResolutions = [
  {
    width: 440,
    height: 440,
  },
];

/**
 * reformats the images array to group pictures by index, not by format
 * @param {Array} images array of format images
 * @returns {Array}
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

    if (product && Array.isArray(images) && images.length > 1) {
      const imagesByIndex = getImagesByIndex(images);

      if (imagesByIndex.length) {
        content = (
          <Swiper loop indicators onSlideChange={this.handleSlideChange}>
            {imagesByIndex.map(imagesInIndex => (
              <Swiper.Item key={`${product.id}-${imagesInIndex[0]}`}>
                <ProductImage srcmap={imagesInIndex} animating={false} />
              </Swiper.Item>
            ))}
          </Swiper>
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
          <div
            data-test-id={`product: ${product ? product.name : ''}`}
            onClick={this.handleOpenGallery}
            onKeyDown={this.handleOpenGallery}
            role="button"
            tabIndex="0"
          >
            {content}
          </div>
        </Portal>
        <Portal name={PRODUCT_IMAGE_AFTER} />
      </Fragment>
    );
  }
}

export default connect(ImageSlider);
