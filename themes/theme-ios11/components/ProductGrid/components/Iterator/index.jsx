import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_ITEM,
  PRODUCT_ITEM_AFTER,
  PRODUCT_ITEM_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import Item from '../Item';
import styles from './style';
/**
 * The Product Grid Iterator component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Iterator = (props) => {
  const portalProps = { productId: props.id };
  const { id, display, columns } = props;

  return (
    <Grid.Item key={id} className={styles.item(columns)} data-test-id={props.name}>
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
  columns: PropTypes.number,
  display: PropTypes.shape(),
  name: PropTypes.string,
};

Iterator.defaultProps = {
  columns: 2,
  display: null,
  name: null,
};

export default Iterator;
