import React from 'react';
import Grid from '@shopgate/pwa-common/components/Grid';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import Button from '@shopgate/pwa-ui-shared/Button';
import {
  LOGIN_PATH,
  REGISTER_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import styles from './style';

/**
 * Renders logged out user menu.
 * @returns {JSX}
 */
const LogOut = () => (
  <div data-test-id="userMenu">
    <Grid className={styles.grid}>
      <Grid.Item className={styles.gridItem}>
        <Button className={styles.button} testId="UserMenuLogin">
          <Link href={LOGIN_PATH}>
            <I18n.Text string="login.button" />
          </Link>
        </Button>
      </Grid.Item>
      <Grid.Item className={styles.gridItem}>
        <Button className={styles.button} testId="UserMenuRegister">
          <Link href={REGISTER_PATH}>
            {/* Proper registration link will be handled later. */}
            <I18n.Text string="login.signup" />
          </Link>
        </Button>
      </Grid.Item>
    </Grid>
  </div>
);

export default LogOut;
