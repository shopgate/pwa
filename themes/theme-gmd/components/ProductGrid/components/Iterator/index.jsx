import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Portal } from '@shopgate/engage/components';
import {
  PRODUCT_ITEM,
  PRODUCT_ITEM_AFTER,
  PRODUCT_ITEM_BEFORE,
} from '@shopgate/engage/category';
import Item from '../Item';
import styles from './style';
/**
 * The Product Grid Iterator component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Iterator = (props) => {
  const portalProps = { productId: props.id };
  const { id, display } = props;

  return (
    <Grid.Item key={id} className={styles.item} data-test-id={props.name}>
      <Portal name={PRODUCT_ITEM_BEFORE} props={portalProps} />
      <Portal name={PRODUCT_ITEM} props={portalProps}>
        <Item product={props} display={display} />
      </Portal>
      <Portal name={PRODUCT_ITEM_AFTER} props={portalProps} />
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
