import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import RippleButton from 'Components/RippleButton';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import connect from './connector';
import styles from './style';

/**
 * The checkout button component.
 * @returns {JSX}
 */
const CheckoutButton = ({ isActive }) => (
  <RippleButton
    disabled={!isActive}
    flat={false}
    type="secondary"
    className={styles.button}
  >
    <Link href={CHECKOUT_PATH}>
      <I18n.Text
        className={styles.link}
        string="cart.checkout"
      />
    </Link>
  </RippleButton>
);

CheckoutButton.propTypes = {
  isActive: PropTypes.bool,
};

CheckoutButton.defaultProps = {
  isActive: true,
};

export default connect(CheckoutButton);
