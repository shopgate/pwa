import 'swiper/dist/css/swiper.min.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import SliderItem from './components/Item';
import styles from './style';

/**
 * Prevents multi-touch gestures on the slider.
 * @param {string} type The event type, must be one of the touchXYZ events.
 * @param {Object} slider The slider instance.
 */
const fixTouchEvents = (type, slider) => {
  // Get a reference to the dom element.
  const domRef = slider.container[0];

  let realHandler = null;

  // Find the real handler attached to the container.
  if (type === 'touchstart') {
    realHandler = slider.onTouchStart;
  } else if (type === 'touchmove') {
    realHandler = slider.onTouchMove;
  } else if (type === 'touchend') {
    realHandler = slider.onTouchEnd;
  }

  // Remove it ...
  domRef.removeEventListener(type, realHandler);

  // ... and replace it with our custom wrapper.
  domRef.addEventListener(type, (event) => {
    if (event.touches.length <= 1) {
      // Only fire this event if this is not a multi-touch gesture.
      realHandler(event);
    }
  }, false);
};

/**
 * Initializes the slider component.
 * @param {Object} slider The slider object.
 * @param {Object} component The React slider component.
 * @param {boolean} disabled Whether the slider is disabled.
 */
const initSlider = (slider, component, disabled) => {
  const thisComponent = component;
  thisComponent.slider = slider;

  fixTouchEvents('touchstart', slider);
  fixTouchEvents('touchmove', slider);
  fixTouchEvents('touchend', slider);

  if (disabled) {
    slider.lockSwipes();
  } else {
    slider.unlockSwipes();
  }
};

/**
 * Retriggers the creation of loop DOM elements once the start/end of the slider has been reached.
 * @param {Object} slider The Slider object.
 */
const fixLoopLimits = (slider) => {
  const numSlides = slider.slides.length;
  const active = slider.activeIndex;

  // Creation of the loop should be triggered if active index is either first or last 'real' slide.
  const shouldUpdate = (
    active === slider.loopedSlides ||
    active === numSlides - slider.loopedSlides - 1
  );

  if (shouldUpdate) {
    // Update the fake slides.
    slider.reLoop();
  }
};

/**
 * Causes the slider to re-translate to the real slide if its looping. Staying on the loop
 * proxy slides may cause undefined behaviours due to missing events.
 * @param {Object} slider The Slider object.
 */
const fixFakeLoop = (slider) => {
  if (slider.params.loop) {
    // The slider is looping, re-center it to the original dom element if required.
    slider.fixLoop();
  }
};

/**
 * The basic slider component.
 */
class Slider extends Component {
  /**
   * The component prop types.
   * @type {Object}
   */
  static propTypes = {
    children: PropTypes.node.isRequired,
    autoPlay: PropTypes.bool,
    className: PropTypes.string,
    classNames: PropTypes.shape(),
    controls: PropTypes.bool,
    disabled: PropTypes.bool,
    indicators: PropTypes.bool,
    initialSlide: PropTypes.number,
    interval: PropTypes.number,
    loop: PropTypes.bool,
    maxIndicators: PropTypes.number,
    onSlideChange: PropTypes.func,
    preloadImages: PropTypes.bool,
    slidesPerView: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    snapItems: PropTypes.bool,
  };

  /**
   * The component default props.
   * @type {Object}
   */
  static defaultProps = {
    autoPlay: false,
    className: '',
    classNames: {},
    controls: false,
    disabled: false,
    indicators: false,
    initialSlide: 0,
    interval: 3000,
    loop: false,
    maxIndicators: null,
    onSlideChange: null,
    preloadImages: true,
    slidesPerView: 1,
    snapItems: true,
  };

  /**
   * A reference to the SliderItem Component.
   * @type {React.Component}
   */
  static Item = SliderItem;

  /**
   * Creates the component.
   * @param {Object} props The component properties.
   */
  constructor(props) {
    super(props);

    this.slider = null; // The slider instance.
  }

  /**
   * Updates the slider if the props changed.
   * @param {Object} nextProps The new properties.
   */
  componentWillReceiveProps(nextProps) {
    if (!this.slider) {
      return;
    }

    if (nextProps.disabled) {
      this.slider.lockSwipes();
    } else {
      this.slider.unlockSwipes();
    }
  }

  /**
   * Called when the current slide has changed.
   * @param {Object} slider The slider instance of this component.
   */
  handleSlideChange = (slider) => {
    if (!this.props.onSlideChange) {
      return;
    }

    this.props.onSlideChange(slider.activeIndex - 1);
  };

  /**
   * Sets the reference to the correct instance and initializes the slider.
   * @param {Object} slider The slider instance of this component.
   */
  initSlider = (slider) => {
    this.slider = slider;
    initSlider(slider, this, this.props.disabled);
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      autoPlay,
      children,
      classNames,
      controls,
      indicators,
      initialSlide,
      interval,
      loop,
      maxIndicators,
      slidesPerView,
      snapItems,
      preloadImages,
    } = this.props;
    const hasMultipleChildren = children.length > 1;

    const wrappedChildren = this.props.children.map((child, index) => {
      const key = `s${index}`;

      return (
        <div className={styles.slideWrapper} key={key} data-test-id="Slider">
          {child}
        </div>
      );
    });

    /**
     * Determine whether or not to use the fraction indicator.
     */
    const useFraction = (maxIndicators && maxIndicators < children.length);

    const paginationType = useFraction ? 'fraction' : 'bullets';
    const pagination = (indicators && hasMultipleChildren) ? `.${classNames.indicator[paginationType]}` : null;

    const swiperProps = {
      paginationModifierClass: 'sg-swiper-pagination-',
      slideClass: 'sg-swiper-slide',
      containerClass: `sg-swiper-container ${styles.sliderInnerContainer} ${classNames.container || ''}`,
      bulletClass: classNames.inactiveIndicator,
      bulletActiveClass: classNames.activeIndicator,
      paginationType,
      pagination,
      nextButton: controls && hasMultipleChildren ? '.swiper-button-next' : null,
      prevButton: controls && hasMultipleChildren ? '.swiper-button-prev' : null,
      autoplay: autoPlay ? interval : null,
      initialSlide,
      slidesPerView,
      loop,
      freeMode: !snapItems,
      onTouchStart: fixLoopLimits,
      onTransitionStart: fixLoopLimits,
      onTransitionEnd: fixFakeLoop,
      onSlideChangeEnd: this.handleSlideChange,
      onInit: this.initSlider,
      preloadImages,
    };

    return (
      <div className={`${styles.sliderContainer} ${this.props.className}`}>
        <Swiper {...swiperProps}>
          {wrappedChildren}
        </Swiper>
      </div>
    );
  }
}

export default Slider;
