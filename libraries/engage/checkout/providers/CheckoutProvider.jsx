import React from 'react';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
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
    message: validationErrors[key],
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
    null,
    pickupConstraints
  );

  // Create memoized context value.
  const value = React.useMemo(() => ({
    supportedCountries: shopSettings.supportedCountries,
    userLocation,
    defaultPickupPersonState,
    formValidationErrors: convertValidationErrors(formState.validationErrors || {}),
    formSetValues: formState.setValues,
  }), [
    formState.setValues,
    formState.validationErrors,
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
