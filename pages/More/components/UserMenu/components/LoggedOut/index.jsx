import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Link';
import Button from '@shopgate/pwa-ui-shared/Button';
import {
  LOGIN_PATH,
  REGISTER_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import connect from './connector';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @param {Object} context The consumed context.
 * @returns {JSX}
 */
const LoggedOut = ({ isDisabled }) => (
  <div data-test-id="userMenu">
    <Grid className={styles.grid}>
      <Grid.Item className={styles.gridItem}>
        <Button type="secondary" className={styles.button} testId="UserMenuLogin" disabled={isDisabled}>
          <Link href={LOGIN_PATH} disabled={isDisabled}>
            <I18n.Text string="login.button" />
          </Link>
        </Button>
      </Grid.Item>
      <Grid.Item className={styles.gridItem}>
        <Button type="secondary" className={styles.button} testId="UserMenuRegister" disabled={isDisabled}>
          <Link href={REGISTER_PATH} disabled={isDisabled}>
            <I18n.Text string="login.signup" />
          </Link>
        </Button>
      </Grid.Item>
    </Grid>
  </div>
);

LoggedOut.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
};

export default connect(LoggedOut);
