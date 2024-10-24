import React from 'react';
import PropTypes from 'prop-types';
import List from '@shopgate/pwa-common/components/List';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { ProductListEntryProvider } from '@shopgate/engage/product';
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
    <ProductListEntryProvider productId={props.id}>
      <Portal name={portals.PRODUCT_ITEM_BEFORE} props={{ productId: props.id }} />
      <Portal name={portals.PRODUCT_ITEM} props={{ productId: props.id }}>
        <Item product={props} display={props.display} />
      </Portal>
      <Portal name={portals.PRODUCT_ITEM_AFTER} props={{ productId: props.id }} />
    </ProductListEntryProvider>
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
