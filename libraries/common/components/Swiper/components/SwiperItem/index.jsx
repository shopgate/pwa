import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SwiperSlide } from 'swiper/react';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(() => ({
  item: {
    position: 'relative',
    height: '100%',
  },
}));

/**
 * @typedef {import('swiper/react').SwiperSlideProps} SwiperSlideProps
 */

/**
 * The basic swiper item component.
 * @param {SwiperSlideProps} props The component props.
 * @returns {React.Node}
 */
function SwiperItem({ children, className, ...slideProps }) {
  const { classes } = useStyles();

  return (
    <SwiperSlide {...slideProps} className={classNames(classes.item, className)} data-test-id="Slider">
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
