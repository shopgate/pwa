import React, { useMemo, useCallback } from 'react';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import {
  FormBuilder, I18n, Link, RippleButton, MessageBar, ResponsiveContainer,
} from '@shopgate/engage/components';
import { LOGIN_PATH, useRoute, i18n } from '@shopgate/engage/core';
import { StylePresets } from '@shopgate/engage/components/Form';
import generateFormConfig from './OrderDetailsAuthenticateForm.config';
import { useOrderDetails } from '../../hooks';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  container: {
    padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      width: '50%',
    },
  },
  form: {
    ...StylePresets.OUTLINED_FORM_FIELDS,
  },
  submitButton: {
    width: '100%',
  },
  loginLink: {
    color: 'var(--color-primary)',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  messageBarContainer: {
    margin: 0,
  },
});

/**
 * @returns {JSX}
 */
const OrderDetailsAuthenticate = () => {
  const { classes } = useStyles();
  const { pathname } = useRoute();
  const {
    supportedCountries,
    countrySortOrder,
    userLocation,
    validationErrors,
    updateForm,
    showForm,
    handleSubmit,
    defaultFormState,
    isUserLoggedIn,
    isLoading,
    errorMessage,
  } = useOrderDetails();

  const formConfig = useMemo(
    () => generateFormConfig({
      supportedCountries,
      countrySortOrder,
      userLocation,
    }),
    [countrySortOrder, supportedCountries, userLocation]
  );

  const handleUpdate = useCallback((values) => {
    updateForm(values);
  }, [updateForm]);

  const messages = useMemo(() => {
    if (!errorMessage) {
      return null;
    }

    return [{
      type: 'error',
      message: errorMessage,
    }];
  }, [errorMessage]);

  if (!showForm && !messages) {
    return null;
  }

  return (
    <>
      <ResponsiveContainer appAlways breakpoint="<=xs">
        { messages && (
        <MessageBar
          messages={messages}
          showIcons
          classNames={{ container: classes.messageBarContainer }}
        />
        )}
      </ResponsiveContainer>
      <div className={classes.container}>
        <ResponsiveContainer webOnly breakpoint=">xs">
          { messages && (
            <MessageBar
              messages={messages}
              showIcons
              classNames={{ container: classes.messageBarContainer }}
            />
          )}
        </ResponsiveContainer>
        { showForm && (
        <>
          <p>
            <I18n.Text string="order_details.authenticate.instructions" />
            { !isUserLoggedIn && (
            <>
              {' '}
              <Link
                className={classes.loginLink}
                tag="span"
                href={LOGIN_PATH}
                state={{ redirect: { location: pathname } }}
              >
                <I18n.Text string="order_details.authenticate.or_login" />
              </Link>
            </>
            )}
          </p>

          <FormBuilder
            className={classes.form}
            name="orderDetailsAuthenticate"
            config={formConfig}
            defaults={defaultFormState}
            validationErrors={validationErrors}
            handleUpdate={handleUpdate}
            onSubmit={handleSubmit}
          />
          <div>
            <RippleButton
              type="secondary"
              onClick={handleSubmit}
              disabled={isLoading}
              className={classes.submitButton}
            >
              {i18n.text('common.submit')}
            </RippleButton>
          </div>
        </>
        )}

      </div>
    </>

  );
};

export default OrderDetailsAuthenticate;
