import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import AccountBoxIcon from '@shopgate/pwa-ui-shared/icons/AccountBoxIcon';
import styles from './style';
import Item from '../Item';

/**
 * The Header component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Header = (props) => {
  if (!props.user) {
    return (
      <div className={styles.container} data-test-id="NavDrawerLoginButton">
        <Item href={LOGIN_PATH} icon={AccountBoxIcon} close={props.close} primary>
          <I18n.Text string="navigation.login_register" />
        </Item>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${styles.loggedIn}`} data-test-id="NavDrawerLoginButton">
      <div className={styles.welcome} data-test-id="LoginWelcome">
        <I18n.Text string="navigation.welcome_message" params={{ name: props.user.firstName }} />
      </div>
      <div className={styles.mail}>
        {props.user.mail}
      </div>
    </div>
  );
};

Header.propTypes = {
  close: PropTypes.func,
  user: PropTypes.shape(),
};

Header.defaultProps = {
  close: () => {},
  user: null,
};

export default Header;
