import React from 'react';
import PropTypes from 'prop-types';
import { every, isEmpty } from 'lodash';
import { ResponsiveContainer } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';
import { useCartItem } from '../CartItem';
import { CartItemCardReservationLabel } from './CartItemCardReservationLabel';
import connect from './CartItem.connector';
import { CartItemCardReservationAccordion } from './CartItemCardReservationAccordion';

const { gap } = themeVariables;

const useStyles = makeStyles()({
  accordionToggle: {
    padding: `${gap.big * 1.25}px ${gap.big}px`,
  },
});

// eslint-disable-next-line max-len
/** @typedef {import('@shopgate/engage/locations/locations.types').OptionalLocationAware} OptionalLocationAware */

/**
 * Renders the cart item card reservation block,
 * @param {OptionalLocationAware} props The component props.
 * @returns {JSX.Element}
 */
const CartItemCardReservation = ({ location, fulfillmentMethod }) => {
  const { classes } = useStyles();
  const { isOrderDetails } = useCartItem();

  if (!location) {
    return null;
  }

  const { operationHours, address: { phoneNumber } = {} } = location;
  if (
    (!operationHours || every(operationHours, isEmpty))
    && !phoneNumber
    && (!location.address || !location.address.street)
  ) {
    return (
      <div className={classes.accordionToggle}>
        <CartItemCardReservationLabel location={location} fulfillmentMethod={fulfillmentMethod} />
      </div>
    );
  }

  return (
    <>
      <ResponsiveContainer webOnly breakpoint=">xs">
        { !isOrderDetails && (
          <CartItemCardReservationAccordion
            openWithChevron
            location={location}
            fulfillmentMethod={fulfillmentMethod}
            operationHours={operationHours}
          />
        )}
      </ResponsiveContainer>
      <ResponsiveContainer appAlways breakpoint="<=xs">
        { !isOrderDetails && (
          <CartItemCardReservationAccordion
            location={location}
            fulfillmentMethod={fulfillmentMethod}
            operationHours={operationHours}
          />
        )}
      </ResponsiveContainer>
    </>
  );
};

CartItemCardReservation.propTypes = {
  fulfillmentMethod: PropTypes.string,
  location: PropTypes.shape({
    operationHours: PropTypes.shape({
      sun: PropTypes.string,
      mon: PropTypes.string,
      tue: PropTypes.string,
      wed: PropTypes.string,
      thu: PropTypes.string,
      fri: PropTypes.string,
      sat: PropTypes.string,
    }),
    address: PropTypes.shape({
      phoneNumber: PropTypes.string,
      street: PropTypes.string,
    }),
  }),
};

CartItemCardReservation.defaultProps = {
  location: null,
  fulfillmentMethod: null,
};

export default connect(CartItemCardReservation);
