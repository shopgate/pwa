import React, { useMemo } from 'react';
import I18n from '@shopgate/pwa-common/components/I18n';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import { themeConfig } from '@shopgate/engage';
import { svgToDataUrl } from '@shopgate/engage/core/helpers';
import Icon from './components/Icon';
import styles from './style';

const { svgImages = {} } = themeConfig || {};

/**
 * The Cart Empty component.
 * @return {JSX.Element}
 */
const Empty = () => {
  const { emptyCart = '' } = svgImages || {};

  const imageSRC = useMemo(() => svgToDataUrl(emptyCart),
    [emptyCart]);

  return (
    <div className={styles.wrapper}>
      <Portal name={portals.CART_EMPTY_BEFORE} />
      <Portal name={portals.CART_EMPTY}>
        <div className={styles.container}>
          <div className={styles.icon}>
            {emptyCart ? <img src={imageSRC} alt="" /> : <Icon />}
          </div>
          <div className={styles.title} data-test-id="emptyCartPlaceHolderString">
            <I18n.Text string="cart.empty" />
          </div>
        </div>
      </Portal>
      <Portal name={portals.CART_EMPTY_AFTER} />
    </div>
  );
};

export default Empty;
