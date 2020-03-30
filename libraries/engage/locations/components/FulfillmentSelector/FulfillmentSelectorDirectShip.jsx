// @flow
import * as React from 'react';
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
  const {
    productId, selection, isOrderable, disabled,
  } = useFulfillmentSelectorState();
  const selected = (selection === DIRECT_SHIP);

  if (selected && !isOrderable) {
    return (
      <React.Fragment>
        <div>
          {i18n.text(DIRECT_SHIP_LABEL)}
        </div>
        <FulfillmentSelectorImpossibleError />
      </React.Fragment>
    );
  }

  return (
    <Grid className={itemRow} component="div">
      <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
        {i18n.text(DIRECT_SHIP_LABEL)}
      </Grid.Item>
      <Grid.Item className={itemColumn} grow={1} shrink={0} component="div">
        {!disabled && isOrderable && (
          <Availability productId={productId} fulfillmentSelection={DIRECT_SHIP} />
        )}
      </Grid.Item>
    </Grid>
  );
}
