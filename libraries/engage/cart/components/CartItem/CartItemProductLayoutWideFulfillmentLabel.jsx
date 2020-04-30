import React from 'react';
import {
  type LocationAware,
  BOPIS,
  ROPIS,
} from '@shopgate/engage/locations';
import { i18n } from '@shopgate/engage/core';
import { label } from './CartItemProductLayoutWideFulfillmentLabel.style';

type Props = LocationAware;

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CartItemProductLayoutWideFulfillmentLabel = ({ fulfillmentMethod }: Props) => {
  let suffix = 'direct_ship';

  if (fulfillmentMethod === BOPIS) {
    suffix = 'bopis';
  } else if (fulfillmentMethod === ROPIS) {
    suffix = 'ropis';
  }

  return (
    <div className={label}>
      {i18n.text(`locations.method.${suffix}`)}
    </div>
  );
};

export { CartItemProductLayoutWideFulfillmentLabel };
