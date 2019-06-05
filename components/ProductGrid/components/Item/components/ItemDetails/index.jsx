import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MapPriceHint, OrderQuantityHint } from '@shopgate/engage/product';
import ItemName from '../ItemName';
import ItemPrice from '../ItemPrice';
import * as styles from './style';

/**
 * The item details component.
 */
class ItemDetails extends PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    display: PropTypes.shape(),
    name: PropTypes.string,
    price: PropTypes.shape(),
  };

  static defaultProps = {
    display: null,
    name: null,
    price: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const {
      display, productId, name, price,
    } = this.props;

    if (display && !display.name && !display.price && !display.reviews) {
      return null;
    }

    return (
      <div className={styles.details} tabIndex={-1} role="button">
        <ItemName display={display} productId={productId} name={name} />

        {/* This feature is currently in BETA testing.
          It should only be used for approved BETA Client Projects */}
        <MapPriceHint productId={productId} />

        {/* This feature is currently in BETA testing.
          It should only be used for approved BETA Client Projects */}
        <OrderQuantityHint productId={productId} />

        <ItemPrice display={display} productId={productId} price={price} />
      </div>
    );
  }
}

export default ItemDetails;
