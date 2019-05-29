import 'react-id-swiper/src/styles/css/swiper.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import IDSwiper from 'react-id-swiper';
import { Pagination, Navigation, Autoplay, Zoom } from 'swiper/dist/js/swiper.esm';
import SwiperItem from './components/SwiperItem';
import { container, innerContainer, zoomFix, bullet, bulletActive, buttonNext, buttonPrev } from './styles';

/**
 * The basic swiper component.
 * @param {Object} props The component props.
 * @returns {React.Node}
 */
function Swiper(props) {
  const {
    autoPlay,
    interval,
    children,
    controls,
    className,
    classNames,
    initialSlide,
    rebuildOnUpdate,
    slidesPerView,
    maxIndicators,
    indicators,
    loop,
    snapItems,
    onSlideChange,
    zoom,
    disabled,
  } = props;

  const [swiper, setSwiper] = useState(null);

  /**
   * Updates the swiper instance reference.
   * @param {Object} instance A Swiper instance.
   */
  const updateSwiper = (instance) => {
    // Only update the instance, when it differs from the current one.
    if (instance !== null && instance !== swiper) {
      setSwiper(instance);

      instance.on('slideChange', () => onSlideChange(instance.realIndex));
      instance.on('transitionEnd', () => {
        // In loop mode the Swiper duplicates elements, which are not in the virtual DOM
        if (loop) {
          const autoplayRunning = instance.autoplay.running;
          const previousIndex = instance.activeIndex;

          // Skip duplicated elements
          if (instance.activeIndex < 1) {
            instance.slideToLoop(children.length - 1, 0);
          } else if (instance.activeIndex > children.length) {
            instance.slideToLoop(0, 0);
          }

          if (autoplayRunning && instance.activeIndex !== previousIndex) {
            // Restart the autoplay when it was active before the auto slide.
            instance.autoplay.start();
          }
        }
      });
    }
  };

  useEffect(() => {
    if (swiper !== null) {
      if (loop) {
        // Recreate the loop on prop updates to avoid duplicated slides from the last slide set.
        swiper.loopCreate();
      }

      swiper.update();
    }
  }, [children]);

  const useFraction = (maxIndicators && maxIndicators < children.length);
  const paginationType = useFraction ? 'fraction' : 'bullets';
  const el = (indicators && children.length > 1) ? '.swiper-pagination' : null;

  let navigation;

  if (typeof controls === 'boolean' && controls === false) {
    navigation = {
      nextEl: null,
      prevEl: null,
    };
  }
  if (typeof controls === 'boolean' && controls === true) {
    navigation = {
      // Important to use dot notation (swiper internally use it as selector)
      nextEl: `.swiper-button-next.${buttonNext}`,
      prevEl: `.swiper-button-prev.${buttonPrev}`,
    };
  }

  if (typeof controls === 'object') {
    navigation = controls;
  }

  const params = {
    modules: [Pagination, Navigation, Autoplay, Zoom],
    containerClass: cls(innerContainer, classNames.container, { [zoomFix]: zoom }),
    autoplay: autoPlay ? {
      delay: interval,
    } : false,
    initialSlide,
    navigation,
    pagination: {
      el,
      type: paginationType,
      bulletClass: classNames.bulletClass || bullet,
      bulletActiveClass: classNames.bulletActiveClass || bulletActive,
    },
    loop,
    rebuildOnUpdate,
    slidesPerView,
    freeMode: !snapItems,
    getSwiper: updateSwiper,
    zoom,
    allowSlidePrev: !disabled,
    allowSlideNext: !disabled,
  };

  return (
    <div className={cls(container, className)}>
      <IDSwiper {...params}>
        {children}
      </IDSwiper>
    </div>
  );
}

Swiper.Item = SwiperItem;

Swiper.propTypes = {
  children: PropTypes.node.isRequired,
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
  controls: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape(),
  ]),
  disabled: PropTypes.bool,
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
  zoom: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape(),
  ]),
};

Swiper.defaultProps = {
  autoPlay: false,
  className: null,
  classNames: {},
  controls: false,
  indicators: false,
  initialSlide: 0,
  interval: 3000,
  loop: false,
  maxIndicators: null,
  onSlideChange: () => { },
  rebuildOnUpdate: false,
  slidesPerView: 1,
  snapItems: true,
  zoom: false,
  disabled: false,
};

export default Swiper;
