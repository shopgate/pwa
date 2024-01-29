import React from 'react';
import PropTypes from 'prop-types';
import BackInStockButton from '@shopgate/pwa-ui-shared/BackInStockButton';
import { AVAILABILITY_STATE_OK } from '@shopgate/pwa-common-commerce/product';
import isEqual from 'lodash/isEqual';
import connect from './connector';

/**
 * The BackInStockRow component.
 * @param {Object} props The component props.
 * @param {Object} props.isOnBackInStockList Whether the product is on the back in stock list
 * @param {Array} props.productVariants The product variants
 * @param {Object} props.availability The product availability
 * @param {Object} props.characteristics The variant characteristics
 * @return {JSX}
 */
const BackInStockRow = ({
  isOnBackInStockList,
  availability,
  addBackInStoreSubscription,
  productVariants,
  characteristics,
}) => {
  const foundVariant = productVariants?.products.find(product =>
    isEqual(product.characteristics, characteristics));

  if (availability?.state === AVAILABILITY_STATE_OK ||
    availability === null || !foundVariant) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'end',
    }}
    >
      <BackInStockButton
        isSubscribed={isOnBackInStockList}
        onClick={(e) => {
          e.stopPropagation();
          addBackInStoreSubscription({ productCode: foundVariant.id });
        }}
      />
    </div>);
};

BackInStockRow.propTypes = {
  addBackInStoreSubscription: PropTypes.func.isRequired,
  isOnBackInStockList: PropTypes.bool.isRequired,
  availability: PropTypes.shape(),
  characteristics: PropTypes.shape(),
  productVariants: PropTypes.shape(),
};

BackInStockRow.defaultProps = {
  availability: null,
  productVariants: {},
  characteristics: {},
};

export default connect(BackInStockRow);
