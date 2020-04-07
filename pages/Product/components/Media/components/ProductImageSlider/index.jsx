import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import { getActualImageSource, getThemeSettings } from '@shopgate/engage/core';
import { Swiper, Portal } from '@shopgate/pwa-common/components';
import {
  PRODUCT_IMAGE,
  PRODUCT_IMAGE_AFTER,
  PRODUCT_IMAGE_BEFORE,
} from '@shopgate/pwa-common-commerce/product';
import { ProductImage } from '@shopgate/engage/product';
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
    images: PropTypes.arrayOf(PropTypes.string),
    navigate: PropTypes.func,
    product: PropTypes.shape(),
  };

  static defaultProps = {
    'aria-hidden': null,
    className: null,
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
    this.props.navigate(this.currentSlide);
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
    const { HeroImage: pdpResolutions } = getThemeSettings('AppImages') || {};
    let content;
    let onClick = this.handleOpenGallery;
    let onKeyDown = this.handleOpenGallery;

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
      onClick = noop;
      onKeyDown = noop;
    }

    const imageStyle = product ? {
      background: `url(${getActualImageSource(product.featuredImageBaseUrl, pdpResolutions[0])})`,
      backgroundSize: 'contain',
      transform: 'translate3d(0, 0, 0)',
    } : null;

    return (
      <Fragment>
        <Portal name={PRODUCT_IMAGE_BEFORE} />
        <Portal name={PRODUCT_IMAGE}>
          <div
            data-test-id={`product: ${product ? product.name : ''}`}
            onClick={onClick}
            onKeyDown={onKeyDown}
            role="button"
            tabIndex="0"
            aria-hidden={ariaHidden}
            style={imageStyle}
          >
            {content}
          </div>
        </Portal>
        <Portal name={PRODUCT_IMAGE_AFTER} />
      </Fragment>
    );
  }
}

export default connect(ProductImageSlider);
