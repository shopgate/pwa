import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Portal, RippleButton } from '@shopgate/engage/components';
import {
  CART_EMPTY_BEFORE,
  CART_EMPTY,
  CART_EMPTY_AFTER,
} from '@shopgate/engage/cart';
import Icon from './components/Icon';
import connect from './connector';
import styles from './style';

/**
 * The Cart Empty component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Empty = ({ goBackHistory }) => (
  <div className={styles.wrapper}>
    <Portal name={CART_EMPTY_BEFORE} />
    <Portal name={CART_EMPTY}>
      <div className={styles.container}>
        <div className={styles.icon}>
          <Icon />
        </div>
        <div className={styles.title} data-test-id="emptyCartPlaceHolderString">
          <I18n.Text string="cart.empty" />
        </div>
      </div>
    </Portal>
    <Portal name={CART_EMPTY_AFTER} />
    <div className={styles.buttonContainer}>
      <RippleButton onClick={goBackHistory} className={styles.button} type="secondary">
        <I18n.Text string="cart.continue" />
      </RippleButton>
    </div>
  </div>
);

Empty.propTypes = {
  goBackHistory: PropTypes.func.isRequired,
};

export default connect(Empty);
