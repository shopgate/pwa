import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@shopgate/engage/components';
import { StoreAddress, StoreOpeningHours } from '@shopgate/engage/locations';
import { CartItemCardReservationLabel } from './CartItemCardReservationLabel';
import {
  accordionToggle, accordionContent, locationAddress, locationHours,
} from './CartItemCard.style';

// eslint-disable-next-line max-len
/** @typedef {import('@shopgate/engage/locations/locations.types').OptionalLocationAware} OptionalLocationAware */

/**
 * @param {OptionalLocationAware} props The component props.
 * @returns {JSX.Element}
 */
const CartItemCardReservationAccordion = ({
  openWithChevron,
  location,
  fulfillmentMethod,
  operationHours,
}) => (
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

CartItemCardReservationAccordion.propTypes = {
  fulfillmentMethod: PropTypes.string,
  location: PropTypes.shape({
    operationHours: PropTypes.shape(),
    address: PropTypes.shape({
      phoneNumber: PropTypes.string,
    }),
  }),
  openWithChevron: PropTypes.bool,
  operationHours: PropTypes.shape(),
};

CartItemCardReservationAccordion.defaultProps = {
  openWithChevron: false,
  location: null,
  fulfillmentMethod: null,
  operationHours: null,
};

export { CartItemCardReservationAccordion };
