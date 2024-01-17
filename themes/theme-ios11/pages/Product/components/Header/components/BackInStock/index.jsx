import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/product/constants/Portals';
import BackInStockButton from '@shopgate/pwa-ui-shared/BackInStockButton';
import { AVAILABILITY_STATE_OK } from '@shopgate/pwa-common-commerce/product';
import connect from './connector';

/**
 * The BackInStock component.
 * @param {Object} props The component props.
 * @param {Object} props.isOnBackInStockList Whether the product is on the back in stock list
 * @param {string} props.productId The product id
 * @param {string} props.productType The product type
 * @param {Object} props.stock The product stock info
 * @param {Function} props.addBackInStoreSubscription Add product to back in stock list
 * @return {JSX}
 */
const BackInStock = ({
  isOnBackInStockList,
  productType,
  stock,
  productId,
  addBackInStoreSubscription,
}) => {
  const showBackInStock = productType !== 'parent' && productType !== null && stock?.state !== AVAILABILITY_STATE_OK;

  return (
    <Fragment>
      <Portal name={portals.PRODUCT_BACK_IN_STOCK_BEFORE} />
      <Portal name={portals.PRODUCT_BACK_IN_STOCK}>
        {showBackInStock &&
          <BackInStockButton
            isSubscribed={isOnBackInStockList}
            onClick={() => { addBackInStoreSubscription({ productCode: productId }); }}
          />}
      </Portal>
      <Portal name={portals.PRODUCT_BACK_IN_STOCK_AFTER} />
    </Fragment>
  );
};

BackInStock.propTypes = {
  addBackInStoreSubscription: PropTypes.func.isRequired,
  isOnBackInStockList: PropTypes.bool.isRequired,
  productId: PropTypes.string.isRequired,
  productType: PropTypes.string,
  stock: PropTypes.shape(),
};

BackInStock.defaultProps = {
  productType: null,
  stock: null,
};

export default connect(BackInStock);
