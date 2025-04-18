import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_ITEM,
  PRODUCT_ITEM_AFTER,
  PRODUCT_ITEM_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import { ProductListEntryProvider } from '@shopgate/engage/product';
import Item from '../Item';

/**
 * The Product Grid Iterator component.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Iterator = (props) => {
  const portalProps = { productId: props.id };
  const { id, display } = props;

  return (
    <Grid.Item key={id} data-test-id={props.name}>
      <ProductListEntryProvider productId={props.id}>
        <Portal name={PRODUCT_ITEM_BEFORE} props={portalProps} />
        <Portal name={PRODUCT_ITEM} props={portalProps}>
          <Item product={props} display={display} />
        </Portal>
        <Portal name={PRODUCT_ITEM_AFTER} props={portalProps} />
      </ProductListEntryProvider>
    </Grid.Item>
  );
};

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
