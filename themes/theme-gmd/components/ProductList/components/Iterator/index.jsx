import React from 'react';
import PropTypes from 'prop-types';
import { Portal, List } from '@shopgate/engage/components';
import {
  PRODUCT_ITEM_BEFORE,
  PRODUCT_ITEM,
  PRODUCT_ITEM_AFTER,
} from '@shopgate/engage/category';
import Item from '../Item';
import styles from './style';

/**
 * The Product List Iterator component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Iterator = props => (
  <List.Item
    key={props.id}
    itemProp="itemListElement"
    itemScope
    itemType="http://schema.org/ListItem"
    className={styles.item}
  >
    <Portal name={PRODUCT_ITEM_BEFORE} props={{ productId: props.id }} />
    <Portal name={PRODUCT_ITEM} props={{ productId: props.id }}>
      <Item product={props} display={props.display} />
    </Portal>
    <Portal name={PRODUCT_ITEM_AFTER} props={{ productId: props.id }} />
  </List.Item>
);

Iterator.propTypes = {
  id: PropTypes.string.isRequired,
  display: PropTypes.shape(),
};

Iterator.defaultProps = {
  display: null,
};

export default Iterator;
