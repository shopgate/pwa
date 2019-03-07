import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImageSlider from '@shopgate/pwa-ui-shared/ImageSlider';
import Item from './components/Item';
import connect from './connector';
import styles from './style';

const sliderStyle = {
  indicator: {
    bullets: styles.indicators,
  },
};

/**
 * The LiveshoppingWidget component.
 */
export class LiveshoppingWidget extends Component {
  /**
   * Request the product data.
   */
  componentDidMount() {
    this.props.fetchProducts();
  }

  /**
   * @return {JSX}
   */
  render() {
    const { products } = this.props;

    if (!products.length) {
      return null;
    }

    return (
      <div className={styles.wrapper} data-test-id="liveShoppingWidget">
        <ImageSlider indicators loop classNames={sliderStyle}>
          {products.map(id => <Item key={id} productId={id} />)}
        </ImageSlider>
      </div>
    );
  }
}

LiveshoppingWidget.propTypes = {
  fetchProducts: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.string),
};

LiveshoppingWidget.defaultProps = {
  products: [],
};

export default connect(LiveshoppingWidget);
