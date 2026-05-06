import React from 'react';
import PropTypes from 'prop-types';
import List from '@shopgate/pwa-common/components/List';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { ProductListEntryProvider } from '@shopgate/engage/product';
import { makeStyles } from '@shopgate/engage/styles';
import Item from '../Item';

const useStyles = makeStyles()({
  item: {
    ':first-of-type': {
      paddingTop: 0,
    },
    ':last-of-type': {
      paddingBottom: 4,
    },
    paddingTop: 2,
    paddingBottom: 2,
    position: 'relative',
  },
});

/**
 * The Product List Iterator component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Iterator = (props) => {
  const { classes } = useStyles();

  return (
    <List.Item
      key={props.id}
      itemProp="itemListElement"
      itemScope
      itemType="http://schema.org/ListItem"
      className={classes.item}
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
};

Iterator.propTypes = {
  id: PropTypes.string.isRequired,
  display: PropTypes.shape(),
};

Iterator.defaultProps = {
  display: null,
};

export default Iterator;
