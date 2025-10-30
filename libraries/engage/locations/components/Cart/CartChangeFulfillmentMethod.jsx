import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FulfillmentSheet } from '../FulfillmentSheet';
import connect from './CartChangeFulfillmentMethod.connector';
import { STAGE_FULFILLMENT_METHOD } from '../../constants';

/**
 * @typedef {import('./CartChangeFulfillmentMethod.types').OwnProps} OwnProps
 * @typedef {import('./CartChangeFulfillmentMethod.types').DispatchProps} DispatchProps
 * @typedef {OwnProps & DispatchProps} Props
 */

/**
 * Renders the CartChangeFulfillmentMethod component.
 * @param {Props} props The component props.
 * @returns {JSX.Element|null}
 */
const CartChangeFulfillmentMethod = ({
  cartItem,
  fetchProductLocations,
  registerAction,
}) => {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!registerAction || !cartItem) {
      return;
    }

    registerAction('changeFulfillment', () => {
      fetchProductLocations(cartItem.product.id);
      setOpened(true);
    });
  }, [cartItem, fetchProductLocations, registerAction]);

  /**
   * Handles closing of the sheet.
   */
  function handleClose() {
    setOpened(false);
  }

  if (!opened) {
    return null;
  }

  return (
    <FulfillmentSheet
      open
      productId={cartItem.product.id}
      stage={STAGE_FULFILLMENT_METHOD}
      meta={{ cartItem }}
      onClose={handleClose}
      updatePreferredLocation
    />
  );
};

CartChangeFulfillmentMethod.propTypes = {
  cartItem: PropTypes.shape({
    product: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  fetchProductLocations: PropTypes.func.isRequired,
  registerAction: PropTypes.func,
};

CartChangeFulfillmentMethod.defaultProps = {
  registerAction: null,
};

export default connect(CartChangeFulfillmentMethod);
