import React from 'react';
import PropTypes from 'prop-types';
import cls from 'classnames';
import IDSwiper from 'react-id-swiper';
import SwiperItem from './SwiperItem';
import { container, innerContainer, bullet, bulletActive } from './styles';

/**
 * The basic swiper component.
 */
class Swiper extends React.PureComponent {
  static Item = SwiperItem;

  static propTypes = {
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
    }),
    controls: PropTypes.bool,
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
  };

  static defaultProps = {
    autoPlay: false,
    className: null,
    classNames: {},
    controls: false,
    disabled: false,
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
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.slider = null;
  }

  /**
   * Whether the slider should have navigation.
   * @returns {Object|undefined}
   */
  get navigation() {
    const { controls } = this.props;

    if (!controls) {
      return {
        nextEl: null,
        prevEl: null,
      };
    }

    return undefined;
  }

  /**
   * Whether the slider run in auto play mode.
   * @returns {Object|undefined}
   */
  get autoplay() {
    const { autoPlay, interval } = this.props;

    if (!autoPlay) {
      return false;
    }

    return {
      delay: interval,
    };
  }

  /**
   * @returns {Object}
   */
  get pagination() {
    const { children, maxIndicators, indicators } = this.props;

    const useFraction = (maxIndicators && maxIndicators < children.length);
    const paginationType = useFraction ? 'fraction' : 'bullets';
    const pagination = (indicators && children.length > 1) ? '.swiper-pagination' : null;

    return {
      el: pagination,
      type: paginationType,
      bulletClass: bullet,
      bulletActiveClass: bulletActive,
    };
  }

  /**
   * @returns {React.Node}
   */
  render() {
    const {
      children,
      className,
      classNames,
      initialSlide,
      slidesPerView,
      loop,
    } = this.props;

    console.warn('classNames', classNames);

    return (
      <div className={cls(container, className)}>
        <IDSwiper
          containerClass={cls(innerContainer, classNames.container)}
          autoplay={this.autoplay}
          activeSlideKey={`${initialSlide}`}
          navigation={this.navigation}
          pagination={this.pagination}
          loop={loop}
          slidesPerView={slidesPerView}
        >
          {children}
        </IDSwiper>
      </div>
    );
  }
}

export default Swiper;
