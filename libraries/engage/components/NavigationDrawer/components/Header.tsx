import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import AccountBoxIcon from '@shopgate/pwa-ui-shared/icons/AccountBoxIcon';
import I18n from '@shopgate/pwa-common/components/I18n';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import {
  isUserLoggedIn,
  getUserEmail,
  getUserDisplayName,
} from '@shopgate/pwa-common/selectors/user';
import { makeStyles } from '@shopgate/engage/styles';
import { useThunkDispatch } from '../hooks';

const ellipsis = {
  lineHeight: 1.3,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const useStyles = makeStyles()(theme => ({
  container: {
    color: theme.palette.secondary.contrastText,
    marginBottom: 4,
  },
  loggedIn: {
    background: theme.palette.secondary.main,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: theme.components.navigator.height,
    padding: `${theme.spacing(1) + 1}px ${theme.spacing(2)}px ${theme.spacing(1) - 1}px`,
    paddingTop: `calc(${theme.spacing(1) + 1}px + var(--safe-area-inset-top))`,
  },
  welcome: {
    fontSize: 16,
    fontWeight: 500,
    ...ellipsis,
  },
  mail: ellipsis,
}));

/**
 * Renders the login prompt or the signed in shopper's details.
 * @returns The rendered header.
 */
const Header = () => {
  const { classes, cx, theme } = useStyles();
  const dispatch = useThunkDispatch();
  const isLoggedIn = useSelector(isUserLoggedIn);
  const email = useSelector(getUserEmail);
  const name = useSelector(getUserDisplayName);

  const openLogin = useCallback(
    () => dispatch(historyPush({ pathname: LOGIN_PATH })),
    [dispatch]
  );

  if (!isLoggedIn) {
    return (
      <NavDrawer.Item
        icon={(props: Record<string, unknown>) => (
          <AccountBoxIcon color={theme.palette.primary.contrastText} {...props} />
        )}
        label="navigation.login_register"
        onClick={openLogin}
        style={{
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
        testId="navDrawerLoginButton"
      />
    );
  }

  return (
    <div
      className={cx(classes.container, classes.loggedIn, 'engage__navigation-drawer__header')}
      data-test-id="NavDrawerLoginButton"
    >
      <div className={classes.welcome} data-test-id="LoginWelcome">
        <I18n.Text string="navigation.welcome_message" params={{ name }} />
      </div>
      <div className={classes.mail}>{email}</div>
    </div>
  );
};

export default Header;
