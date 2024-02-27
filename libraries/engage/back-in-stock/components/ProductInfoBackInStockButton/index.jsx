import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  PRODUCT_BACK_IN_STOCK,
} from '@shopgate/engage/back-in-stock';
import { BackInStockButton } from '@shopgate/engage/back-in-stock/components';
import { withCurrentProduct } from '@shopgate/engage/core';
import connect from './connector';

/**
 * The ProductInfoBackInStockButton component.
 * @param {Object} props The component props.
 * @param {boolean} props.isBackInStockEnabled Whether the back in stock feature is enabled
 * @param {string} props.productId The product id
 * @param {string} props.variantId The variant id
 * @param {Object} props.product The product
 * @param {Function} props.addBackInStockSubscription Add product to back in stock list
 * @param {Function} props.grantPushPermissions Request / Set push permission
 * @param {Object} props.subscription The subscription
 * @return {JSX}
 */
const ProductInfoBackInStockButton = ({
  productId,
  variantId,
  addBackInStockSubscription,
  isBackInStockEnabled,
  grantPushPermissions,
  subscription,
  product,
}) => {
  const productIsAVariant = product?.type !== 'parent' &&
    product?.type !== null;

  const productIsNotAvailable = product?.stock?.quantity === 0 &&
    product?.stock?.ignoreQuantity === false;

  const showBackInStockButton = productIsAVariant && productIsNotAvailable && isBackInStockEnabled;

  return (
    <Fragment>
      <SurroundPortals
        portalName={PRODUCT_BACK_IN_STOCK}
        portalProps={{ showBackInStockButton }}
      >
        {showBackInStockButton &&
          <BackInStockButton
            subscription={subscription}
            isLinkToBackInStockEnabled
            onClick={async () => {
              const allowed = await grantPushPermissions();
              if (allowed) {
                addBackInStockSubscription({ productId: variantId ?? productId });
              }
            }}
          />}
      </SurroundPortals>
    </Fragment>
  );
};

ProductInfoBackInStockButton.propTypes = {
  addBackInStockSubscription: PropTypes.func.isRequired,
  grantPushPermissions: PropTypes.func.isRequired,
  isBackInStockEnabled: PropTypes.bool.isRequired,
  productId: PropTypes.string.isRequired,
  product: PropTypes.shape({
    type: PropTypes.string,
    stock: PropTypes.shape({
      ignoreQuantity: PropTypes.bool,
      quantity: PropTypes.number,
    }),
  }),
  subscription: PropTypes.shape({}),
  variantId: PropTypes.string,
};

ProductInfoBackInStockButton.defaultProps = {
  subscription: null,
  variantId: null,
  product: null,
};

export default withCurrentProduct(connect(ProductInfoBackInStockButton));
