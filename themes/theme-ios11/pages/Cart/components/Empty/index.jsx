import React from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import ConfigIcon from '@shopgate/pwa-common/components/Icon';
import Icon from './components/Icon';
import styles from './style';

const { icons } = themeConfig;

/**
 * The Cart Empty component.
 * @return {JSX.Element}
 */
const Empty = () => (
  <div className={styles.wrapper}>
    <Portal name={portals.CART_EMPTY_BEFORE} />
    <Portal name={portals.CART_EMPTY}>
      <div className={styles.container}>
        <div className={styles.icon}>
          {icons?.emptyCart ? <ConfigIcon content={icons.emptyCart} /> : <Icon />}
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
