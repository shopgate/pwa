import React from 'react';

import { Accordion } from '@shopgate/engage/components';
import { type OptionalLocationAware, StoreAddress, StoreOpeningHours } from '@shopgate/engage/locations';
import { CartItemCardReservationLabel } from './CartItemCardReservationLabel';
import {
  accordionToggle, accordionContent, locationAddress, locationHours,
} from './CartItemCard.style';

type Props = OptionalLocationAware & {
  openWithChevron?: boolean,
  operationHours?: Object,
};

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItemCardReservationAccordion = ({
  openWithChevron,
  location,
  fulfillmentMethod,
  operationHours,
}: Props) => (
  <Accordion
    className={accordionToggle}
    openWithChevron={openWithChevron}
    renderLabel={() =>
      <CartItemCardReservationLabel
        location={location}
        fulfillmentMethod={fulfillmentMethod}
      />
    }
  >
    <div className={accordionContent}>
      <div className={locationAddress}>
        <StoreAddress address={location.address} pure />
      </div>
      {operationHours && (
        <div className={locationHours}>
          <StoreOpeningHours hours={operationHours} pure />
        </div>
      )}
    </div>
  </Accordion>
);

CartItemCardReservationAccordion.defaultProps = {
  openWithChevron: false,
};

export { CartItemCardReservationAccordion };
