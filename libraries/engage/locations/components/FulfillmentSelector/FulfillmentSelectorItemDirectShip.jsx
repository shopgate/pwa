// @flow
import React from 'react';
import { i18n } from '@shopgate/engage/core';
import { Availability } from '@shopgate/engage/components';
import {
  AVAILABILITY_STATE_ALERT,
  Availability as ProductAvailability,
} from '@shopgate/engage/product';
import connect from './FulfillmentSelectorItemDirectShip.connector';
import { DIRECT_SHIP } from '../../constants';
import { radioItemLabel } from './FulfillmentSelector.style';
import { type OwnProps, type StateProps } from './FulfillmentSelectorItemDirectShip.types';
import { container } from './FulfillmentSelectorItemDirectShip.style';

type Props = OwnProps & StateProps;

/**
 * Renders the direct ship item of the fulfillment selector.
 * @param {Object} props The component props.
 * @property {boolean} props.selected Whether the item is selected.
 * @property {boolean} props.isOrderable Whether the product is orderable.
 * @property {string} props.productId The product ID.
 * @returns {JSX}
 */
function FulfillmentSelectorItemDirectShip({ selected, isOrderable, productId }: Props) {
  if (selected && !isOrderable) {
    return (
      <Availability
        className={radioItemLabel}
        showWhenAvailable
        text={i18n.text('locations.fulfillment.error.direct_ship')}
        state={AVAILABILITY_STATE_ALERT}
      />
    );
  }

  return (
    <div className={container}>
      <ProductAvailability productId={productId} fulfillmentSelection={DIRECT_SHIP} />
    </div>
  );
}

export default connect(FulfillmentSelectorItemDirectShip);
