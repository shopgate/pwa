import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@shopgate/engage/components';
import { I18n } from '@shopgate/engage/components';
import { Link } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components';
import {
  LOGIN_PATH,
  REGISTER_PATH,
} from '@shopgate/engage/checkout';
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
        <Link href={LOGIN_PATH} disabled={isDisabled}>
          <Button type="secondary" className={styles.button} testId="UserMenuLogin" disabled={isDisabled}>
            <I18n.Text string="login.button" />
          </Button>
        </Link>
      </Grid.Item>
      <Grid.Item className={styles.gridItem}>
        <Link href={REGISTER_PATH} disabled={isDisabled}>
          <Button type="secondary" className={styles.button} testId="UserMenuRegister" disabled={isDisabled}>
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
