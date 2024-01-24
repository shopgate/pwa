import React from 'react';
import { Button } from '@shopgate/engage/components';
import PropTypes from 'prop-types';
import connect from './FulfillmentSelectorBackInStock.connector';

/**
 * TODO
 * @param {Function} addBackInStoreSubscription Action to add product to Back in Stock list
 * @param {boolean} isOnBackInStockList If product is on Back in Stock list
 * @param {string} productType ProductType
 * @returns {JSX}
 */
function FulfillmentSelectorBackInStock({
  addBackInStoreSubscription,
  isOnBackInStockList,
  productType,
  productId,
}) {
  // todo based on productType we can show/hide or enable/disable addBackinStock
  return (
    <div style={{ backgroundColor: 'red', padding: '8px' }}>
      <div>
          Back In Stock Reminder Mock
      </div>

      <div>
        Product is
        {' '}
        {isOnBackInStockList ? '' : 'not'}
        {' '}
on list
      </div>
      <Button
        disabled={isOnBackInStockList || productType === 'parent'}
        onClick={() => { addBackInStoreSubscription({ productCode: productId }); }}
      >
        Add Reminder
      </Button>
    </div>
  );
}

FulfillmentSelectorBackInStock.propTypes = {
  addBackInStoreSubscription: PropTypes.func.isRequired,
  isOnBackInStockList: PropTypes.bool.isRequired,
  productId: PropTypes.string.isRequired,
  productType: PropTypes.string.isRequired,
};

export default connect(FulfillmentSelectorBackInStock);
