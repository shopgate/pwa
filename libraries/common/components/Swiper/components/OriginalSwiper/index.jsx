import React, { forwardRef } from 'react';
import { Swiper } from 'swiper/swiper-react';

/**
 * @typedef {import('swiper/react').SwiperProps} SwiperProps
 */

/**
 * @typedef {import('swiper/react').SwiperRef} SwiperRef
 */

/**
 * Extracted usage of the original Swiper component to a separate file to get type hints inside
 * the index.jsx file.
 */
const OriginalSwiper = forwardRef(
  /**
   * @param {SwiperProps} props The component props.
   * @param {SwiperRef} ref The ref to the Swiper instance.
   * @returns {React.Node}
   */
  (props, ref) => <Swiper ref={ref} {...props} />
);

export default OriginalSwiper;
