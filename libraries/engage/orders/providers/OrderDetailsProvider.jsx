import React, {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
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
  cancelOrder,
  children,
}) => {
  const { pathname } = useRoute();
  const [showForm, setShowForm] = useState(!isUserLoggedIn);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const orderTokenCookie = [`shopgate_order_token_${orderId}`];
  const [cookies, setCookie] = useCookies([orderTokenCookie]);
  const orderToken = cookies[orderTokenCookie];

  // Form visibility
  useEffect(() => {
    if (isUserLoggedIn) {
      setShowForm(errorMessage);
    } else {
      setShowForm((!order && !orderToken) || errorMessage);
    }
  }, [errorMessage, isUserLoggedIn, order, orderToken]);

  const handleRequest = useCallback(async (email, phone, token) => {
    setIsLoading(true);
    let message;

    try {
      const response = await fetchOrderDetails(orderId, {
        email,
        phone,
        token,
      });

      if (response.token && response.tokenExpires) {
        setCookie(orderTokenCookie, response.token, {
          expires: new Date(response.tokenExpires),
        });
      }
      setErrorMessage('');
    } catch (error) {
      const { code } = error;
      if (code === EUNAUTHORIZED) {
        message = 'order_details.errors.authorize';
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
  }, [fetchOrderDetails, orderTokenCookie, orderId, setCookie]);

  const handleCancel = useCallback(async () => {
    setIsLoading(true);
    let message;

    try {
      await cancelOrder(orderId, orderToken);
      setErrorMessage('');
    } catch (error) {
      const { code } = error;
      if (code === EAUTHENTICATION) {
        message = 'order_details.errors.expired';
      } else if (code === ENOTFOUND) {
        message = 'order_details.errors.not_found';
      }
    }

    if (message) {
      setErrorMessage(i18n.text(message));
    }

    setIsLoading(false);
  }, [cancelOrder, orderId, orderToken]);

  // Loading state
  useEffect(() => {
    if (isLoading) {
      LoadingProvider.setLoading(pathname);
      return;
    }

    LoadingProvider.unsetLoading(pathname);
  }, [isLoading, pathname]);

  useEffect(() => {
    if (!isUserLoggedIn && !orderToken) {
      return;
    }

    (async () => {
      await handleRequest(undefined, undefined, !isUserLoggedIn ? orderToken : undefined);
    })();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */
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
      cancelOrder: handleCancel,
      errorMessage,
    }),
    [
      authenticateFormState.setValues,
      authenticateFormState.validationErrors,
      fetchOrderDetails,
      handleCancel,
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
  cancelOrder: PropTypes.func.isRequired,
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
