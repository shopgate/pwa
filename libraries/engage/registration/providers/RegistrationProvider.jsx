import React, {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import { REGISTER_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { LoadingProvider, i18n } from '@shopgate/engage/core';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import appConfig from '@shopgate/pwa-common/helpers/config';
import Context from './RegistrationProvider.context';
import { baseConstraints, shippingConstraints } from './RegistrationProvider.constraints';
import connect from './RegistrationProvider.connector';
import { MARKETING_OPT_IN_DEFAULT } from '../constants';

type Props = {
  children: any,
  shopSettings: any,
  userLocation: any,
  isDataReady: bool,
  submitRegistration: () => Promise<any>,
};

const initialBaseFormState = {
  emailAddress: '',
  password: '',
  passwordConfirm: '',
};

const initialShippingFormState = {
  firstName: '',
  lastName: '',
  company: '',
  address1: '',
  address2: '',
  city: '',
  country: '',
  postalCode: '',
  mobile: '',
};

const initialOptInFormState = {
  marketingOptIn: MARKETING_OPT_IN_DEFAULT,
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
 * Registration Provider
 * @returns {JSX}
 */
const RegistrationProvider = ({
  isDataReady,
  shopSettings,
  userLocation,
  submitRegistration,
  children,
}: Props) => {
  const [isLocked, setLocked] = useState(false);
  const [isBaseFormSubmitted, setIsBaseFormSubmitted] = useState(false);
  const [isShippingFormSubmitted, setIsShippingFormSubmitted] = useState(false);
  const [baseFormRequestErrors, setBaseFormRequestErrors] = useState(null);
  const [shippingFormRequestErrors, setShippingFormRequestErrors] = useState(null);

  // Determine values to prefill some form fields
  const userCountry = useMemo(
    () => userLocation?.country || appConfig?.marketId || null,
    [userLocation]
  );

  const userRegion = useMemo(() => userLocation?.region || null, [userLocation]);

  // Default form states
  const defaultBaseFormState = {
    ...initialBaseFormState,
  };

  const defaultShippingFormState = useMemo(() => ({
    ...initialShippingFormState,
    country: userCountry,
    region: userRegion,
  }), [userCountry, userRegion]);

  const defaultOptInFormState = {
    ...initialOptInFormState,
  };

  // Form submit handlers
  const handleBaseFormSubmit = useCallback(() => {
    setIsBaseFormSubmitted(true);
  }, [setIsBaseFormSubmitted]);

  const handleShippingFormSubmit = useCallback(() => {
    setIsShippingFormSubmitted(true);
  }, [setIsShippingFormSubmitted]);

  // Form states
  const baseFormState = useFormState(
    defaultBaseFormState,
    handleBaseFormSubmit,
    baseConstraints
  );

  const shippingFormState = useFormState(
    defaultShippingFormState,
    handleShippingFormSubmit,
    shippingConstraints
  );

  const optInFormState = useFormState(
    defaultOptInFormState,
    () => {}
  );

  // Central submit handler
  const handleSubmit = useCallback(() => {
    baseFormState.handleSubmit(new Event('submit'));
    shippingFormState.handleSubmit(new Event('submit'));
  }, [baseFormState, shippingFormState]);

  useEffect(() => {
    // Break the process when both forms are not submitted yet
    if (!isBaseFormSubmitted || !isShippingFormSubmitted) {
      return;
    }

    // Break the process when one of the forms has validation errors from the constraints
    if (!baseFormState.valid || !shippingFormState.valid) {
      setIsBaseFormSubmitted(false);
      setIsShippingFormSubmitted(false);
      return;
    }

    /** Async wrapper for submit registration */
    const fn = async () => {
      setLocked(true);

      const { marketingOptIn } = optInFormState.values;

      const response = await submitRegistration(
        baseFormState.values,
        shippingFormState.values,
        { marketingOptIn }
      );

      const { errors } = response || {};

      // Updated the request validation errors
      setBaseFormRequestErrors(errors?.baseFormData || null);
      setShippingFormRequestErrors(errors?.shippingFormData || null);

      // Release forms for additional submits
      setIsBaseFormSubmitted(false);
      setIsShippingFormSubmitted(false);
      setLocked(false);
    };

    fn();
  }, [
    baseFormState.valid,
    baseFormState.validationErrors,
    baseFormState.values,
    shippingFormState.valid,
    shippingFormState.values,
    isBaseFormSubmitted,
    isShippingFormSubmitted,
    submitRegistration,
    optInFormState.values,
  ]);

  useEffect(() => {
    if (isLocked) {
      LoadingProvider.setLoading(REGISTER_PATH);
      return;
    }
    LoadingProvider.unsetLoading(REGISTER_PATH);
  }, [isLocked]);

  const value = useMemo(
    () => ({
      supportedCountries: shopSettings.supportedCountries || [],
      userLocation,
      defaultBaseFormState,
      defaultShippingFormState,
      defaultOptInFormState,
      baseFormValidationErrors: convertValidationErrors(
        baseFormState.validationErrors || baseFormRequestErrors || {}
      ),
      shippingFormValidationErrors: convertValidationErrors(
        shippingFormState.validationErrors || shippingFormRequestErrors || {}
      ),
      handleSubmit,
      updateBaseForm: baseFormState.setValues,
      updateShippingForm: shippingFormState.setValues,
      updateOptInForm: optInFormState.setValues,
    }),
    [
      shopSettings.supportedCountries,
      userLocation,
      defaultBaseFormState,
      defaultShippingFormState,
      defaultOptInFormState,
      baseFormState.validationErrors,
      baseFormState.setValues,
      baseFormRequestErrors,
      shippingFormState.validationErrors,
      shippingFormState.setValues,
      shippingFormRequestErrors,
      handleSubmit,
      optInFormState.setValues,
    ]
  );

  if (!isDataReady) {
    return null;
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export default connect(RegistrationProvider);
