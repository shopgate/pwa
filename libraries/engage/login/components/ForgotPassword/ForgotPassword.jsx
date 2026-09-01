import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import {
  I18n, ArrowIcon, Typography,
} from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { StylePresets } from '@shopgate/engage/components/Form';
import TextField from '@shopgate/pwa-ui-shared/TextField';
import { i18n, EUSERNOTFOUND } from '@shopgate/engage/core';
import connect from './ForgotPassword.connector';

const useStyles = makeStyles()(theme => ({
  container: {
    flexGrow: 1,
    padding: theme.spacing(3, 2),
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      width: '50%',
    },
  },
  headline: {
    fontWeight: theme.typography.fontWeightMedium,
    paddingBottom: theme.spacing(2),
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  subline: {
    marginBottom: theme.spacing(2),
    marginTop: 4,
  },
  form: {
    paddingTop: 24,
    ...StylePresets.getOutlinedFormFields(theme),
    ' .simpleInput': {
      paddingLeft: theme.spacing(2),
    },
  },
  buttonContainer: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(3),
  },
  input: {
    ' .label': {
      color: theme.palette.text.secondary,
    },
    ' .placeholder': {
      color: theme.palette.text.secondary,
    },
    ' .simpleInput': {
      color: theme.palette.text.primary,
    },
  },
  resetInstructions: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  resetInstructionsEmail: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.secondary.main,
  },
  goBackButtonContainer: {
    padding: theme.spacing(2, 0),
  },
  goBackButtonIcon: {
    display: 'inline-block',
    fontSize: theme.components.icon.medium,
    alignSelf: 'center',
    marginRight: theme.spacing(0.5),
  },
}));

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
      <Typography variant="h1" component="div" className={classes.headline}>
        <I18n.Text string="login.forgot_password" />
      </Typography>
      { !showSuccess ? (
        <>
          <Typography variant="h4" component="div" color="textSecondary" className={classes.subline}>
            <I18n.Text string="login.reset_password.subline" />
          </Typography>
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
              <Button
                type="submit"
                color="primary"
                fullWidth
                disabled={loading}
              >
                <I18n.Text string="common.submit" />
              </Button>
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
            <Button
              variant="text"
              color="primary"
              onClick={handleBackToLogin}
            >
              <ArrowIcon className={classes.goBackButtonIcon} />
              <I18n.Text string="login.reset_password.back_to_login" />
            </Button>
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
