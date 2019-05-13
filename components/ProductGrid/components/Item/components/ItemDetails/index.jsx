import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MapPriceHint from '@shopgate/pwa-ui-shared/MapPriceHint';
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
      <div className={styles.details}>
        <ItemName display={display} productId={productId} name={name} />
        <MapPriceHint productId={productId} location="plp" />
        <ItemPrice display={display} productId={productId} price={price} />
      </div>
    );
  }
}

export default ItemDetails;
