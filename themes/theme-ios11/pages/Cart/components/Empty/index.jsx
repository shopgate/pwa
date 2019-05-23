import React from 'react';
import { I18n } from '@shopgate/engage/components';
import { Portal } from '@shopgate/engage/components';
import * as portals from '@shopgate/engage/cart';
import Icon from './components/Icon';
import styles from './style';

/**
 * The Cart Empty component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Empty = () => (
  <div className={styles.wrapper}>
    <Portal name={portals.CART_EMPTY_BEFORE} />
    <Portal name={portals.CART_EMPTY}>
      <div className={styles.container}>
        <div className={styles.icon}>
          <Icon />
        </div>
        <div className={styles.title} data-test-id="emptyCartPlaceHolderString">
          <I18n.Text string="cart.empty" />
        </div>
      </div>
    </Portal>
    <Portal name={portals.CART_EMPTY_AFTER} />
  </div>
);

export default Empty;
