import React from 'react';
import PropTypes from 'prop-types';
import Item from '../Item';
import styles from './styles';

/**
 * Wrapper around the Item component to simplify item rendering based on the two different "items"
 * lists within ListItemContent.
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const ListItemWrapper = ({
  listId,
  product,
  notes,
  quantity,
  addToCart,
  removeItem,
  items,
  index,
}) => (
  <div>
    <Item
      product={product}
      notes={notes}
      quantity={quantity}
      listId={listId}
      productId={product.id}
      addToCart={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return addToCart(product, quantity);
      }}
      remove={(e) => {
        e.preventDefault();
        e.stopPropagation();
        removeItem(product.id);
      }}
    />
    {(index === items.length - 1) ? null : <div className={styles.divider} />}
  </div>
);

ListItemWrapper.propTypes = {
  addToCart: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  listId: PropTypes.string.isRequired,
  product: PropTypes.shape().isRequired,
  removeItem: PropTypes.func.isRequired,
  notes: PropTypes.string,
  quantity: PropTypes.number,
};

ListItemWrapper.defaultProps = {
  notes: undefined,
  quantity: 1,
};

export default ListItemWrapper;
