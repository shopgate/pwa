import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@shopgate/engage/components';
import { StoreAddress, StoreOpeningHours } from '@shopgate/engage/locations';
import { makeStyles } from '@shopgate/engage/styles';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';
import { CartItemCardReservationLabel } from './CartItemCardReservationLabel';

const useStyles = makeStyles()({
  accordionContent: {
    paddingLeft: themeVariables.gap.xbig * 1.25,
  },
  accordionToggle: {
    padding: `${themeVariables.gap.big * 1.25}px ${themeVariables.gap.big}px`,
  },
  locationAddress: {
    fontSize: '0.85rem',
    color: 'var(--color-text-low-emphasis)',
  },
  locationHours: {
    paddingTop: themeVariables.gap.big,
    fontSize: '0.85rem',
  },
});

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
}) => {
  const { classes } = useStyles();

  return (
    <Accordion
      className={classes.accordionToggle}
      openWithChevron={openWithChevron}
      renderLabel={() =>
        <CartItemCardReservationLabel
          location={location}
          fulfillmentMethod={fulfillmentMethod}
        />}
    >
      <div className={classes.accordionContent}>
        <div className={classes.locationAddress}>
          <StoreAddress address={location.address} pure />
        </div>
        {operationHours && (
          <div className={classes.locationHours}>
            <StoreOpeningHours hours={operationHours} pure />
          </div>
        )}
      </div>
    </Accordion>
  );
};

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
