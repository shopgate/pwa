// @flow
import * as React from 'react';
import { Availability } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { AVAILABILITY_STATE_ALERT } from '@shopgate/engage/product';
import { DIRECT_SHIP, IN_STORE_PICKUP } from '../../constants';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { container } from './FulfillmentSelectorImpossibleError.style';

/**
 * Renders the "not possible" error for each item.
 * @returns {JSX}
 */
export function FulfillmentSelectorImpossibleError() {
  const { selection } = useFulfillmentSelectorState();
  const isDirectShip = React.useMemo(() => selection === DIRECT_SHIP, [selection]);
  const isInStorePickup = React.useMemo(() => selection === IN_STORE_PICKUP, [selection]);

  if (!isDirectShip && !isInStorePickup) {
    return null;
  }

  const label = isDirectShip
    ? i18n.text('locations.fulfillment.error.direct_ship')
    : i18n.text('locations.fulfillment.error.reserve');

  return (
    <Availability
      className={container}
      showWhenAvailable
      text={label}
      state={AVAILABILITY_STATE_ALERT}
    />
  );
}
