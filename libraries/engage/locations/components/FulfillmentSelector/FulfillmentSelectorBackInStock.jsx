import React from 'react';
import { Button } from '@shopgate/engage/components';
import PropTypes from 'prop-types';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import connect from './FulfillmentSelectorBackInStock.connector';

/**
 * TODO
 * @param {Function} addBackInStoreSubscription Action to add product to Back in Stock list
 * @param {boolean} isOnBackInStockList If product is on Back in Stock list
 * @returns {JSX}
 */
function FulfillmentSelectorBackInStock({
  addBackInStoreSubscription,
  isOnBackInStockList,
}) {
  const { productId, ...rest } = useFulfillmentSelectorState();

  console.log('sasa: FulfillmentSelectorBackInStock:42:rest:', rest);

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
        disabled={isOnBackInStockList}
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
};

export default connect(FulfillmentSelectorBackInStock);
