import React from 'react';
import PropTypes from 'prop-types';
import { every, isEmpty } from 'lodash';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import { Accordion } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';
import { StoreOpeningHours, StorePhoneNumber } from '@shopgate/engage/locations';
import { CartItemGroupReservationLabel } from './CartItemGroupReservationLabel';
import connect from './CartItem.connector';

const { gap } = themeVariables;

const useStyles = makeStyles()({
  accordionToggle: {
    paddingTop: gap.xsmall,
    paddingBottom: gap.xsmall,
  },
  simpleLabel: {
    padding: `${gap.xsmall}px ${gap.xbig}px ${gap.xsmall}px ${gap.big}px`,
  },
  addressDetails: {
    fontSize: '0.875rem',
    paddingLeft: gap.xbig,
  },
});

// eslint-disable-next-line max-len
/** @typedef {import('@shopgate/engage/locations/locations.types').OptionalLocationAware} OptionalLocationAware */

/**
 * Renders the product group.
 * @param {OptionalLocationAware} props The component props.
 * @returns {JSX.Element|null}
 */
function CartItemGroupReservation({ location, fulfillmentMethod }) {
  const { classes } = useStyles();
  if (!location) {
    return null;
  }

  const { operationHours, address: { phoneNumber } = {} } = location;
  if ((!operationHours || every(operationHours, isEmpty)) && !phoneNumber) {
    return (
      <CardListItem className={classes.simpleLabel}>
        <CartItemGroupReservationLabel location={location} fulfillmentMethod={fulfillmentMethod} />
      </CardListItem>
    );
  }

  return (
    <CardListItem>
      <Accordion
        renderLabel={() =>
          <CartItemGroupReservationLabel
            location={location}
            fulfillmentMethod={fulfillmentMethod}
          />}
        className={classes.accordionToggle}
      >
        <div className={classes.addressDetails}>
          <StoreOpeningHours hours={operationHours} />
          <StorePhoneNumber phone={phoneNumber} />
        </div>
      </Accordion>
    </CardListItem>
  );
}

CartItemGroupReservation.propTypes = {
  fulfillmentMethod: PropTypes.string,
  location: PropTypes.shape({
    operationHours: PropTypes.shape(),
    address: PropTypes.shape({
      phoneNumber: PropTypes.string,
    }),
  }),
};

CartItemGroupReservation.defaultProps = {
  location: null,
  fulfillmentMethod: null,
};

export default connect(CartItemGroupReservation);
