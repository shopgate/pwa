import React, { Fragment } from 'react';
import Grid from '@shopgate/pwa-common/components/Grid';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Link';
import Button from '@shopgate/pwa-ui-shared/Button';
import {
  LOGIN_PATH,
  REGISTER_PATH,
} from '@shopgate/pwa-common/constants/RoutePaths';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @param {Object} context The consumed context.
 * @returns {JSX}
 */
const LogOut = () => (
  <Fragment>
    <Grid className={styles.grid}>
      <Grid.Item className={styles.gridItem}>
        <Button type="secondary" className={styles.button} testId="UserMenuLogin">
          <Link href={LOGIN_PATH}>
            <I18n.Text string="login.button" />
          </Link>
        </Button>
      </Grid.Item>
      <Grid.Item className={styles.gridItem}>
        <Button type="secondary" className={styles.button} testId="UserMenuRegister">
          <Link href={REGISTER_PATH}>
            <I18n.Text string="login.signup" />
          </Link>
        </Button>
      </Grid.Item>
    </Grid>
  </Fragment>
);

export default LogOut;
