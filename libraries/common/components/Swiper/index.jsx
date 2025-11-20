import React, {
  useMemo, useCallback, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import {
  A11y,
  Autoplay,
  FreeMode,
  Navigation,
  Pagination,
  Zoom,
} from 'swiper/modules';
/* eslint-disable import/no-unresolved */
import { Swiper as OriginalSwiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/a11y';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/zoom';
/* eslint-enable import/no-unresolved */
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import SwiperItem from './components/SwiperItem';
import {
  container, innerContainer, zoomFix, buttonNext, buttonPrev,
} from './styles';

/**
 * @typedef {import('swiper/react').SwiperProps} SwiperCmpProps
 */

/**
 * @typedef {import('swiper/react').SwiperClass} SwiperClass
 */

/**
 * Performs steps that are required when the loop prop of the Swiper is updated.
 * @param {SwiperClass} swiper Swiper instance
 * @param {boolean} loop Whether the loop mode should be enabled or not.
 */
const handleLoopPropUpdate = (swiper, loop) => {
  const realIndex = swiper?.realIndex || 0;

  // eslint-disable-next-line no-param-reassign
  swiper.params.loop = loop;
  if (loop) {
    swiper.loopDestroy();
    swiper.loopCreate(realIndex);
    swiper.updateSlides();
  } else {
    swiper.loopDestroy();
  }
};

/**
 * The basic Swiper component. It acts as a wrapper for the Swiper JS library component.
 *
 * This component wraps the [Swiper](https://swiperjs.com/) library's main component.
 * Refer to the [Swiper documentation](https://swiperjs.com/react) for details on the available props.
 *
 * @param {SwiperCmpProps} props The component props.
 * @returns {JSX.Element}
 */
const Swiper = ({
  maxIndicators,
  indicators,
  controls,
  'aria-hidden': ariaHidden,
  disabled,
  autoPlay,
  interval,
  classNames,
  className,
  onSlideChange,
  onBreakpoint,
  additionalModules,
  loop: loopProp,
  children,
  paginationType: paginationTypeProp,
  ...swiperProps
}) => {
  const useFraction = (maxIndicators && maxIndicators < children.length);
  const paginationType = useFraction ? 'fraction' : 'bullets';
  const showPagination = (indicators && children.length > 1);
  const hasControls = typeof controls === 'boolean' && controls === true;
  const reduceMotion = useReduceMotion();

  /** @type {React.RefObject<{ swiper: SwiperClass}>} */
  const swiperRef = useRef(null);

  const [currentSlidesPerView, setCurrentSlidesPerView] = useState(swiperProps?.slidesPerView || 1);

  const navigation = useMemo(() => {
    let nav;

    if (hasControls) {
      nav = {
        // Important to use dot notation (swiper uses it as selector internally)
        nextEl: `.swiper-button-next.${buttonNext}`,
        prevEl: `.swiper-button-prev.${buttonPrev}`,
      };
    }

    if (typeof controls === 'object') {
      nav = controls;
    }

    return nav;
  }, [controls, hasControls]);

  const handleSlideChange = useCallback((swiper) => {
    if (typeof onSlideChange === 'function') {
      onSlideChange(swiper.realIndex, swiper);
    }
  }, [onSlideChange]);

  /**
   * @type {SwiperCmpProps}
   */
  const internalProps = useMemo(() => ({
    modules: [
      A11y,
      Autoplay,
      FreeMode,
      Navigation,
      Pagination,
      Zoom,
      ...(Array.isArray(additionalModules) ? additionalModules : []),
    ],
    className: cls(innerContainer, classNames.container, { [zoomFix]: swiperProps?.zoom }),
    autoplay: autoPlay ? {
      delay: interval,
    } : false,
    navigation,
    ...showPagination && {
      pagination: {
        el: undefined,
        type: paginationTypeProp || paginationType,
        bulletClass: classNames.bulletClass || 'swiper-pagination-bullet',
        bulletActiveClass: classNames.bulletActiveClass || 'swiper-pagination-bullet-active',
        dynamicBullets: true,
        clickable: true,
        enabled: indicators && children.length > 1,
      },
    },
    allowSlidePrev: !disabled,
    allowSlideNext: !disabled,
    onSlideChange: handleSlideChange,
  }),
  [
    additionalModules,
    classNames.container,
    classNames.bulletClass,
    classNames.bulletActiveClass,
    swiperProps,
    autoPlay,
    interval,
    navigation,
    showPagination,
    paginationTypeProp,
    paginationType,
    indicators,
    children.length,
    disabled,
    handleSlideChange,
  ]);

  useEffect(() => {
    if (!internalProps.autoplay && !swiperProps.autoplay) {
      if (swiperRef.current?.swiper?.autoplay) {
        // When autoplay is disabled, ensure that the slider is really stopped. That tackles UI
        // issues when e.g. autoplay and loop mode where disabled during one slide interval.
        swiperRef.current.swiper.autoplay.stop();
      }

      return;
    }

    if (swiperRef.current?.swiper?.autoplay) {
      if (reduceMotion) {
        swiperRef.current.swiper.autoplay.stop();
      } else {
        swiperRef.current.swiper.autoplay.start();
      }
    }
  }, [internalProps.autoplay, reduceMotion, swiperProps.autoplay]);

  // The currently configured delay for autoplay.
  const delay = internalProps.autoplay?.delay || swiperProps.autoplay?.delay;
  // Whether the loop mode should be enabled.
  const shouldLoop = loopProp && children?.length > currentSlidesPerView + 1;

  useEffect(() => {
    if (!swiperRef.current) return;
    // Perform required steps when loop prop changes on runtime.
    handleLoopPropUpdate(swiperRef.current.swiper, shouldLoop);
  }, [shouldLoop]);

  /**
   * Handles the breakpoint change event.
   * The Swiper has some issues when props are changed on runtime followed by a breakpoint change.
   * This function is supposed to ensure the the Swiper behaves as expected in that case.
   */
  const handleOnBreakpoint = useCallback(
    /**
     * @param {SwiperClass} swiper Swiper instance
     * @param {Object} breakpoint Current breakpoint object
     */
    (swiper, breakpoint) => {
      let { slidesPerView } = breakpoint;

      if (!slidesPerView) {
        slidesPerView = 1;
      }

      const wasRunning = swiper?.autoplay?.running || false;

      if (wasRunning) {
        swiper.autoplay.stop();
      }

      const loopUpdate = loopProp && swiper.slides.length > slidesPerView + 1;

      handleLoopPropUpdate(swiper, loopUpdate);

      if (typeof delay === 'number' && swiper.params.autoplay) {
        // eslint-disable-next-line no-param-reassign
        swiper.params.autoplay.delay = delay;
      }

      if (wasRunning) {
        swiper.autoplay.start();
      }

      setCurrentSlidesPerView(slidesPerView);

      if (typeof onBreakpoint === 'function') {
        onBreakpoint(swiper, breakpoint);
      }
    }, [delay, loopProp, onBreakpoint]
  );

  return (
    <div className={cls(container, className, 'common__swiper')} aria-hidden={ariaHidden}>
      <OriginalSwiper
        aria-live="off"
        a11y={{ enabled: false }}
        {...internalProps}
        {...swiperProps}
        loop={shouldLoop}
        onBreakpoint={handleOnBreakpoint}
        ref={swiperRef}
      >
        {children}
        {hasControls && (
          <>
            <div className={`swiper-button-next ${buttonNext}`} />
            <div className={`swiper-button-prev ${buttonPrev}`} />
          </>
        )}
      </OriginalSwiper>
    </div>
  );
};

Swiper.Item = SwiperItem;

Swiper.propTypes = {
  children: PropTypes.node.isRequired,
  /**
   * Optional list of additional Swiper modules to include.
   */
  additionalModules: PropTypes.arrayOf(PropTypes.func),
  /**
   * Whether the swiper should be hidden from screen readers.
   */
  'aria-hidden': PropTypes.bool,
  /**
   * Custom shortcut to enable auto play. Default interval can be changed via the `interval` prop.
   * @deprecated Use prop `autoplay` instead.
   * @see https://v9.swiperjs.com/swiper-api#autoplay
   */
  autoPlay: PropTypes.bool,
  className: PropTypes.string,
  classNames: PropTypes.shape({
    container: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
    ]),
    item: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
    ]),
    bulletClass: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
    ]),
    bulletActiveClass: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
    ]),
  }),
  /**
   * Custom shortcut to enable navigation controls.
   *
   * For extended options use the `navigation` prop directly.
   * @see https://v9.swiperjs.com/swiper-api#navigation
   */
  controls: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape(),
  ]),
  /**
   * Whether the swiper should be disabled
   */
  disabled: PropTypes.bool,
  /**
   * Custom shortcut to enable pagination indicators.
   *
   * As an alternative, you can use the `pagination` prop directly to configure the pagination.
   * @see https://v9.swiperjs.com/swiper-api#pagination
   */
  indicators: PropTypes.bool,
  /**
   * Custom prop to set the interval for auto play. Prop is only used if `autoPlay` is set to
   * `true`.
   * @deprecated Use prop `autoplay` instead.
   * @see https://v9.swiperjs.com/swiper-api#autoplay
   */
  interval: PropTypes.number,
  loop: PropTypes.bool,
  /**
   * Maximum number of bullets to show in pagination. If the number of children is greater than
   * this number, bullet pagination will be replaced with fraction (numeric) pagination.
   */
  maxIndicators: PropTypes.number,
  onBreakpoint: PropTypes.func,
  /**
   * Callback invoked when the Swiper slide changes.
   * Invoked with the index of the new slide and the Swiper instance.
   */
  onSlideChange: PropTypes.func,
  /**
   * Config to determine slider pagination type
   */
  paginationType: PropTypes.string,
};

Swiper.defaultProps = {
  'aria-hidden': false,
  additionalModules: null,
  autoPlay: false,
  className: null,
  classNames: {},
  controls: false,
  indicators: false,
  interval: 3000,
  loop: false,
  maxIndicators: null,
  disabled: false,
  onSlideChange: null,
  onBreakpoint: null,
  paginationType: null,
};

export default Swiper;
