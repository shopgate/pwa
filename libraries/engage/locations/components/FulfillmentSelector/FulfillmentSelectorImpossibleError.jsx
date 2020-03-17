// @flow
import * as React from 'react';
import { Availability } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { AVAILABILITY_STATE_ALERT } from '@shopgate/engage/product';
import { DIRECT_SHIP } from '../../constants';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';

/**
 * Redners the "not possible" error for each item.
 * @returns {JSX}
 */
export function FulfillmentSelectorImpossibleError() {
  const { selection } = useFulfillmentSelectorState();
  const isDirectShip = React.useMemo(() => selection === DIRECT_SHIP, [selection]);

  if (!isDirectShip) {
    return null;
  }

  const label = i18n.text('locations.fulfillment.errro.direct_ship');

  return (
    <Availability showWhenAvailable text={label} state={AVAILABILITY_STATE_ALERT} />
  );
}
