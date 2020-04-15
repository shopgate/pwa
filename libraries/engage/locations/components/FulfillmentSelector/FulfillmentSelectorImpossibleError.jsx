// @flow
import React, { useMemo, useContext } from 'react';
import { Availability } from '@shopgate/engage/components';
import { i18n, LoadingContext, useRoute } from '@shopgate/engage/core';
import { AVAILABILITY_STATE_ALERT } from '@shopgate/engage/product';
import { DIRECT_SHIP, ROPIS, BOPIS } from '../../constants';
import { useFulfillmentSelectorState } from './FulfillmentSelector.hooks';
import { container } from './FulfillmentSelectorImpossibleError.style';

/**
 * Renders the "not possible" error for each item.
 * @returns {JSX}
 */
export function FulfillmentSelectorImpossibleError() {
  const { selection } = useFulfillmentSelectorState();
  const { pathname } = useRoute();
  const { isLoading } = useContext(LoadingContext);
  const isDirectShip = useMemo(() => selection === DIRECT_SHIP, [selection]);
  const isInStorePickup = useMemo(() => [ROPIS, BOPIS].includes(selection), [selection]);

  if ((!isDirectShip && !isInStorePickup) || isLoading(pathname)) {
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
