import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import { AVAILABILITY_STATE_OK } from '@shopgate/engage/product';
import { BackInStockButton } from '@shopgate/engage/back-in-stock';
import {
  PRODUCT_BACK_IN_STOCK,
  PRODUCT_BACK_IN_STOCK_AFTER,
  PRODUCT_BACK_IN_STOCK_BEFORE,
} from '@shopgate/engage/back-in-stock/constants/Portals';
import { withCurrentProduct } from '@shopgate/engage/core';
import connect from './connector';

/**
 * The BackInStockButtonPortal component.
 * @param {Object} props The component props.
 * @param {boolean} props.isBackInStockEnabled Whether the back in stock feature is enabled
 * @param {string} props.productId The product id
 * @param {string} props.productType The product type
 * @param {Object} props.stock The product stock info
 * @param {Function} props.addBackInStockSubscription Add product to back in stock list
 * @param {Function} props.grantPushPermissions Request / Set push permission
 * @param {Object} props.subscription The subscription
 * @return {JSX}
 */
const BackInStockButtonPortal = ({
  productType,
  stock,
  productId,
  addBackInStockSubscription,
  isBackInStockEnabled,
  grantPushPermissions,
  subscription,
}) => {
  const showBackInStock = productType !== 'parent' &&
    productType !== null &&
    stock?.state !== AVAILABILITY_STATE_OK &&
    isBackInStockEnabled;

  return (
    <Fragment>
      <Portal name={PRODUCT_BACK_IN_STOCK_BEFORE} />
      <Portal name={PRODUCT_BACK_IN_STOCK}>
        {showBackInStock &&
          <BackInStockButton
            subscription={subscription}
            isLinkToBackInStockEnabled
            onClick={async () => {
              const allowed = await grantPushPermissions();
              if (allowed) {
                addBackInStockSubscription({ productId });
              }
            }}
          />}
      </Portal>
      <Portal name={PRODUCT_BACK_IN_STOCK_AFTER} />
    </Fragment>
  );
};

BackInStockButtonPortal.propTypes = {
  addBackInStockSubscription: PropTypes.func.isRequired,
  grantPushPermissions: PropTypes.func.isRequired,
  isBackInStockEnabled: PropTypes.bool.isRequired,
  productId: PropTypes.string.isRequired,
  productType: PropTypes.string,
  stock: PropTypes.shape(),
  subscription: PropTypes.shape(),
};

BackInStockButtonPortal.defaultProps = {
  subscription: null,
  productType: null,
  stock: null,
};

export default withCurrentProduct(connect(BackInStockButtonPortal));
