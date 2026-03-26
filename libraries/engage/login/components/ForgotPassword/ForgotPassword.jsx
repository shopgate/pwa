import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import {
  RippleButton, I18n, ArrowIcon,
} from '@shopgate/engage/components';
import { StylePresets } from '@shopgate/engage/components/Form';
import TextField from '@shopgate/pwa-ui-shared/TextField';
import { i18n, EUSERNOTFOUND } from '@shopgate/engage/core';
import connect from './ForgotPassword.connector';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    flexGrow: 1,
    padding: `${variables.gap.small * 3}px ${variables.gap.big}px`,
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      width: '50%',
    },
  },
  headline: {
    fontSize: '2.1875rem',
    lineHeight: 1,
    fontWeight: 500,
    paddingBottom: variables.gap.big,
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      fontSize: '2rem',
      fontWeight: 'normal',
    },
  },
  subline: {
    fontSize: '1.125rem',
    color: 'var(--color-text-medium-emphasis)',
    marginBottom: variables.gap.big,
    marginTop: 4,
  },
  form: {
    paddingTop: 24,
    ...StylePresets.OUTLINED_FORM_FIELDS,
    ' .simpleInput': {
      paddingLeft: variables.gap.big,
    },
  },
  buttonContainer: {
    paddingTop: variables.gap.big * 2,
    paddingBottom: variables.gap.big * 1.5,
  },
  button: {
    width: '100%',
  },
  input: {
    ' .label': {
      color: 'var(--color-text-medium-emphasis)',
    },
    ' .placeholder': {
      color: 'var(--color-text-medium-emphasis)',
    },
    ' .simpleInput': {
      color: 'var(--color-text-heigh-emphasis)',
    },
  },
  resetInstructions: {
    paddingTop: variables.gap.big,
    display: 'flex',
    alignItems: 'center',
  },
  resetInstructionsEmail: {
    fontWeight: 'bold',
    color: 'var(--color-secondary)',
  },
  goBackButtonContainer: {
    padding: `${variables.gap.big}px 0`,
  },
  goBackButton: {
    fontSize: '0.875rem !important',
    padding: '0 !important',
    ' > div ': {
      padding: 0,
      display: 'flex',
    },
  },
  goBackButtonIcon: {
    display: 'inline-block',
    fontSize: '1.375rem !important',
    alignSelf: 'center',
    marginRight: variables.gap.xsmall,
    marginLeft: -3,
    marginTop: -2,
  },
});

/**
 * The ForgotPassword component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ForgotPassword = ({ resetPassword, goBack }) => {
  const { classes } = useStyles();
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
    <div className={classes.container}>
      <div className={classes.headline}>
        <I18n.Text string="login.forgot_password" />
      </div>
      { !showSuccess ? (
        <>
          <div className={classes.subline}>
            <I18n.Text string="login.reset_password.subline" />
          </div>
          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              type="email"
              name="email"
              className={classes.input}
              label="login.email"
              value={email}
              onChange={value => setEmail(value)}
              errorText={validationError}
            />
            <div className={classes.buttonContainer}>
              <RippleButton
                className={classes.button}
                type="secondary"
                nativeType="submit"
                disabled={loading}
              >
                <I18n.Text string="common.submit" />
              </RippleButton>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className={classes.resetInstructions}>
            <span
              /* eslint-disable react/no-danger */
              dangerouslySetInnerHTML={{
                __html: i18n.text('login.reset_password.reset_instructions', {
                  email: `<span class="${classes.resetInstructionsEmail}">${email}</span>`,
                }),
              }}
             /* eslint-enable react/no-danger */
            />
          </div>
          <div className={classes.goBackButtonContainer}>
            <RippleButton
              flat
              className={classes.goBackButton}
              type="secondary"
              onClick={handleBackToLogin}
            >
              <ArrowIcon className={classes.goBackButtonIcon} />
              <I18n.Text string="login.reset_password.back_to_login" />
            </RippleButton>
          </div>
        </>
      )}
    </div>
  );
};

ForgotPassword.propTypes = {
  goBack: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
};

export default connect(ForgotPassword);
