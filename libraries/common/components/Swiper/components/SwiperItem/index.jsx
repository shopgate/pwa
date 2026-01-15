import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SwiperSlide } from 'swiper/react';
import { item } from './styles';

/**
 * @typedef {import('swiper/react').SwiperSlideProps} SwiperSlideProps
 */

/**
 * The basic swiper item component.
 * @param {SwiperSlideProps} props The component props.
 * @returns {React.Node}
 */
function SwiperItem({ children, className, ...slideProps }) {
  return (
    <SwiperSlide {...slideProps} className={classNames(item, className)} data-test-id="Slider">
      {children}
    </SwiperSlide>
  );
}

SwiperItem.displayName = 'SwiperSlide';

SwiperItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

SwiperItem.defaultProps = {
  className: null,
};

export default SwiperItem;
