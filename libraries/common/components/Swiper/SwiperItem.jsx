import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { item } from './SwiperItem.styles';

/**
 * The basic swiper item component.
 * @param {Object} props The component props.
 * @returns {React.Node}
 */
function SwiperItem({ children, className }) {
  return (
    <div className={classNames(item, className)} data-test-id="Slider">
      {children}
    </div>
  );
}

SwiperItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

SwiperItem.defaultProps = {
  className: null,
};

export default SwiperItem;
