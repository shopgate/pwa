import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from '@shopgate/pwa-common/components';
import { Theme } from '@shopgate/pwa-common/context';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function ProductSlider(props) {
  const {
    autoplay,
    className,
    delay,
    productIds,
    slidesPerView,
    snap,
  } = props;

  return (
    <Theme>
      {({ ProductCard }) => {
        const Item = props.item || ProductCard;
        return (
          <Slider
            autoPlay={autoplay}
            className={className}
            controls={false}
            indicators={false}
            interval={delay}
            loop={false}
            freeMode={!snap}
            slidesPerView={slidesPerView}
          >
            {productIds.map(id => <Item key={id} productId={id} style={styles} />)}
          </Slider>
        );
      }}
    </Theme>
  );
}

ProductSlider.propTypes = {
  productIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  autoplay: PropTypes.bool,
  className: PropTypes.string,
  delay: PropTypes.number,
  item: PropTypes.func,
  slidesPerView: PropTypes.number,
  snap: PropTypes.bool,
};

ProductSlider.defaultProps = {
  autoplay: false,
  className: null,
  delay: 10,
  item: null,
  slidesPerView: 2.3,
  snap: false,
};

export default ProductSlider;
