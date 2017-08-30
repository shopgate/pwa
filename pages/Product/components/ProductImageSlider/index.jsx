/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Hammer from 'react-hammerjs';
import IsAnimating from '@shopgate/pwa-common/components/IsAnimating';
import ProductImage from 'Components/ProductImage';
import ImageSlider from 'Components/ImageSlider';
import connect from './connector';

/**
 * The product image slider component.
 * @param {number} currentSlide The index of the current visible slide.
 * @param {Object} props The component props.
 * @param {Object} props.product Basic product data from the product state.
 * @param {Array} props.images Array of image urls.
 * @param {boolean} props.isAnimating Whether view is being animated.
 */
class ProductImageSlider extends Component {
  static propTypes = {
    isAnimating: PropTypes.bool.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    onOpen: PropTypes.func,
    product: PropTypes.shape(),
  };

  static defaultProps = {
    images: null,
    product: null,
    onOpen: () => {},
  };

  /**
   * Initial state to not render slider
   * @param {Object} props The props of the component.
   */
  constructor(props) {
    super(props);

    this.state = {
      imageSlider: false,
    };
  }

  handleOpenGallery = () => {
    const { product, images } = this.props;

    if (!product || !images || !images.length) {
      return;
    }

    this.props.onOpen(product.id, this.currentSlide);
  };

  handleSlideChange = (currentSlide) => {
    this.currentSlide = currentSlide;
  };

  /**
   * Callback that is executed when preview image is fully loaded.
   */
  previewLoaded = () => {
    this.setState({
      imageSlider: true,
    });
  };

  currentSlide = 0;

  /**
   * Renders the product image slider component.
   * @returns {JSX}
   */
  render() {
    const { product, images, isAnimating } = this.props;

    const resolutions = [
      {
        width: 440,
        height: 440,
      },
      {
        width: 1024,
        height: 1024,
      },
    ];
    let content = null;

    if (isAnimating || !product || !images || images.length === 0) {
      content = (
        <ProductImage
          highestResolutionLoaded={this.previewLoaded}
          src={product ? product.featuredImageUrl : null}
          forcePlaceholder={(isAnimating || !product)}
          resolutions={resolutions}
        />
      );
    } else {
      content = (
        <ImageSlider loop indicators onSlideChange={this.handleSlideChange}>
          {images.map(image => (
            <ProductImage key={image} src={image} animating={false} />
          ))}
        </ImageSlider>
      );
    }

    return (
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
        <div>{content}</div>
      </Hammer>
    );
  }
}

export default IsAnimating(connect(ProductImageSlider), ['images', 'product']);
