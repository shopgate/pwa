import React, {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  useRoute, i18n, LoadingProvider, EUNAUTHORIZED, EAUTHENTICATION, ENOTFOUND,
} from '@shopgate/engage/core';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import { authenticateConstraints } from './OrderDetailsProvider.constraints';
import connect from './OrderDetailsProvider.connector';
import Context from './OrderDetailsProvider.context';

const defaultFormState = {
  email: '',
  phone: '',
};

/**
 * Converts validation errors into errors for form builder.
 * @param {Object} validationErrors The validation errors.
 * @returns {Array}
 */
const convertValidationErrors = validationErrors => Object
  .keys(validationErrors)
  .map(key => ({
    path: key,
    message: i18n.text(validationErrors[key]),
  }));

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const OrderDetailsProvider = ({
  isUserLoggedIn,
  order,
  orderId,
  shopSettings,
  userLocation,
  fetchOrderDetails,
  children,
}) => {
  const { pathname } = useRoute();
  const [showForm, setShowForm] = useState(!isUserLoggedIn);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form visibility
  useEffect(() => {
    if (isUserLoggedIn) {
      setShowForm(errorMessage);
    } else {
      setShowForm(!order || errorMessage);
    }
  }, [errorMessage, isUserLoggedIn, order]);

  const handleRequest = useCallback(async (email, phone) => {
    setIsLoading(true);
    let message;

    try {
      await fetchOrderDetails(orderId, {
        email,
        phone,
      });

      setErrorMessage('');
    } catch (error) {
      const { code } = error;
      if (code === EUNAUTHORIZED) {
        message = 'order_details.errors.authorize';
        setErrorMessage();
      } else if (code === EAUTHENTICATION) {
        message = 'order_details.errors.authenticate';
      } else if (code === ENOTFOUND) {
        message = 'order_details.errors.not_found';
      }
    }

    if (message) {
      setErrorMessage(i18n.text(message));
    }

    setIsLoading(false);
  }, [fetchOrderDetails, orderId]);

  // Loading state
  useEffect(() => {
    if (isLoading) {
      LoadingProvider.setLoading(pathname);
      return;
    }

    LoadingProvider.unsetLoading(pathname);
  }, [isLoading, pathname]);

  useEffect(() => {
    if (!isUserLoggedIn) {
      return;
    }

    (async () => {
      await handleRequest();
    })();
  }, [handleRequest, isUserLoggedIn]);

  let authenticateFormState = {
    valid: false,
    values: [],
  };

  // Authentication form
  const handleAuthenticateFormSubmit = useCallback(async () => {
    if (!authenticateFormState.valid) {
      return;
    }

    const { email, phone } = authenticateFormState.values;
    await handleRequest(email, phone);
  }, [authenticateFormState.valid, authenticateFormState.values, handleRequest]);

  authenticateFormState = useFormState(
    defaultFormState,
    handleAuthenticateFormSubmit,
    authenticateConstraints
  );

  const handleSubmit = useCallback(() => {
    authenticateFormState.handleSubmit(new Event('submit'));
  }, [authenticateFormState]);

  const value = useMemo(
    () => ({
      isUserLoggedIn,
      order,
      handleSubmit,
      isLoading,
      showForm,
      supportedCountries: shopSettings.supportedCountries,
      validationErrors: convertValidationErrors(
        authenticateFormState.validationErrors || {}
      ),
      updateForm: authenticateFormState.setValues,
      defaultFormState,
      userLocation,
      fetchOrderDetails,
      errorMessage,
    }),
    [
      authenticateFormState.setValues,
      authenticateFormState.validationErrors,
      fetchOrderDetails,
      handleSubmit,
      isUserLoggedIn,
      showForm,
      isLoading,
      order,
      shopSettings.supportedCountries,
      userLocation,
      errorMessage,
    ]
  );

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

OrderDetailsProvider.propTypes = {
  fetchOrderDetails: PropTypes.func.isRequired,
  isUserLoggedIn: PropTypes.bool.isRequired,
  children: PropTypes.node,
  order: PropTypes.shape(),
  orderId: PropTypes.string,
  shopSettings: PropTypes.shape(),
  userLocation: PropTypes.shape(),
};

OrderDetailsProvider.defaultProps = {
  children: null,
  shopSettings: null,
  userLocation: null,
  order: null,
  orderId: null,
};

export default connect(OrderDetailsProvider);
