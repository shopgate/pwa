import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import Item from '../Item';
import styles from './style';

/**
 * The Product Grid Iterator component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Iterator = props => (
  <Grid.Item
    key={props.id}
    itemProp="itemListElement"
    itemScope
    itemType="http://schema.org/ListItem"
    className={styles.item}
    data-test-id={props.name}
  >
    <Portal name={portals.PRODUCT_ITEM_BEFORE} props={{ productId: props.id }} />
    <Portal name={portals.PRODUCT_ITEM} props={{ productId: props.id }}>
      <Item product={props} display={props.display} />
    </Portal>
    <Portal name={portals.PRODUCT_ITEM_AFTER} props={{ productId: props.id }} />
  </Grid.Item>
);

Iterator.propTypes = {
  id: PropTypes.string.isRequired,
  display: PropTypes.shape(),
  name: PropTypes.string,
};

Iterator.defaultProps = {
  display: null,
  name: null,
};

export default Iterator;
