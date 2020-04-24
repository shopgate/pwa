import React from 'react';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import {
  i18n,
  useAsyncMemo,
  LoadingProvider,
} from '@shopgate/engage/core';
import Context from './GuestRegistrationProvider.context';
import connect from './GuestRegistrationProvider.connector';
import { pickupConstraints, selfPickupConstraints, billingConstraints } from './GuestRegistrationProvider.constraints';
import {
  GUEST_CHECKOUT_PATTERN,
  GUEST_CHECKOUT_PAYMENT_PATTERN,
} from '../constants/routes';

type Props = {
  children: any,
  shopSettings: any,
  billingAddress: any,
  pickupAddress: any,
  userLocation: any,
  isDataReady: bool,
  billingPickupEquals: bool,
  needsPayment: bool,
  initializeCheckout: () => Promise<any>,
  fetchCheckoutOrder: () => Promise<any>,
  updateCheckoutOrder: () => Promise<any>,
  historyPush: (any) => void,
};

const initialPickupPersonState = {
  pickupPerson: 'me',
  firstName: '',
  lastName: '',
  mobile: '',
  emailAddress: '',
};

const initialBillingAddressState = {
  firstName: '',
  lastName: '',
  mobile: '',
  emailAddress: '',
  address1: '',
  address2: '',
  city: '',
  postalCode: '',
  country: null,
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
const GuestRegistrationProvider = ({
  historyPush,
  initializeCheckout,
  fetchCheckoutOrder,
  updateCheckoutOrder,
  billingPickupEquals,
  children,
  shopSettings,
  billingAddress,
  pickupAddress,
  userLocation,
  isDataReady,
  needsPayment,
}: Props) => {
  const [isLocked, setLocked] = React.useState(false);
  const pickupFormSubmitValues = React.useRef({});
  const [pickupValidationRules, setPickupValidationRules] = React.useState(selfPickupConstraints);

  // Initialize checkout process.
  const [isInitialized] = useAsyncMemo(async () => {
    LoadingProvider.setLoading(GUEST_CHECKOUT_PATTERN);
    await initializeCheckout();
    await fetchCheckoutOrder();
    LoadingProvider.resetLoading(GUEST_CHECKOUT_PATTERN);
    return true;
  }, [], false);

  // Create initial values for billing and pickup forms.
  const defaultPickupPersonState = React.useMemo(() => ({
    ...initialPickupPersonState,
    ...(pickBy(pickupAddress || {}, identity)),
    pickupPerson: billingPickupEquals ? 'me' : 'someone_else',
  }), [billingPickupEquals, pickupAddress]);

  const defaultBillingAddressState = React.useMemo(() => ({
    ...initialBillingAddressState,
    ...(pickBy(billingAddress || {}, identity)),
  }), [billingAddress]);

  // Handles submit of the checkout form.
  const handleSubmit = React.useCallback(async (values) => {
    /** Async wrapper for useCallback */
    setLocked(true);

    const pickupFormValues = pickupFormSubmitValues.current;
    const newBillingAddress = {
      type: 'billing',
      firstName: values.firstName,
      lastName: values.lastName,
      mobile: values.mobile,
      emailAddress: values.emailAddress,
      company: values.company || undefined,
      address1: values.address1,
      address2: values.address2 || undefined,
      country: values.country,
      postalCode: values.postalCode,
      city: values.city,
      region: values.region,
    };

    // Update order to set pickup contact.
    await updateCheckoutOrder({
      notes: values.instructions,
      addressSequences: [
        newBillingAddress,
        // When the customer is picking up himself we just take the
        // billing address as pickup address.
        pickupFormValues.pickupPerson === 'me' ? {
          ...newBillingAddress,
          type: 'pickup',
        } : {
          type: 'pickup',
          firstName: pickupFormValues.firstName,
          lastName: pickupFormValues.lastName,
          mobile: pickupFormValues.mobile,
          emailAddress: pickupFormValues.emailAddress,
        },
      ],
      primaryBillToAddressSequenceIndex: 0,
      primaryShipToAddressSequenceIndex: 1,
    });

    LoadingProvider.setLoading(GUEST_CHECKOUT_PAYMENT_PATTERN);
    historyPush({ pathname: GUEST_CHECKOUT_PAYMENT_PATTERN });

    // We don't set locked to false to avoid unnecessary UI changes right before
    // going to checkout page.
  }, [historyPush, updateCheckoutOrder]);

  // Whenever the order is locked we also want to show to loading bar.
  React.useEffect(() => {
    if (isLocked) {
      LoadingProvider.setLoading(GUEST_CHECKOUT_PATTERN);
      return;
    }
    LoadingProvider.unsetLoading(GUEST_CHECKOUT_PATTERN);
  }, [isLocked]);

  // Hold form states.
  const formBillingState = useFormState(
    defaultBillingAddressState,
    handleSubmit,
    billingConstraints
  );

  const handlePickupSubmit = React.useCallback((values) => {
    pickupFormSubmitValues.current = values;
    formBillingState.handleSubmit(new Event('submit'));
  }, [formBillingState]);

  const formPickupState = useFormState(
    defaultPickupPersonState,
    handlePickupSubmit,
    pickupValidationRules
  );

  // When "someone-else" is picked for pickup the validation rules need to change.
  React.useEffect(() => {
    setPickupValidationRules(
      formPickupState.values.pickupPerson === 'me'
        ? selfPickupConstraints
        : pickupConstraints
    );
  }, [formPickupState.values.pickupPerson]);

  // Create memoized context value.
  const value = React.useMemo(() => ({
    isLocked,
    supportedCountries: shopSettings.supportedCountries,
    formPickupValidationErrors: convertValidationErrors(formPickupState.validationErrors || {}),
    formPickupSetValues: formPickupState.setValues,
    handleSubmit: formPickupState.handleSubmit,
    formBillingValidationErrors: convertValidationErrors(formBillingState.validationErrors || {}),
    formBillingSetValues: formBillingState.setValues,
    handleSubmitBilling: formBillingState.handleSubmit,
    defaultPickupPersonState,
    defaultBillingAddressState,
    userLocation,
    billingAddress,
    needsPayment,
  }), [
    isLocked,
    shopSettings.supportedCountries,
    formPickupState.validationErrors,
    formPickupState.setValues,
    formPickupState.handleSubmit,
    formBillingState.validationErrors,
    formBillingState.setValues,
    formBillingState.handleSubmit,
    defaultPickupPersonState,
    defaultBillingAddressState,
    userLocation,
    billingAddress,
    needsPayment,
  ]);

  if (!isDataReady || !isInitialized) {
    return null;
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export default connect(GuestRegistrationProvider);
