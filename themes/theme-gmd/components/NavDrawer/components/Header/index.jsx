import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import AccountBoxIcon from '@shopgate/pwa-ui-shared/icons/AccountBoxIcon';
import connect from './connector';
import styles from './style';

/**
 * The NavDrawerHeader component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const NavDrawerHeader = ({
  isLoggedIn, email, name, openLogin,
}) => {
  if (!isLoggedIn) {
    return (
      <NavDrawer.Item
        icon={props => <AccountBoxIcon color="var(--color-primary-contrast)" {...props} />}
        label="navigation.login_register"
        onClick={openLogin}
        style={{
          background: 'var(--color-primary)',
          color: 'var(--color-primary-contrast)',
        }}
        testId="navDrawerLoginButton"
      />
    );
  }

  return (
    <div className={`${styles.container} ${styles.loggedIn}`} data-test-id="NavDrawerLoginButton">
      <div className={styles.welcome} data-test-id="LoginWelcome">
        <I18n.Text string="navigation.welcome_message" params={{ name }} />
      </div>
      <div className={styles.mail}>
        {email}
      </div>
    </div>
  );
};

NavDrawerHeader.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  openLogin: PropTypes.func.isRequired,
  email: PropTypes.string,
  name: PropTypes.string,
};

NavDrawerHeader.defaultProps = {
  email: null,
  name: null,
};

export default connect(NavDrawerHeader);
