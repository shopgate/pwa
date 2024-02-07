import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import BackInStockButton from '@shopgate/pwa-ui-shared/BackInStockButton';
import { AVAILABILITY_STATE_OK } from '@shopgate/pwa-common-commerce/product';
import {
  PRODUCT_BACK_IN_STOCK,
  PRODUCT_BACK_IN_STOCK_AFTER,
  PRODUCT_BACK_IN_STOCK_BEFORE,
} from '@shopgate/engage/back-in-stock/constants/Portals';
import connect from './connector';

/**
 * The BackInStock component.
 * @param {Object} props The component props.
 * @param {boolean} props.isBackinStockEnabled Whether the back in stock feature is enabled
 * @param {string} props.productId The product id
 * @param {string} props.productType The product type
 * @param {Object} props.stock The product stock info
 * @param {Function} props.addBackInStockSubscription Add product to back in stock list
 * @param {Function} props.grantPushPermissions Request / Set push permission
 * @param {Object} props.subscription The subscription
 * @return {JSX}
 */
const BackInStock = ({
  productType,
  stock,
  productId,
  addBackInStockSubscription,
  isBackinStockEnabled,
  grantPushPermissions,
  subscription,
}) => {
  const showBackInStock = productType !== 'parent' &&
    productType !== null &&
    stock?.state !== AVAILABILITY_STATE_OK &&
    isBackinStockEnabled;

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
                addBackInStockSubscription({ productCode: productId });
              }
            }}
          />}
      </Portal>
      <Portal name={PRODUCT_BACK_IN_STOCK_AFTER} />
    </Fragment>
  );
};

BackInStock.propTypes = {
  addBackInStockSubscription: PropTypes.func.isRequired,
  grantPushPermissions: PropTypes.func.isRequired,
  isBackinStockEnabled: PropTypes.bool.isRequired,
  productId: PropTypes.string.isRequired,
  productType: PropTypes.string,
  stock: PropTypes.shape(),
  subscription: PropTypes.shape(),
};

BackInStock.defaultProps = {
  subscription: null,
  productType: null,
  stock: null,
};

export default connect(BackInStock);
