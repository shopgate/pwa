import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Link';
import appConfig from '@shopgate/pwa-common/helpers/config';
import connect from './connector';
import styles from './style';

const { forgotPasswordUrl } = appConfig;

/**
 * The ForgotPassword component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const ForgotPassword = ({ showForgotPasswordPopup }) => {
  const forgotPasswordString = 'login.forgot_password';

  if (forgotPasswordUrl) {
    return (
      <Link href={forgotPasswordUrl} className={styles}>
        <I18n.Text string={forgotPasswordString} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={styles}
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
