import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Grid, I18n, Link, Button,
} from '@shopgate/engage/components';
import {
  LOGIN_PATH,
  REGISTER_PATH,
} from '@shopgate/engage/user';
import connect from './connector';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @param {Object} context The consumed context.
 * @returns {JSX}
 */
const LoggedOut = ({ isDisabled }) => (
  <div data-test-id="userMenu">
    <Grid className={classnames(styles.grid, 'theme__more-page__user-menu__container')}>
      <Grid.Item className={classnames(styles.gridItem, 'theme__more-page__login-button__container')}>
        <Link href={LOGIN_PATH} disabled={isDisabled}>
          <Button
            type="secondary"
            className={classnames(styles.button, 'theme__more-page__login-button')}
            testId="UserMenuLogin"
            disabled={isDisabled}
          >
            <I18n.Text string="login.button" />
          </Button>
        </Link>
      </Grid.Item>
      <Grid.Item className={classnames(styles.gridItem, 'theme__more-page-register-button__container')}>
        <Link href={REGISTER_PATH} disabled={isDisabled}>
          <Button
            type="secondary"
            className={classnames(styles.button, 'theme__more-page-register-button')}
            testId="UserMenuRegister"
            disabled={isDisabled}
          >
            <I18n.Text string="login.signup" />
          </Button>
        </Link>
      </Grid.Item>
    </Grid>
  </div>
);

LoggedOut.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
};

export default connect(LoggedOut);
