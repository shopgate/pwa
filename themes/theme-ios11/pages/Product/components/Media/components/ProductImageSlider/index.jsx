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
    productId: PropTypes.string,
    variantId: PropTypes.string,
  };

  static defaultProps = {
    'aria-hidden': null,
    className: null,
    historyPush: noop,
    images: null,
    product: null,
    productId: null,
    variantId: null,
  };

  /**
   *
   * @inheritDoc
   */
  constructor(props, context) {
    super(props, context);
    this.mediaRef = React.createRef(null);
    this.state = {
      depImage: null,
    };
  }

  /**
   * @inheritDoc
   */
  componentDidMount() {
    this.mounted = true;
  }

  /**
   * @param {Object} nextProps the next props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    let depImage = null;

    if (!nextProps.images) {
      // Is loading, blur media
      if (this.mediaRef.current) {
        this.mediaRef.current.style.filter = 'blur(3px)';
      }
    }
    if (nextProps.images) {
      if (!nextProps.images.length && nextProps.product) {
        depImage = nextProps.product.featuredImageBaseUrl;
      } else if (!isEqual(this.props.images, nextProps.images)) {
        [depImage] = nextProps.images;
      }
    }
    if (depImage) {
      // if depImage has not changed since last time
      if (this.state.depImage === depImage) {
        if (this.mediaRef.current) this.mediaRef.current.style.filter = 'none';
        return true;
      }
      // Blur for image load
      if (this.mediaRef.current) {
        this.mediaRef.current.style.filter = 'blur(3px)';
      }
      this.setState({ depImage });
      loadProductImage(depImage)
        .then(() => {
          if (this.mounted) {
            if (this.mediaRef.current) {
              this.mediaRef.current.style.filter = 'none';
            }
            this.forceUpdate();
          }
        }).catch(() => {
          if (this.mounted) {
            if (this.mediaRef.current) {
              this.mediaRef.current.style.filter = 'none';
            }
          }
        });
    }
    return false;
  }

  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  handleOpenGallery = () => {
    this.props.historyPush({
      pathname: `${ITEM_PATH}/${bin2hex(this.props.variantId || this.props.productId)}/gallery/${this.currentSlide}`,
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
      product, productId, images, 'aria-hidden': ariaHidden, className,
    } = this.props;
    const { HeroImage: pdpResolutions } = getProductImageSettings();
    let content;

    if (images && images.length > 1) {
      content = (
        <Swiper
          loop
          indicators
          onSlideChange={this.handleSlideChange}
          className={className}
        >
          {images.map(image => (
            <Swiper.Item key={`${productId}-${image}`}>
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

    let onClick = this.handleOpenGallery;
    if (!content) {
      let src = null;
      if (product && product.featuredImageBaseUrl) src = product.featuredImageBaseUrl;
      else if (images && images.length) [src] = images;

      content = (
        <ProductImage
          src={src}
          className={className}
          forcePlaceholder={!src}
          resolutions={pdpResolutions}
          noBackground
        />
      );
      if (!src) {
        onClick = noop;
      }
    }

    const wrapperStyles = {
      transition: '0.5s filter ease-out', // blur filter
    };

    return (
      <Fragment>
        <Portal name={PRODUCT_IMAGE_BEFORE} />
        <Portal name={PRODUCT_IMAGE}>
          <div
            className="theme__product__product-image-slider"
            data-test-id={`product: ${product ? product.name : ''}`}
            onClick={onClick}
            onKeyDown={onClick}
            role="button"
            tabIndex="0"
            aria-hidden={ariaHidden}
            style={wrapperStyles}
            ref={this.mediaRef}
          >
            {content}
          </div>
        </Portal>
        <Portal name={PRODUCT_IMAGE_AFTER} />
      </Fragment>
    );
  }
}

export default withNavigation(connect(ProductImageSlider));
