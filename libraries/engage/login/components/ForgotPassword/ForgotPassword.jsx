import { hot } from 'react-hot-loader/root';
import React, { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
  RippleButton, I18n, ArrowIcon,
} from '@shopgate/engage/components';
import TextField from '@shopgate/pwa-ui-shared/TextField';
import { i18n, EUSERNOTFOUND } from '@shopgate/engage/core';
import {
  container,
  headline,
  subline,
  form,
  input,
  button,
  buttonContainer,
  resetInstructions,
  resetInstructionsEmail,
  goBackButtonContainer,
  goBackButton,
  goBackButtonIcon,
} from './ForgotPassword.style';
import connect from './ForgotPassword.connector';

/**
 * The ForgotPassword component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ForgotPassword = ({ resetPassword, goBack }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    setValidationError('');
    if (email) {
      setLoading(true);

      try {
        await resetPassword(email);
        setShowSuccess(true);
      } catch (error) {
        const { code } = error;
        if (code === EUSERNOTFOUND) {
          setValidationError('login.reset_password.customer_not_found');
        }
      }

      setLoading(false);
    } else {
      setValidationError('validation.email');
    }
  }, [email, resetPassword]);

  const handleBackToLogin = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <div className={container}>
      <div className={headline}>
        <I18n.Text string="login.forgot_password" />
      </div>
      { !showSuccess ? (
        <Fragment>
          <div className={subline}>
            <I18n.Text string="login.reset_password.subline" />
          </div>
          <form onSubmit={handleSubmit} className={form}>
            <TextField
              type="email"
              name="email"
              className={input}
              label="login.email"
              value={email}
              onChange={value => setEmail(value)}
              errorText={validationError}
            />
            <div className={buttonContainer}>
              <RippleButton
                className={button}
                type="secondary"
                disabled={loading}
              >
                <I18n.Text string="common.submit" />
              </RippleButton>
            </div>
          </form>
        </Fragment>
      ) : (
        <Fragment>
          <div className={resetInstructions}>
            <span
              /* eslint-disable react/no-danger */
              dangerouslySetInnerHTML={{
                __html: i18n.text('login.reset_password.reset_instructions', {
                  email: `<span class="${resetInstructionsEmail}">${email}</span>`,
                }),
              }}
             /* eslint-enable react/no-danger */
            />
          </div>
          <div className={goBackButtonContainer}>
            <RippleButton
              flat
              className={goBackButton}
              type="secondary"
              onClick={handleBackToLogin}
            >
              <ArrowIcon className={goBackButtonIcon} />
              <I18n.Text string="login.reset_password.back_to_login" />
            </RippleButton>
          </div>
        </Fragment>
      )}
    </div>
  );
};

ForgotPassword.propTypes = {
  goBack: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
};

export default hot(connect(ForgotPassword));
