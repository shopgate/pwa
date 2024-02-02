import React from 'react';
import PropTypes from 'prop-types';
import BackInStockButton from '@shopgate/pwa-ui-shared/BackInStockButton';
import { AVAILABILITY_STATE_OK } from '@shopgate/pwa-common-commerce/product';
import isEqual from 'lodash/isEqual';
import connect from './connector';

/**
 * The BackInStockRow component.
 * @param {Object} props The component props.
 * @param {boolean} props.isBackinStockEnabled Whether the back in stock feature is enabled
 * @param {Array} props.productVariants The product variants
 * @param {Object} props.availability The product availability
 * @param {Object} props.subscription The subscription
 * @param {Object} props.characteristics The variant characteristics
 * @param {Function} props.grantPushPermissions Request / Set push permission
 * @return {JSX}
 */
const BackInStockRow = ({
  availability,
  addBackInStoreSubscription,
  productVariants,
  characteristics,
  isBackinStockEnabled,
  grantPushPermissions,
  subscription,
}) => {
  const foundVariant = productVariants?.products.find(product =>
    isEqual(product.characteristics, characteristics));

  if (availability?.state === AVAILABILITY_STATE_OK ||
    availability === null || !foundVariant || !isBackinStockEnabled) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'end',
    }}
    >
      <BackInStockButton
        subscription={subscription}
        onClick={async (e) => {
          e.stopPropagation();
          const allowed = await grantPushPermissions();
          if (allowed) {
            addBackInStoreSubscription({ productCode: foundVariant.id });
          }
        }}
      />
    </div>);
};

BackInStockRow.propTypes = {
  addBackInStoreSubscription: PropTypes.func.isRequired,
  grantPushPermissions: PropTypes.func.isRequired,
  isBackinStockEnabled: PropTypes.bool.isRequired,
  availability: PropTypes.shape(),
  characteristics: PropTypes.shape(),
  productVariants: PropTypes.shape(),
  subscription: PropTypes.shape(),
};

BackInStockRow.defaultProps = {
  availability: null,
  productVariants: {},
  characteristics: {},
  subscription: null,
};

export default connect(BackInStockRow);
