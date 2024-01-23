import React from 'react';
import { Button } from '@shopgate/engage/components';
import PropTypes from 'prop-types';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import connect from './FulfillmentSelectorBackInStock.connector';

/**
 */
function FulfillmentSelectorBackInStock({
  addBackInStoreSubscription,
  productId: code,
  isOnBackInStockList,
}) {
  const { productId, ...rest } = useFulfillmentSelectorState();

  console.log('sasa: FulfillmentSelectorBackInStock:42:rest:', rest);

  return (
    <div>
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
  productId: PropTypes.string.isRequired,
};

export default connect(FulfillmentSelectorBackInStock);
