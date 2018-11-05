import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Hammer from '@shopgate/react-hammerjs';
import ProductImage from 'Components/ProductImage';
import BaseImageSlider from '@shopgate/pwa-ui-shared/ImageSlider';
import connect from './connector';

/**
 * The product image slider component.
 * @param {number} currentSlide The index of the current visible slide.
 * @param {Object} props The component props.
 * @param {Object} props.product Basic product data from the product state.
 * @param {Array} props.images Array of image urls.
 */
class ImageSlider extends Component {
  static propTypes = {
    resolutions: PropTypes.shape(),
    onOpen: PropTypes.func,
    product: PropTypes.shape(),
  };

  static defaultProps = {
    resolutions: {},
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

  /**
   * @param {*} nextProps next props
   * @param {*} nextState next state
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) return true;

    const productChanged = !(nextProps.product === this.props.product);
    const resolutionsReceived = this.props.resolutions === {} && nextProps.resolutions !== {};
    const resolutionsChanged = (nextProps.resolutions && nextProps.resolutions !== {}) && this.props.resolutions !== nextProps.resolutions;
    const componentShouldUpdate = productChanged || resolutionsReceived || resolutionsChanged;
    return componentShouldUpdate;
  }

  handleOpenGallery = () => {
    const { product, resolutions } = this.props;

    if (!product || !resolutions || !resolutions['440x440'].length) {
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
    const { product, resolutions } = this.props;

    const images = [];
    let content = null;

    if (resolutions) {
      const resolutionStrings = Object.keys(resolutions);
      resolutionStrings.forEach((resolutionString) => {
        let counter = 0;
        resolutions[resolutionString].forEach((image) => {
          if (!images[counter]) images[counter] = [];
          images[counter].push(image);
          counter += 1;
        });
      });
    }

    if (!product || !resolutions || resolutions['440x440'].length === 0) {
      content = (
        <ProductImage
          highestResolutionLoaded={this.previewLoaded}
          srcset={product ? [product.featuredImageUrl] : null}
          forcePlaceholder={!product}
        />
      );
    } else {
      content = (
        <BaseImageSlider
          loop
          indicators
          onSlideChange={this.handleSlideChange}
          rebuildOnUpdate
        >
          {images.map(srcset => (
            <ProductImage key={JSON.stringify(srcset)} srcset={srcset} animating={false} />
          ))}
        </BaseImageSlider>
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

export default connect(ImageSlider);
