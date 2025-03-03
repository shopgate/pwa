import React, { useMemo, useCallback } from 'react';
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
import 'swiper/swiper.min.css';
import 'swiper/modules/a11y.min.css';
import 'swiper/modules/pagination.min.css';
import 'swiper/modules/navigation.min.css';
import 'swiper/modules/zoom.min.css';
import SwiperItem from './components/SwiperItem';
import OriginalSwiper from './components/OriginalSwiper';
import {
  container, innerContainer, zoomFix, buttonNext, buttonPrev,
} from './styles';

/**
 * @typedef {import('swiper/react').SwiperProps} SwiperCmpProps
 */

/**
 * The basic Swiper component. It acts as a wrapper for the Swiper JS library component.
 *
 * This component wraps the [Swiper](https://swiperjs.com/) library's main component.
 * Refer to the [Swiper documentation](https://swiperjs.com/react) for details on the available props.
 *
 * @param {SwiperCmpProps} props The component props.
 * @returns {React.Node}
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
  additionalModules,
  children,
  ...swiperProps
}) => {
  const useFraction = (maxIndicators && maxIndicators < children.length);
  const paginationType = useFraction ? 'fraction' : 'bullets';
  const showPagination = (indicators && children.length > 1);
  const hasControls = typeof controls === 'boolean' && controls === true;

  let navigation;

  if (hasControls) {
    navigation = {
      // Important to use dot notation (swiper internally use it as selector)
      nextEl: `.swiper-button-next.${buttonNext}`,
      prevEl: `.swiper-button-prev.${buttonPrev}`,
    };
  }

  if (typeof controls === 'object') {
    navigation = controls;
  }

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
        type: paginationType,
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
  }), [
    autoPlay,
    additionalModules,
    children.length,
    classNames.bulletActiveClass,
    classNames.bulletClass,
    classNames.container,
    disabled,
    indicators,
    interval,
    navigation,
    paginationType,
    showPagination,
    handleSlideChange,
    swiperProps,
  ]);

  return (
    <div className={cls(container, className, 'common__swiper')} aria-hidden={ariaHidden}>
      <OriginalSwiper
        {...internalProps}
        {...swiperProps}
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
  /**
   * Maximum number of bullets to show in pagination. If the number of children is greater than
   * this number, bullet pagination will be replaced with fraction (numeric) pagination.
   */
  maxIndicators: PropTypes.number,
  /**
   * Callback invoked when the Swiper slide changes.
   * Invoked with the index of the new slide and the Swiper instance.
   */
  onSlideChange: PropTypes.func,
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
  maxIndicators: null,
  disabled: false,
  onSlideChange: null,
};

export default Swiper;
