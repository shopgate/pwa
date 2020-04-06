import React from 'react';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import { i18n } from '@shopgate/engage/core';
import Context from './CheckoutProvider.context';
import connect from './CheckoutProvider.connector';
import { pickupConstraints } from './CheckoutProvider.constraints';

type Props = {
  children: any,
  shopSettings: any,
  userLocation: any,
  isReady: bool,
};

const defaultPickupPersonState = {
  pickupPerson: 'me',
  firstName: '',
  lastName: '',
  cellPhone: '',
  email: '',
  firstName2: '',
  lastName2: '',
  cellPhone2: '',
  email2: '',
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
 * Checkout Provider
 * @returns {JSX}
 */
const CheckoutProvider = ({
  children,
  shopSettings,
  userLocation,
  isReady,
}: Props) => {
  // Hold form states.
  const formState = useFormState(
    defaultPickupPersonState,
    () => {},
    pickupConstraints
  );

  // Create memoized context value.
  const value = React.useMemo(() => ({
    supportedCountries: shopSettings.supportedCountries,
    formValidationErrors: convertValidationErrors(formState.validationErrors || {}),
    formSetValues: formState.setValues,
    handleSubmitOrder: formState.handleSubmit,
    defaultPickupPersonState,
    userLocation,
  }), [
    formState.setValues,
    formState.validationErrors,
    formState.handleSubmit,
    shopSettings.supportedCountries,
    userLocation,
  ]);

  if (!isReady) {
    return null;
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export default connect(CheckoutProvider);
