import React from 'react';
import { Swiper } from 'swiper/swiper-react';

/**
 * @typedef {import('swiper/react').SwiperProps} SwiperProps
 */

/**
 * Extracted usage of the original Swiper component to a separate file to get type hints inside
 * the index.jsx file.
 * @param {SwiperProps} props The component props.
 * @returns {React.Node}
 */
const OriginalSwiper = props => <Swiper {...props} />;

export default OriginalSwiper;
