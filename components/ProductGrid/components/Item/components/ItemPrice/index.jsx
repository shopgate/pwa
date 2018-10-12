import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_ITEM_PRICE,
  PRODUCT_ITEM_PRICE_AFTER,
  PRODUCT_ITEM_PRICE_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import ProductGridPrice from 'Components/ProductGridPrice';

/**
 * The item price component.
 */
class ItemPrice extends PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    display: PropTypes.shape(),
    price: PropTypes.shape(),
  };

  static defaultProps = {
    display: null,
    price: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { display, productId, price } = this.props;

    if (display && !display.price) {
      return null;
    }

    const props = { productId };

    return (
      <Fragment>
        <Portal name={PRODUCT_ITEM_PRICE_BEFORE} props={props} />
        <Portal name={PRODUCT_ITEM_PRICE} props={props}>
          <ProductGridPrice price={price} />
        </Portal>
        <Portal name={PRODUCT_ITEM_PRICE_AFTER} props={props} />
      </Fragment>
    );
  }
}

export default ItemPrice;
