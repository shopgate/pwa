// @flow
import React from 'react';
import { i18n } from '../../../core';
import { Availability } from '../../../product';
import { DIRECT_SHIP_LABEL, DIRECT_SHIP } from '../../constants';
import { itemRow, itemColumn } from './FulfillmentSelectorItem.style';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';

/**
 * Renders the direct ship item label.
 * @returns {JSX}
 */
export function FulfillmentSelectorDirectShip() {
  const { productId } = useFulfillmentSelectorState();

  return (
    <div className={itemRow}>
      <div className={itemColumn}>
        {i18n.text(DIRECT_SHIP_LABEL)}
      </div>
      <div className={itemColumn}>
        <Availability productId={productId} fulfillmentSelection={DIRECT_SHIP} />
      </div>
    </div>
  );
}
