import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { themeConfig } from '@shopgate/engage';
import { svgToDataUrl } from '@shopgate/engage/core/helpers';
import classNames from 'classnames';
import Icon from './components/Icon';
import connect from './connector';
import styles from './style';

const { svgImages = {} } = themeConfig || {};

/**
 * The Cart Empty component.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const Empty = ({ goBackHistory }) => {
  const { emptyCart = '' } = svgImages || {};

  const imageSRC = useMemo(() => svgToDataUrl(emptyCart),
    [emptyCart]);

  return (
    <div className={styles.wrapper}>
      <Portal name={portals.CART_EMPTY_BEFORE} />
      <Portal name={portals.CART_EMPTY}>
        <div className={styles.container}>
          <div className={classNames(styles.icon, 'cart__empty-cart__image')}>
            {emptyCart ? <img src={imageSRC} alt="" /> : <Icon />}
          </div>
          <div className={styles.title} data-test-id="emptyCartPlaceHolderString">
            <I18n.Text string="cart.empty" />
          </div>
        </div>
      </Portal>
      <Portal name={portals.CART_EMPTY_AFTER} />
      <div className={styles.buttonContainer}>
        <RippleButton onClick={goBackHistory} className={styles.button} type="secondary">
          <I18n.Text string="cart.continue" />
        </RippleButton>
      </div>
    </div>
  );
};

Empty.propTypes = {
  goBackHistory: PropTypes.func.isRequired,
};

export default connect(Empty);
