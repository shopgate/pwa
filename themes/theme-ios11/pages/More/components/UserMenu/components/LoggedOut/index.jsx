import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, I18n,
} from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import {
  LOGIN_PATH,
  REGISTER_PATH,
} from '@shopgate/engage/user';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()({
  grid: {
    flexWrap: 'wrap',
    padding: '0 15px',
  },
  gridItem: {
    flexGrow: 1,
    marginBottom: 8,
    minWidth: '50%',
    padding: '0 5px',
  },
  button: {
    '& *': {
      textAlign: 'center',
    },
  },
});

/**
 * @param {Object} props The component props.
 * @param {boolean} isDisabled whether the button is disabled
 * @returns {JSX.Element}
 */
const LoggedOut = ({ isDisabled }) => {
  const { classes, cx } = useStyles();

  return (
    <div data-test-id="userMenu">
      <Grid className={cx(classes.grid, 'theme__more-page__user-menu__container')}>
        <Grid.Item className={cx(classes.gridItem, 'theme__more-page__login-button__container')}>
          <Button
            href={LOGIN_PATH}
            color="primary"
            fullWidth
            className={cx(classes.button, 'theme__more-page__login-button')}
            testId="UserMenuLogin"
            disabled={isDisabled}
          >
            <I18n.Text string="login.button" />
          </Button>
        </Grid.Item>
        <Grid.Item className={cx(classes.gridItem, 'theme__more-page-register-button__container')}>
          <Button
            href={REGISTER_PATH}
            color="primary"
            fullWidth
            className={cx(classes.button, 'theme__more-page-register-button')}
            testId="UserMenuRegister"
            disabled={isDisabled}
          >
            <I18n.Text string="login.signup" />
          </Button>
        </Grid.Item>
      </Grid>
    </div>
  );
};

LoggedOut.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
};

export default connect(LoggedOut);
