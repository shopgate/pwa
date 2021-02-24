import React, {
  useMemo, useState, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import { useScrollTo } from '@shopgate/engage/core/hooks/useScrollTo';
import {
  LoadingProvider, i18n, useAsyncMemo, useRoute,
} from '@shopgate/engage/core';
import {
  ADDRESS_TYPE_BILLING,
  ADDRESS_TYPE_SHIPPING,
  ADDRESS_TYPE_PICKUP,
} from '@shopgate/engage/checkout';
import { extractDefaultValues } from '../../account/helper/form';
import {
  GUEST_CHECKOUT_PATTERN,
  GUEST_CHECKOUT_PAYMENT_PATTERN,
} from '../../checkout/constants/routes';
import Context from './GuestRegistrationProvider.context';
import {
  generateBillingConstraints,
  generateShippingConstraints,
  generatePickupConstraints,
  generateSelfPickupConstraints,
  generateExtraConstraints,
} from './GuestRegistrationProvider.constraints';
import {
  MARKETING_OPT_IN_DEFAULT,
  ELEMENT_ID_BILLING_CONTACT,
  ELEMENT_ID_SHIPPING_CONTACT,
  ELEMENT_ID_SHIPPING_CONTACT_TOGGLE,
  ELEMENT_ID_PICKUP_CONTACT,
} from '../constants';
import connect from './GuestRegistrationProvider.connector';

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

const initialPickupFormState = {
  pickupPerson: 'me',
  firstName: '',
  lastName: '',
  mobile: '',
  emailAddress: '',
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
 * @param {Object} props The provider props
 * @returns {JSX}
 */
const GuestRegistrationProvider = ({
  children,
  formContainerRef,
  isDataReady,
  userLocation,
  customerAttributes,
  billingAddress,
  shippingAddress,
  pickupAddress,
  customer,
  billingPickupEquals,
  billingShippingEquals,
  numberOfAddressLines,
  cartHasDirectShipItems,
  orderReserveOnly,
  orderNeedsPayment,
  isShippingAddressSelectionEnabled,
  isPickupContactSelectionEnabled,
  shopSettings,
  submitGuestRegistration,
  prepareCheckout,
  isLastStackEntry,
  historyPop,
  historyPush,
}) => {
  const { scrollTo } = useScrollTo(formContainerRef);
  const isShippingFormEnabled = useMemo(() => cartHasDirectShipItems, [cartHasDirectShipItems]);

  const getIsShippingFormVisible = useCallback(
    () => isShippingFormEnabled && !!shippingAddress && !billingShippingEquals,
    [billingShippingEquals, isShippingFormEnabled, shippingAddress]
  );

  const [isLocked, setIsLocked] = useState(false);
  const [isBillingFormSubmitted, setIsBillingFormSubmitted] = useState(false);
  const [isShippingFormSubmitted, setIsShippingFormSubmitted] = useState(false);
  const [isExtraFormSubmitted, setIsExtraFormSubmitted] = useState(false);
  const [isPickupFormSubmitted, setIsPickupFormSubmitted] = useState(false);
  const [billingFormRequestErrors, setBillingFormRequestErrors] = useState(null);
  const [shippingFormRequestErrors, setShippingFormRequestErrors] = useState(null);
  const [pickupFormRequestErrors, setPickupFormRequestErrors] = useState(null);
  const [isShippingFormVisible, setIsShippingFormVisible] = useState(getIsShippingFormVisible());
  const [pickupConstraints, setPickupConstraints] = useState(generateSelfPickupConstraints());
  const { query: { edit: guestRegistrationEditMode = null } } = useRoute();

  // Initialize checkout process.
  const [isInitialized] = useAsyncMemo(async () => {
    if (guestRegistrationEditMode) {
      return true;
    }

    try {
      setIsLocked(true);
      await prepareCheckout({
        initializePayment: false,
        initializeOrder: !!isLastStackEntry,
      });
      setIsLocked(false);
      return true;
    } catch (error) {
      setIsLocked(false);
      return false;
    }
  }, [], false);

  useEffect(() => {
    setIsShippingFormVisible(getIsShippingFormVisible());
  }, [getIsShippingFormVisible, setIsShippingFormVisible]);

  // Determine values to prefill some form fields
  const userCountry = useMemo(
    () => userLocation?.country || appConfig?.marketId || null,
    [userLocation]
  );

  const userRegion = useMemo(() => userLocation?.region || null, [userLocation]);

  // ===== billing form =====
  const defaultBillingFormState = useMemo(() => ({
    ...initialBillingFormState,
    country: userCountry,
    region: userRegion,
    ...(pickBy(billingAddress || {}, identity)),
  }), [billingAddress, userCountry, userRegion]);

  const billingConstraints = useMemo(
    () => generateBillingConstraints(orderReserveOnly),
    [orderReserveOnly]
  );

  const handleBillingFormSubmit = useCallback(() => {
    setIsBillingFormSubmitted(true);
  }, [setIsBillingFormSubmitted]);

  const billingFormState = useFormState(
    defaultBillingFormState,
    handleBillingFormSubmit,
    billingConstraints,
    formContainerRef
  );

  // ===== shipping form =====
  const defaultShippingFormState = useMemo(() => ({
    ...initialShippingFormState,
    country: userCountry,
    region: userRegion,
    ...(!billingShippingEquals ? pickBy(shippingAddress || {}, identity) : {}),
  }), [billingShippingEquals, shippingAddress, userCountry, userRegion]);

  const shippingConstraints = useMemo(
    () => (isShippingFormVisible ? generateShippingConstraints() : {}),
    [isShippingFormVisible]
  );

  const handleShippingFormSubmit = useCallback(() => {
    setIsShippingFormSubmitted(true);
  }, [setIsShippingFormSubmitted]);

  const shippingFormState = useFormState(
    defaultShippingFormState,
    handleShippingFormSubmit,
    shippingConstraints,
    formContainerRef
  );

  // ===== pickup contact form =====
  const defaultPickupFormState = useMemo(() => ({
    ...initialPickupFormState,
    ...(!billingPickupEquals ? pickBy(pickupAddress || {}, identity) : {}),
    pickupPerson: billingPickupEquals ? 'me' : 'someoneElse',
  }), [billingPickupEquals, pickupAddress]);

  const handlePickupFormSubmit = useCallback(() => {
    setIsPickupFormSubmitted(true);
  }, []);

  const pickupFormState = useFormState(
    defaultPickupFormState,
    handlePickupFormSubmit,
    pickupConstraints,
    formContainerRef
  );

  useEffect(() => {
    setPickupConstraints(
      pickupFormState.values.pickupPerson === 'me'
        ? generateSelfPickupConstraints()
        : generatePickupConstraints()
    );
  }, [pickupFormState.values.pickupPerson]);

  // ===== extra form =====
  const defaultExtraFormState = useMemo(() => ({
    ...initialOptInFormState,
    ...extractDefaultValues(customer?.attributes || []),
  }), [customer]);

  const extraConstraints = useMemo(
    () => generateExtraConstraints(customerAttributes),
    [customerAttributes]
  );

  const handleExtraFormSubmit = useCallback(() => {
    setIsExtraFormSubmitted(true);
  }, []);

  const extraFormState = useFormState(
    defaultExtraFormState,
    handleExtraFormSubmit,
    extraConstraints,
    formContainerRef
  );

  const handleSubmit = useCallback(() => {
    billingFormState.handleSubmit();
    shippingFormState.handleSubmit();
    pickupFormState.handleSubmit();
    extraFormState.handleSubmit();
  }, [billingFormState, extraFormState, pickupFormState, shippingFormState]);

  useEffect(() => {
    if (
      !isBillingFormSubmitted ||
      !isShippingFormSubmitted ||
      !isPickupFormSubmitted ||
      !isExtraFormSubmitted
    ) {
      return;
    }

    // Break the process when one of the forms has validation errors from the constraints
    if (
      !billingFormState.valid ||
      !shippingFormState.valid ||
      !pickupFormState.valid ||
      !extraFormState.valid
    ) {
      setIsBillingFormSubmitted(false);
      setIsShippingFormSubmitted(false);
      setIsPickupFormSubmitted(false);
      setIsExtraFormSubmitted(false);
    }

    /** Async wrapper for submit registration */
    const fn = async () => {
      setIsLocked(true);
      let response;

      try {
        response = await submitGuestRegistration({
          billingFormData: billingFormState.values,
          ...(isShippingFormVisible ? {
            shippingFormData: shippingFormState.values,
          } : {}),
          ...(isPickupContactSelectionEnabled ? {
            pickupFormData: pickupFormState.values,
          } : {}),
          extraFormData: extraFormState.values,
          processShipping: isShippingAddressSelectionEnabled,
        });
      } catch (e) {
        setIsLocked(false);
        return;
      }

      const { errors } = response || {};

      if (!errors) {
        setIsLocked(false);
        LoadingProvider.setLoading(GUEST_CHECKOUT_PAYMENT_PATTERN);

        if (guestRegistrationEditMode) {
          historyPop();
        } else {
          historyPush({ pathname: GUEST_CHECKOUT_PAYMENT_PATTERN });
        }

        return;
      }

      // Updated the request validation errors
      setBillingFormRequestErrors(errors?.billingFormData || null);
      setShippingFormRequestErrors(errors?.shippingFormData || null);
      setPickupFormRequestErrors(errors?.pickupFormData || null);

      // Release forms for additional submits
      setIsBillingFormSubmitted(false);
      setIsShippingFormSubmitted(false);
      setIsPickupFormSubmitted(false);
      setIsExtraFormSubmitted(false);
      setIsLocked(false);
    };

    fn();
  /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    isBillingFormSubmitted,
    isShippingFormSubmitted,
    isPickupFormSubmitted,
    isExtraFormSubmitted,
  ]);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    billingFormState.scrollToError();
  }, [
    billingFormRequestErrors,
    shippingFormRequestErrors,
    pickupFormRequestErrors,
    billingFormState.scrollToError,
  ]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (isLocked) {
      LoadingProvider.setLoading(GUEST_CHECKOUT_PATTERN);
      return;
    }
    LoadingProvider.unsetLoading(GUEST_CHECKOUT_PATTERN);
  }, [isLocked]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!guestRegistrationEditMode) {
        return;
      }

      let scrollToElement;

      if (guestRegistrationEditMode === ADDRESS_TYPE_BILLING) {
        scrollToElement = ELEMENT_ID_BILLING_CONTACT;
      } else if (guestRegistrationEditMode === ADDRESS_TYPE_SHIPPING) {
        if (isShippingFormVisible) {
          scrollToElement = ELEMENT_ID_SHIPPING_CONTACT;
        } else {
          scrollToElement = ELEMENT_ID_SHIPPING_CONTACT_TOGGLE;
        }
      } else if (guestRegistrationEditMode === ADDRESS_TYPE_PICKUP) {
        scrollToElement = ELEMENT_ID_PICKUP_CONTACT;
      }

      if (scrollToElement) {
        scrollTo(`#${scrollToElement}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  /* eslint-disable react-hooks/exhaustive-deps */
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const value = useMemo(
    () => ({
      isShippingFormEnabled,
      isShippingFormVisible,
      setIsShippingFormVisible,
      orderReserveOnly,
      orderNeedsPayment,
      guestRegistrationEditMode,
      defaultBillingFormState,
      updateBillingForm: billingFormState.setValues,
      defaultShippingFormState,
      updateShippingForm: shippingFormState.setValues,
      defaultPickupFormState,
      updatePickupForm: pickupFormState.setValues,
      defaultExtraFormState,
      updateExtraForm: extraFormState.setValues,
      billingFormValidationErrors: convertValidationErrors(
        billingFormState.validationErrors || billingFormRequestErrors || {}
      ),
      shippingFormValidationErrors: convertValidationErrors(
        shippingFormState.validationErrors || shippingFormRequestErrors || {}
      ),
      pickupFormValidationErrors: convertValidationErrors(
        pickupFormState.validationErrors || pickupFormRequestErrors || {}
      ),
      extraFormValidationErrors: convertValidationErrors(
        extraFormState.validationErrors || {}
      ),
      isShippingAddressSelectionEnabled,
      isPickupContactSelectionEnabled,
      customerAttributes,
      numberOfAddressLines,
      userLocation,
      supportedCountries: shopSettings.supportedCountries,
      isLocked,
      handleSubmit,
    }),
    [
      isShippingFormEnabled,
      isShippingFormVisible,
      defaultBillingFormState,
      billingFormState.setValues,
      billingFormState.validationErrors,
      defaultShippingFormState,
      shippingFormState.setValues,
      shippingFormState.validationErrors,
      defaultExtraFormState,
      extraFormState.setValues,
      extraFormState.validationErrors,
      defaultPickupFormState,
      pickupFormState.setValues,
      pickupFormState.validationErrors,
      billingFormRequestErrors,
      shippingFormRequestErrors,
      pickupFormRequestErrors,
      orderReserveOnly,
      orderNeedsPayment,
      guestRegistrationEditMode,
      isShippingAddressSelectionEnabled,
      isPickupContactSelectionEnabled,
      customerAttributes,
      numberOfAddressLines,
      userLocation,
      shopSettings.supportedCountries,
      isLocked,
      handleSubmit,
    ]
  );

  if (!isDataReady || !isInitialized) {
    return null;
  }

  return (
    <Context.Provider value={value}>
      { children }
    </Context.Provider>
  );
};

GuestRegistrationProvider.propTypes = {
  customerAttributes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  historyPop: PropTypes.func.isRequired,
  historyPush: PropTypes.func.isRequired,
  isDataReady: PropTypes.bool.isRequired,
  isLastStackEntry: PropTypes.bool.isRequired,
  prepareCheckout: PropTypes.func.isRequired,
  shopSettings: PropTypes.shape().isRequired,
  submitGuestRegistration: PropTypes.func.isRequired,
  userLocation: PropTypes.shape().isRequired,
  billingAddress: PropTypes.shape(),
  billingPickupEquals: PropTypes.bool,
  billingShippingEquals: PropTypes.bool,
  cartHasDirectShipItems: PropTypes.bool,
  children: PropTypes.node,
  customer: PropTypes.shape(),
  formContainerRef: PropTypes.shape(),
  isPickupContactSelectionEnabled: PropTypes.bool,
  isShippingAddressSelectionEnabled: PropTypes.bool,
  numberOfAddressLines: PropTypes.number,
  orderNeedsPayment: PropTypes.bool,
  orderReserveOnly: PropTypes.bool,
  pickupAddress: PropTypes.shape(),
  shippingAddress: PropTypes.shape(),
};

GuestRegistrationProvider.defaultProps = {
  children: null,
  customer: null,
  formContainerRef: null,
  billingAddress: null,
  shippingAddress: null,
  pickupAddress: null,
  billingPickupEquals: true,
  billingShippingEquals: true,
  cartHasDirectShipItems: false,
  orderReserveOnly: false,
  orderNeedsPayment: false,
  numberOfAddressLines: null,
  isShippingAddressSelectionEnabled: false,
  isPickupContactSelectionEnabled: false,
};

export default connect(GuestRegistrationProvider);
