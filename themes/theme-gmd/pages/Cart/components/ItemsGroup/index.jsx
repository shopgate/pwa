import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Item from '../Item';
import FulfillmentLocation from './components/FulfillmentLocation';

/**
 * Renders the product group.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ItemsGroup = ({ fulfillmentLocationId, items, onFocus }) => (
  <Fragment>
    {fulfillmentLocationId &&
      <FulfillmentLocation locationId={fulfillmentLocationId} />
    }
    {items.map(cartItem => (
      <Item
        item={cartItem}
        key={cartItem.id}
        onFocus={onFocus}
      />
    ))}
  </Fragment>
);

ItemsGroup.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape).isRequired,
  onFocus: PropTypes.func.isRequired,
  fulfillmentLocationId: PropTypes.string,
};

ItemsGroup.defaultProps = {
  fulfillmentLocationId: null,
};

export default ItemsGroup;
