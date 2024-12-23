import React, {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import { REGISTER_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import {
  LoadingProvider,
  i18n,
  useRoute,
  SHOP_SETTING_REGISTRATION_MODE_SIMPLE,
} from '@shopgate/engage/core';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { extractDefaultValues } from '../../account/helper/form';
import Context from './RegistrationProvider.context';
import {
  generateBaseConstraints,
  generateBillingConstraints,
  generateShippingConstraints,
  generateExtraConstraints,
} from './RegistrationProvider.constraints';
import connect from './RegistrationProvider.connector';
import { MARKETING_OPT_IN_DEFAULT } from '../constants';

type Props = {
  children: any,
  shopSettings: any,
  userLocation: any,
  customerAttributes: any,
  isDataReady: bool,
  registrationMode: string,
  cartHasDirectShipItems?: bool,
  numberOfAddressLines?: number,
  submitRegistration: () => Promise<any>,
  formContainerRef?: any,
};

const initialBaseFormState = {
  emailAddress: '',
  password: '',
  passwordConfirm: '',
};

const initialAddressFormState = {
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

const initialBillingFormState = {
  ...initialAddressFormState,
};

const initialShippingFormState = {
  ...initialAddressFormState,
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
  cartHasDirectShipItems,
  shopSettings,
  userLocation,
  customerAttributes,
  numberOfAddressLines,
  registrationMode,
  submitRegistration,
  children,
  formContainerRef,
}: Props) => {
  const [isLocked, setLocked] = useState(false);
  const [isBaseFormSubmitted, setIsBaseFormSubmitted] = useState(false);
  const [isBillingFormSubmitted, setIsBillingFormSubmitted] = useState(false);
  const [isShippingFormSubmitted, setIsShippingFormSubmitted] = useState(false);
  const [isExtraFormSubmitted, setIsExtraFormSubmitted] = useState(false);
  const [baseFormRequestErrors, setBaseFormRequestErrors] = useState(null);
  const [billingFormRequestErrors, setBillingFormRequestErrors] = useState(null);
  const [shippingFormRequestErrors, setShippingFormRequestErrors] = useState(null);
  const [extraFormRequestErrors, setExtraFormRequestErrors] = useState(null);
  const [isShippingFormVisible, setIsShippingFormVisible] = useState(false);
  const { query } = useRoute();

  const isShippingAddressSelectionEnabled = useMemo(
    () =>
      query?.checkout &&
      cartHasDirectShipItems &&
      registrationMode !== SHOP_SETTING_REGISTRATION_MODE_SIMPLE,
    [cartHasDirectShipItems, query, registrationMode]
  );

  const isBillingAddressSelectionEnabled = useMemo(
    () => registrationMode !== SHOP_SETTING_REGISTRATION_MODE_SIMPLE,
    [registrationMode]
  );

  // Determine values to prefill some form fields
  const userCountry = useMemo(
    () => userLocation?.country || appConfig?.marketId || null,
    [userLocation]
  );

  const userRegion = useMemo(() => userLocation?.region || null, [userLocation]);

  const baseConstraints = useMemo(
    () => generateBaseConstraints({ registrationMode }),
    [registrationMode]
  );

  const billingConstraints = useMemo(
    () => generateBillingConstraints({ registrationMode }),
    [registrationMode]
  );

  const shippingConstraints = useMemo(
    () => generateShippingConstraints({ registrationMode }),
    [registrationMode]
  );

  const extraConstraints = useMemo(
    () => generateExtraConstraints(customerAttributes), [customerAttributes]
  );

  // Default form states
  const defaultBaseFormState = {
    ...initialBaseFormState,
  };

  const defaultBillingFormState = useMemo(() => ({
    ...initialBillingFormState,
    country: userCountry,
    region: userRegion,
  }), [userCountry, userRegion]);

  const defaultShippingFormState = useMemo(() => ({
    ...initialShippingFormState,
    country: userCountry,
    region: userRegion,
  }), [userCountry, userRegion]);

  const defaultExtraFormState = useMemo(() => ({
    ...initialOptInFormState,
    ...extractDefaultValues(customerAttributes),
  }), [customerAttributes]);

  // Form submit handlers
  const handleBaseFormSubmit = useCallback(() => {
    setIsBaseFormSubmitted(true);
  }, [setIsBaseFormSubmitted]);

  const handleBillingFormSubmit = useCallback(() => {
    setIsBillingFormSubmitted(true);
  }, [setIsBillingFormSubmitted]);

  const handleShippingFormSubmit = useCallback(() => {
    setIsShippingFormSubmitted(true);
  }, [setIsShippingFormSubmitted]);

  const handleExtraFormSubmit = useCallback(() => {
    setIsExtraFormSubmitted(true);
  }, []);

  // Form states
  const baseFormState = useFormState(
    defaultBaseFormState,
    handleBaseFormSubmit,
    baseConstraints,
    formContainerRef
  );

  const billingFormState = useFormState(
    defaultBillingFormState,
    handleBillingFormSubmit,
    billingConstraints,
    formContainerRef
  );

  const shippingFormState = useFormState(
    defaultShippingFormState,
    handleShippingFormSubmit,
    shippingConstraints,
    formContainerRef
  );

  const extraFormState = useFormState(
    defaultExtraFormState,
    handleExtraFormSubmit,
    extraConstraints,
    formContainerRef
  );

  // Central submit handler
  const handleSubmit = useCallback(() => {
    baseFormState.handleSubmit(new Event('submit'));
    billingFormState.handleSubmit(new Event('submit'));
    shippingFormState.handleSubmit(new Event('submit'));
    extraFormState.handleSubmit(new Event('submit'));
  }, [baseFormState, billingFormState, extraFormState, shippingFormState]);

  useEffect(() => {
    // Break the process when the forms are not submitted yet
    if (
      !isBaseFormSubmitted ||
      !isBillingFormSubmitted ||
      !isShippingFormSubmitted ||
      !isExtraFormSubmitted
    ) {
      return;
    }

    // Break the process when one of the forms has validation errors from the constraints
    if (
      !baseFormState.valid ||
      !billingFormState.valid ||
      (isShippingFormVisible && !shippingFormState.valid) ||
      !extraFormState.valid
    ) {
      setIsBaseFormSubmitted(false);
      setIsBillingFormSubmitted(false);
      setIsShippingFormSubmitted(false);
      setIsExtraFormSubmitted(false);
      return;
    }

    /** Async wrapper for submit registration */
    const fn = async () => {
      setLocked(true);

      const response = await submitRegistration({
        baseFormData: baseFormState.values,
        billingFormData: billingFormState.values,
        additionalFormData: extraFormState.values,
        ...(isShippingFormVisible ? {
          shippingFormData: shippingFormState.values,
        } : {}),
      });

      const { errors } = response || {};

      // Updated the request validation errors
      setBaseFormRequestErrors(errors?.baseFormData || null);
      setBillingFormRequestErrors(errors?.billingFormData || null);
      setShippingFormRequestErrors(errors?.shippingFormData || null);
      setExtraFormRequestErrors(errors?.extraFormData || null);

      // Release forms for additional submits
      setIsBaseFormSubmitted(false);
      setIsBillingFormSubmitted(false);
      setIsShippingFormSubmitted(false);
      setIsExtraFormSubmitted(false);
      setLocked(false);
    };

    fn();
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    isBaseFormSubmitted,
    isBillingFormSubmitted,
    isShippingFormSubmitted,
    isExtraFormSubmitted,
    baseFormState.valid,
    billingFormState.valid,
    shippingFormState.valid,
    extraFormState.valid,
    isShippingFormVisible,
    submitRegistration,
  ]);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    baseFormState.scrollToError();
  }, [
    baseFormRequestErrors,
    billingFormRequestErrors,
    shippingFormRequestErrors,
    baseFormState.scrollToError,
  ]);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    shippingFormState.setIgnoreErrors(!isShippingFormVisible);
  }, [isShippingFormVisible]);
  /* eslint-enable react-hooks/exhaustive-deps */

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
      countrySortOrder: shopSettings.countrySortOrder || [],
      customerAttributes,
      userLocation,
      defaultBaseFormState,
      defaultBillingFormState,
      defaultShippingFormState,
      defaultExtraFormState,
      baseFormValidationErrors: convertValidationErrors(
        baseFormState.validationErrors || baseFormRequestErrors || {}
      ),
      billingFormValidationErrors: convertValidationErrors(
        billingFormState.validationErrors || billingFormRequestErrors || {}
      ),
      shippingFormValidationErrors: convertValidationErrors(
        shippingFormState.validationErrors || shippingFormRequestErrors || {}
      ),
      extraFormValidationErrors: convertValidationErrors(
        extraFormState.validationErrors || extraFormRequestErrors || {}
      ),
      handleSubmit,
      updateBaseForm: baseFormState.setValues,
      updateBillingForm: billingFormState.setValues,
      updateShippingForm: shippingFormState.setValues,
      updateExtraForm: extraFormState.setValues,
      isShippingAddressSelectionEnabled,
      isBillingAddressSelectionEnabled,
      isShippingFormVisible,
      setIsShippingFormVisible,
      numberOfAddressLines,
      registrationMode,
    }),
    [
      shopSettings.supportedCountries,
      shopSettings.countrySortOrder,
      customerAttributes,
      userLocation,
      defaultBaseFormState,
      defaultBillingFormState,
      defaultShippingFormState,
      baseFormState.validationErrors,
      baseFormState.setValues,
      baseFormRequestErrors,
      billingFormState.validationErrors,
      billingFormState.setValues,
      billingFormRequestErrors,
      shippingFormState.validationErrors,
      shippingFormState.setValues,
      shippingFormRequestErrors,
      handleSubmit,
      defaultExtraFormState,
      extraFormState.setValues,
      extraFormState.validationErrors,
      extraFormRequestErrors,
      isShippingAddressSelectionEnabled,
      isBillingAddressSelectionEnabled,
      isShippingFormVisible,
      setIsShippingFormVisible,
      numberOfAddressLines,
      registrationMode,
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

RegistrationProvider.defaultProps = {
  formContainerRef: null,
  cartHasDirectShipItems: false,
  numberOfAddressLines: null,
};

export default connect(RegistrationProvider);
