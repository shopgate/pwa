import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Item from '../Item';
import FulfillmentLocationGroup from './components/FulfillmentLocationGroup';

/**
 * Renders the product group.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ItemsGroup = ({ group, items, onFocus }) => (
  <Fragment>
    {group.fulfillment.locationId &&
      <FulfillmentLocationGroup locationId={group.fulfillment.locationId} />
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
  group: PropTypes.shape().isRequired,
  items: PropTypes.arrayOf(PropTypes.shape).isRequired,
  onFocus: PropTypes.func.isRequired,
};

export default ItemsGroup;
