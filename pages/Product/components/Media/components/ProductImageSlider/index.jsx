import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import { withNavigation, bin2hex } from '@shopgate/engage/core';
import { Swiper, Portal } from '@shopgate/engage/components';
import {
  PRODUCT_IMAGE,
  PRODUCT_IMAGE_AFTER,
  PRODUCT_IMAGE_BEFORE,
  loadProductImage,
  ITEM_PATH,
  ProductImage,
  getProductImageSettings,
} from '@shopgate/engage/product';
import MediaSection from '../MediaSection';
import connect from './connector';

/**
 * The product image slider component.
 * @param {number} currentSlide The index of the current visible slide.
 * @deprecated since catalog 2.0
 */
class ProductImageSlider extends Component {
  static propTypes = {
    'aria-hidden': PropTypes.bool,
    className: PropTypes.string,
    historyPush: PropTypes.func,
    images: PropTypes.arrayOf(PropTypes.string),
    product: PropTypes.shape(),
  };

  static defaultProps = {
    'aria-hidden': null,
    className: null,
    historyPush: noop,
    images: null,
    product: null,
  };

  /**
   * @param {Object} nextProps the next props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    let depImage = null;
    if (this.props.product !== nextProps.product) {
      // Update only after new product data is received, skipping null
      if (nextProps.product && nextProps.product.featuredImageBaseUrl) {
        depImage = nextProps.product.featuredImageBaseUrl;
      }
    }

    if (this.props.images && nextProps.images) {
      if (isEqual(this.props.images, nextProps.images)) {
        return false;
      }

      if (this.props.images.length !== nextProps.images.length && !nextProps.images.length) {
        // Product image will be shown due to no images
        return true;
      }

      [depImage] = nextProps.images;
    }

    if (depImage) {
      // We have dependency image that we need to load before re-render
      loadProductImage(depImage).then(() => this.forceUpdate());
    }

    return false;
  }

  handleOpenGallery = () => {
    this.props.historyPush({
      pathname: `${ITEM_PATH}/${bin2hex(this.props.product.id)}/gallery/${this.currentSlide}`,
    });
  };

  handleSlideChange = (currentSlide) => {
    this.currentSlide = currentSlide;
  };

  currentSlide = 0;

  /**
   * Renders the product image slider component.
   * @returns {JSX}
   */
  render() {
    const {
      product, images, 'aria-hidden': ariaHidden, className,
    } = this.props;
    const { HeroImage: pdpResolutions } = getProductImageSettings();
    let content;
    let onClick = this.handleOpenGallery;

    if (product && Array.isArray(images) && images.length > 1) {
      content = (
        <Swiper
          loop
          indicators
          onSlideChange={this.handleSlideChange}
          className={className}
        >
          {images.map(image => (
            <Swiper.Item key={`${product.id}-${image}`}>
              <ProductImage
                src={image}
                animating={false}
                resolutions={pdpResolutions}
                noBackground
              />
            </Swiper.Item>
          ))}
        </Swiper>
      );
    }

    if (!content) {
      content = (
        <ProductImage
          src={product ? product.featuredImageBaseUrl : null}
          className={className}
          forcePlaceholder={!product}
          resolutions={pdpResolutions}
        />
      );
      if (!images || (images && !images.length)) {
        onClick = noop;
      }
    }

    return (
      <Fragment>
        <Portal name={PRODUCT_IMAGE_BEFORE} />
        <Portal name={PRODUCT_IMAGE}>
          <MediaSection
            product={product}
            aria-hidden={ariaHidden}
            onClick={onClick}
          >
            {content}
          </MediaSection>
        </Portal>
        <Portal name={PRODUCT_IMAGE_AFTER} />
      </Fragment>
    );
  }
}

export default withNavigation(connect(ProductImageSlider));
