import React, { useMemo, useCallback, Fragment } from 'react';
import {
  FormBuilder, I18n, Link, RippleButton, MessageBar, ResponsiveContainer,
} from '@shopgate/engage/components';
import { LOGIN_PATH, useRoute, i18n } from '@shopgate/engage/core';
import generateFormConfig from './OrderDetailsAuthenticateForm.config';
import { useOrderDetails } from '../../hooks';
import {
  container, form, submitButton, loginLink, messageBarContainer,
} from './OrderDetailsAuthenticate.style';

/**
 * @returns {JSX}
 */
const OrderDetailsAuthenticate = () => {
  const { pathname } = useRoute();
  const {
    supportedCountries,
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
    () => generateFormConfig(supportedCountries, userLocation),
    [supportedCountries, userLocation]
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
    <Fragment>
      <ResponsiveContainer appAlways breakpoint="<=xs">
        { messages && (
        <MessageBar
          messages={messages}
          showIcons
          classNames={{ container: messageBarContainer }}
        />
        )}
      </ResponsiveContainer>
      <div className={container}>
        <ResponsiveContainer webOnly breakpoint=">xs">
          { messages && (
            <MessageBar
              messages={messages}
              showIcons
              classNames={{ container: messageBarContainer }}
            />
          )}
        </ResponsiveContainer>
        { showForm && (
        <Fragment>
          <p>
            <I18n.Text string="order_details.authenticate.instructions" />
            { !isUserLoggedIn && (
            <Fragment>
              {' '}
              <Link
                className={loginLink}
                tag="span"
                href={LOGIN_PATH}
                state={{ redirect: { location: pathname } }}
              >
                <I18n.Text string="order_details.authenticate.or_login" />
              </Link>
            </Fragment>
            )}
          </p>

          <FormBuilder
            className={form}
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
              className={submitButton}
            >
              {i18n.text('common.submit')}
            </RippleButton>
          </div>
        </Fragment>
        )}

      </div>
    </Fragment>

  );
};

export default OrderDetailsAuthenticate;
