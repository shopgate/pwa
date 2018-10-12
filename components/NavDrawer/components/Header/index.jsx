import React from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys } from 'recompose';
import I18n from '@shopgate/pwa-common/components/I18n';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import AccountBoxIcon from '@shopgate/pwa-ui-shared/icons/AccountBoxIcon';
import colors from 'Styles/colors';
import connect from './connector';
import styles from './style';

const enhance = onlyUpdateForKeys(['email']);

/**
 * The NavDrawerHeader component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const NavDrawerHeader = ({ email, name, openLogin }) => {
  if (!email) {
    return (
      <NavDrawer.Item
        icon={props => <AccountBoxIcon color={colors.light} {...props} />}
        label="navigation.login_register"
        onClick={openLogin}
        style={{
          background: colors.primary,
          color: colors.light,
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
  openLogin: PropTypes.func.isRequired,
  email: PropTypes.string,
  name: PropTypes.string,
};

NavDrawerHeader.defaultProps = {
  email: null,
  name: null,
};

export default connect(enhance(NavDrawerHeader));
