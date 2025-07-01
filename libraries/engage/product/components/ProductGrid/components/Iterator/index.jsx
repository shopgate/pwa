import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  SurroundPortals,
} from '@shopgate/engage/components';
import { PRODUCT_ITEM } from '@shopgate/engage/category';
import { ProductListEntryProvider } from '@shopgate/engage/product';
import Item from '../Item';

/**
 * The Product Grid Iterator component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Iterator = (props) => {
  const portalProps = { productId: props.id };
  const { id, display } = props;

  return (
    <Grid.Item key={id} data-test-id={props.name}>
      <ProductListEntryProvider productId={props.id}>
        <SurroundPortals
          portalName={PRODUCT_ITEM}
          portalProps={portalProps}
        >
          <Item product={props} display={display} />
        </SurroundPortals>
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
