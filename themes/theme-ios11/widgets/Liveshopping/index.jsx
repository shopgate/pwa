import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ProductListTypeProvider, ProductListEntryProvider } from '@shopgate/engage/product';
import { Swiper } from '@shopgate/pwa-common/components';
import Item from './components/Item';
import connect from './connector';
import styles from './style';

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

    if (products.length === 1) {
      return (
        <div className={styles.wrapper} data-test-id="liveShoppingWidget">
          {products.map(id => (
            <Item key={id} productId={id} />
          ))}
        </div>
      );
    }

    return (
      <div className={styles.wrapper}>
        <ProductListTypeProvider type="liveshopping" subType="widgets">
          <Swiper indicators loop={products.length > 1}>
            {products.map(id => (
              <Swiper.Item key={id}>
                <ProductListEntryProvider productId={id}>
                  <Item productId={id} />
                </ProductListEntryProvider>
              </Swiper.Item>
            ))}
          </Swiper>
        </ProductListTypeProvider>
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
