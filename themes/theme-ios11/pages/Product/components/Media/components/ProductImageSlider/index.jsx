import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import { withNavigation, bin2hex } from '@shopgate/engage/core';
import { Swiper, SurroundPortals } from '@shopgate/engage/components';
import {
  PRODUCT_IMAGE,
  loadProductImage,
  ITEM_PATH,
  ProductImage,
  getProductImageSettings,
} from '@shopgate/engage/product';
import { appConfig } from '@shopgate/engage';
import { registerTarget, subscribe, hasPendingSource } from '../../../../../../components/HeroTransition/coordinator';
import connect from './connector';

const { pdpImageSliderPaginationType } = appConfig || {};

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
    'aria-hidden': false,
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
      // Hide the real PDP hero from the first paint when this component mounts
      // as the destination of an in-progress flight, so the user never sees the
      // real image and the flying clone at the same time. The coordinator's
      // 'clear' event (emitted on every flight teardown path) reveals it again.
      heroHidden: hasPendingSource(),
    };
  }

  /**
   * @inheritDoc
   */
  componentDidMount() {
    this.mounted = true;

    if (this.mediaRef.current) {
      registerTarget(this.mediaRef.current);
    }

    // Reveal on flight teardown ('clear'); hide again if a new flight begins
    // while this PDP is already mounted (product -> product navigation, where
    // this component becomes the new flight's destination).
    this.unsubscribeHero = subscribe((event) => {
      if (!this.mounted) {
        return;
      }
      if (event.type === 'clear') {
        clearTimeout(this.heroRevealTimer);
        this.setState({ heroHidden: false });
      } else if (event.type === 'source') {
        this.setState({ heroHidden: true });
        // Belt-and-suspenders: schedule a safety reveal in case the matching
        // 'clear' for this new flight is ever missed.
        this.scheduleHeroRevealSafety();
      }
    });

    // Race guard: the flight may have cleared between the initial render (where
    // heroHidden was seeded from hasPendingSource) and this mount. If so, the
    // 'clear' event already fired before we subscribed, so re-check and reveal
    // to guarantee the image can never get stuck hidden.
    if (this.state.heroHidden && !hasPendingSource()) {
      clearTimeout(this.heroRevealTimer);
      this.setState({ heroHidden: false });
    } else if (this.state.heroHidden) {
      // Mounted as an in-progress flight destination: schedule a safety reveal
      // so the hero can never stay hidden if the 'clear' event is ever missed.
      this.scheduleHeroRevealSafety();
    }
  }

  /**
   * @param {Object} nextProps the next props
   * @param {Object} nextState the next state
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    const heroHiddenChanged = nextState.heroHidden !== this.state.heroHidden;
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
        if (this.mediaRef.current) {
          this.mediaRef.current.style.filter = 'none';
        }
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
    return heroHiddenChanged;
  }

  /**
   * Re-registers the hero transition target whenever this component is updated
   * for a different product (e.g. navigating directly from one PDP to another
   * where React updates rather than remounts the component). Only re-registers
   * when the product actually changed so the blur/preload logic in
   * shouldComponentUpdate is not disturbed.
   * @param {Object} prevProps the previous props
   */
  componentDidUpdate(prevProps) {
    const prevId = prevProps.productId || (prevProps.product && prevProps.product.id);
    const nextId = this.props.productId || (this.props.product && this.props.product.id);

    if (prevId !== nextId && this.mediaRef.current) {
      registerTarget(this.mediaRef.current);
    }
  }

  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    this.mounted = false;

    clearTimeout(this.heroRevealTimer);

    if (this.unsubscribeHero) {
      this.unsubscribeHero();
      this.unsubscribeHero = null;
    }
  }

  /**
   * Belt-and-suspenders safety net: whenever the hero is hidden, schedule a
   * one-shot timer that force-reveals it after a bounded delay if it is still
   * hidden. This guarantees the real PDP hero can never stay blank, regardless
   * of any 'clear' event-timing issue. The delay (1500ms) is comfortably longer
   * than the 1000ms flight duration plus the coordinator's ~1100ms cleanup
   * safety, so by the time it fires any legitimate flight has already finished
   * and revealed the hero (in which case this is a no-op).
   */
  scheduleHeroRevealSafety() {
    clearTimeout(this.heroRevealTimer);
    this.heroRevealTimer = setTimeout(() => {
      if (this.mounted && this.state.heroHidden) {
        this.setState({ heroHidden: false });
      }
    }, 1500);
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
   * @returns {JSX.Element}
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
          paginationType={pdpImageSliderPaginationType}
          loop
          indicators
          onSlideChange={this.handleSlideChange}
          className={className}
          aria-hidden={ariaHidden}
          {...pdpImageSliderPaginationType === 'bulletsBelow' ? {
            style: {
              marginBottom: -8,
            },
          } : {}}
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
      if (product && product.featuredImageBaseUrl) {
        src = product.featuredImageBaseUrl;
      } else if (images && images.length) {
        [src] = images;
      }

      content = (
        <ProductImage
          src={src}
          className={className}
          forcePlaceholder={!src}
          resolutions={pdpResolutions}
          noBackground
          alt={product ? product.name : ''}
          aria-hidden={ariaHidden}
        />
      );
      if (!src) {
        onClick = noop;
      }
    }

    const wrapperStyles = {
      transition: '0.5s filter ease-out', // blur filter
      transform: 'translate3d(0, 0, 0)', // Fix for cut off overlapping icons
      // Hide the real hero while a flight is in progress. Instant (no opacity
      // transition) so the reveal at flight teardown is imperceptible. opacity:0
      // keeps layout intact, so registerTarget's getBoundingClientRect still
      // measures the correct destination rect for the flying clone.
      opacity: this.state.heroHidden ? 0 : 1,
    };

    return (
      <div
        className="theme__product__product-image-slider"
        data-test-id={`product: ${product ? product.name : ''}`}
        onClick={onClick}
        onKeyDown={onClick}
        role="presentation"
        style={wrapperStyles}
        ref={this.mediaRef}
      >
        {content}
      </div>
    );
  }
}

/**
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const Wrapper = props => (
  <SurroundPortals portalName={PRODUCT_IMAGE} portalProps={props}>
    <ProductImageSlider {...props} />
  </SurroundPortals>
);

export default withNavigation(connect(Wrapper));
