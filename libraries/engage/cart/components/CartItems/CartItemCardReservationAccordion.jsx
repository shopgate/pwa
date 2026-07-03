import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Typography } from '@shopgate/engage/components';
import { StoreAddress, StoreOpeningHours } from '@shopgate/engage/locations';
import { makeStyles } from '@shopgate/engage/styles';
import { CartItemCardReservationLabel } from './CartItemCardReservationLabel';

const useStyles = makeStyles()(theme => ({
  accordionContent: {
    paddingLeft: theme.spacing(5),
  },
  accordionToggle: {
    padding: theme.spacing(2.5, 2),
  },
  locationHours: {
    paddingTop: theme.spacing(2),
  },
}));
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
        <Typography variant="body2" component="div" color="textSecondary">
          <StoreAddress address={location.address} pure />
        </Typography>
        {operationHours && (
          <Typography variant="body2" component="div" className={classes.locationHours}>
            <StoreOpeningHours hours={operationHours} pure />
          </Typography>
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
