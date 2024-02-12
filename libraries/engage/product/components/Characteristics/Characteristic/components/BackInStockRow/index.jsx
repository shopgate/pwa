import React from 'react';
import PropTypes from 'prop-types';
import { BackInStockButton } from '@shopgate/engage/back-in-stock';
import { AVAILABILITY_STATE_OK } from '@shopgate/engage/product';
import isEqual from 'lodash/isEqual';
import connect from './connector';

/**
 * The BackInStockRow component.
 * @param {Object} props The component props.
 * @param {boolean} props.isBackInStockEnabled Whether the back in stock feature is enabled
 * @param {Array} props.productVariants The product variants
 * @param {Object} props.availability The product availability
 * @param {Object} props.subscription The subscription
 * @param {Object} props.characteristics The variant characteristics
 * @param {Function} props.grantPushPermissions Request / Set push permission
 * @return {JSX}
 */
const BackInStockRow = ({
  availability,
  addBackInStockSubscription,
  productVariants,
  characteristics,
  isBackInStockEnabled,
  grantPushPermissions,
  subscription,
}) => {
  const foundVariant = productVariants?.products.find(product =>
    isEqual(product.characteristics, characteristics));

  if (availability?.state === AVAILABILITY_STATE_OK ||
    availability === null || !foundVariant || !isBackInStockEnabled) return null;

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
            addBackInStockSubscription({ productCode: foundVariant.id });
          }
        }}
      />
    </div>);
};

BackInStockRow.propTypes = {
  addBackInStockSubscription: PropTypes.func.isRequired,
  grantPushPermissions: PropTypes.func.isRequired,
  isBackInStockEnabled: PropTypes.bool.isRequired,
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
