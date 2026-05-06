import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import AccountBoxIcon from '@shopgate/pwa-ui-shared/icons/AccountBoxIcon';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './connector';

const { variables } = themeConfig;

const ellipsis = {
  lineHeight: 1.3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const useStyles = makeStyles()(theme => ({
  container: {
    color: 'var(--color-secondary-contrast)',
    marginBottom: 4,
  },
  loggedIn: {
    background: 'var(--color-secondary)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: variables.navigator.height,
    padding: `${theme.spacing(1) + 1}px ${theme.spacing(2)}px ${theme.spacing(1) - 1}px`,
    paddingTop: `calc(${theme.spacing(1) + 1}px + var(--safe-area-inset-top))`,
  },
  welcome: {
    fontSize: 16,
    fontWeight: 500,
    ...ellipsis,
  },
  mail: {
    ...ellipsis,
  },
}));

/**
 * The NavDrawerHeader component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const NavDrawerHeader = ({
  isLoggedIn, email, name, openLogin,
}) => {
  const { classes, cx } = useStyles();

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
    <div className={cx(classes.container, classes.loggedIn)} data-test-id="NavDrawerLoginButton">
      <div className={classes.welcome} data-test-id="LoginWelcome">
        <I18n.Text string="navigation.welcome_message" params={{ name }} />
      </div>
      <div className={classes.mail}>
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
