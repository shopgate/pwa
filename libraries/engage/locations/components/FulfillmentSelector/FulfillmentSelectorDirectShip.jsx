// @flow
import React from 'react';
import { Grid } from '@shopgate/engage/components';
import { i18n } from '../../../core';
import { Availability } from '../../../product';
import { DIRECT_SHIP_LABEL, DIRECT_SHIP } from '../../constants';
import { itemRow, itemColumn } from './FulfillmentSelectorItem.style';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { FulfillmentSelectorImpossibleError } from './FulfillmentSelectorImpossibleError';

/**
 * Renders the direct ship item label.
 * @returns {JSX}
 */
export function FulfillmentSelectorDirectShip() {
  const { productId, selection, isOrderable } = useFulfillmentSelectorState();
  const selected = (selection === DIRECT_SHIP);

  return (
    <Grid className={itemRow} component="div">
      <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
        {i18n.text(DIRECT_SHIP_LABEL)}
      </Grid.Item>
      <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
        {isOrderable && (
          <Availability productId={productId} fulfillmentSelection={DIRECT_SHIP} />
        )}
        {(selected && !isOrderable) && (
          <FulfillmentSelectorImpossibleError />
        )}
      </Grid.Item>
    </Grid>
  );
}
