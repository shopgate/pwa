import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { TextLink } from '@shopgate/engage/components';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const { forgotPasswordUrl } = appConfig;

const useStyles = makeStyles()({
  root: {
    color: 'var(--color-text-medium-emphasis)',
    position: 'relative',
    display: 'inline-block',
    width: 'auto',
    zIndex: '1',
  },
});

/**
 * The ForgotPassword component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const ForgotPassword = ({ showForgotPasswordPopup }) => {
  const { classes } = useStyles();
  const forgotPasswordString = 'login.forgot_password';

  if (forgotPasswordUrl) {
    return (
      <TextLink href={forgotPasswordUrl} className={classes.root}>
        <I18n.Text string={forgotPasswordString} />
      </TextLink>
    );
  }

  return (
    <button
      type="button"
      className={classes.root}
      onClick={showForgotPasswordPopup}
      data-test-id="forgotPasswordButton"
    >
      <I18n.Text string={forgotPasswordString} />
    </button>
  );
};

ForgotPassword.propTypes = {
  showForgotPasswordPopup: PropTypes.func.isRequired,
};

export default connect(ForgotPassword);
