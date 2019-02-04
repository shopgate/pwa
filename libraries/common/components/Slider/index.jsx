import 'swiper/dist/css/swiper.min.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper';
import SliderItem from './components/Item';
import styles from './style';
import connect from './connector';

/**
 * The basic slider component.
 */
class Slider extends Component {
  /**
   * Retriggers the creation of loop DOM elements once the start/end of the slider has been reached.
   * @param {Object} slider The Slider object.
   */
  static fixLoopLimits(slider) {
    const numSlides = slider.slides.length;
    const active = slider.activeIndex;

    /**
     * Creation of the loop should be triggered if active index is either first
     * or last 'real' slide.
     */
    const shouldUpdate = (
      active === slider.loopedSlides ||
      active === numSlides - slider.loopedSlides - 1
    );

    if (shouldUpdate) {
      // Update the fake slides.
      slider.reLoop();
    }
  }

  /**
   * Causes the slider to re-translate to the real slide if its looping. Staying on the loop
   * proxy slides may cause undefined behaviours due to missing events.
   * @param {Object} slider The Slider object.
   */
  static fixFakeLoop(slider) {
    if (slider.params.loop && slider.slides.length !== slider.imagesLoaded) {
      // The slider is looping, re-center it to the original dom element if required.
      slider.fixLoop();
    }
  }

  /**
   * Updates slider.
   * @param {Swiper} slider Slider.
   */
  static updateSlider(slider) {
    // If no slider given, skip.
    if (!slider || !slider.update) {
      return;
    }

    slider.update();
  }
  /**
   * A reference to the SliderItem Component.
   * @type {React.Component}
   */
  static Item = SliderItem;

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
    historyPath: PropTypes.string,
    indicators: PropTypes.bool,
    initialSlide: PropTypes.number,
    interval: PropTypes.number,
    loop: PropTypes.bool,
    maxIndicators: PropTypes.number,
    onSlideChange: PropTypes.func,
    rebuildOnUpdate: PropTypes.bool,
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
    historyPath: '',
    indicators: false,
    initialSlide: 0,
    interval: 3000,
    loop: false,
    maxIndicators: null,
    onSlideChange: null,
    rebuildOnUpdate: false,
    slidesPerView: 1,
    snapItems: true,
  };

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
   * Implements shouldComponent update lifecycle method with several reasons:
   * 1. Usually this component renders way to often because of the state changes.
   * 2. HistoryPathname is connected to the redux store additionally to force updates whenever
   * the pathname changes. It's required since sometimes the slider renders while being hidden
   * and then, the size calculations are completely wrong.
   *
   * @param {Object} nextProps Next props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    // Check if children changed.
    const oldKeys = this.props.children.map(c => c.key);
    const newKeys = nextProps.children.map(c => c.key);
    const childrenDifferent = (
      oldKeys.length !== newKeys.length || oldKeys.some((k, i) => newKeys[i] !== k)
    );

    if (childrenDifferent) {
      return true;
    }

    // Check if primitives changed.
    const primitiveTypes = [
      PropTypes.number,
      PropTypes.string,
      PropTypes.bool,
    ];

    const primitivesChanged = Object.keys(this.constructor.propTypes).some((propName) => {
      if (propName === 'children') {
        // Not testing children
        return false;
      }

      const propType = this.constructor.propTypes[propName];

      if (propName === 'slidesPerView' || primitiveTypes.includes(propType)) {
        return this.props[propName] !== nextProps[propName];
      }
      return false;
    });

    if (primitivesChanged) {
      return true;
    }

    // Compare objects.
    return JSON.stringify(this.props.classNames) !== JSON.stringify(nextProps.classNames);
  }

  /**
   * Calls when component did update.
   */
  componentDidUpdate() {
    // Force Swiper update.
    this.constructor.updateSlider(this.slider);
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

    if (this.props.disabled) {
      slider.lockSwipes();
    } else {
      slider.unlockSwipes();
    }
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
      rebuildOnUpdate,
    } = this.props;
    const hasMultipleChildren = children.length > 1;

    const wrappedChildren = this.props.children.map((child, index) => {
      const key = child.key ? `${child.key}_${index}` : index;

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
      onTouchStart: this.constructor.fixLoopLimits,
      onTransitionStart: this.constructor.fixLoopLimits,
      onTransitionEnd: this.constructor.fixFakeLoop,
      onSlideChangeEnd: this.handleSlideChange,
      onInit: this.initSlider,
      rebuildOnUpdate,
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

export { Slider as UnwrappedSlider };

export default connect(Slider);
