import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { PRODUCT_ITEM_NAME } from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { ProductName } from '@shopgate/engage/product';
import styles from './style';

/**
 * The item name component.
 */
class ItemName extends PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    display: PropTypes.shape(),
    name: PropTypes.string,
  };

  static defaultProps = {
    display: null,
    name: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { display, productId, name } = this.props;

    if (display && !display.name) {
      return null;
    }

    const props = { productId };

    return (
      <ProductName
        name={name}
        className={styles}
        portalName={PRODUCT_ITEM_NAME}
        portalProps={props}
        testId={`Productname: ${name}`}
      />
    );
  }
}

export default ItemName;
