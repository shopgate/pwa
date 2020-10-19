import React, { useMemo } from 'react';
import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import identity from 'lodash/identity';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { useFormState } from '@shopgate/engage/core/hooks/useFormState';
import {
  i18n,
  useAsyncMemo,
  LoadingProvider,
  useRoute,
} from '@shopgate/engage/core';
import { generateFormConstraints, extractAttributes } from '@shopgate/engage/account/helper/form';
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
  requiredFields: any,
  needsPayment: bool,
  customerAttributes: any,
  orderReserveOnly?: bool,
  prepareCheckout: () => Promise<any>,
  updateCheckoutOrder: () => Promise<any>,
  historyPush: (any) => void,
  historyPop: (any) => void,
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
  country: '',
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
  prepareCheckout,
  historyPush,
  historyPop,
  updateCheckoutOrder,
  billingPickupEquals,
  requiredFields,
  children,
  shopSettings,
  billingAddress,
  pickupAddress,
  userLocation,
  isDataReady,
  needsPayment,
  orderReserveOnly,
  customerAttributes,
}: Props) => {
  const [isLocked, setLocked] = React.useState(false);
  const pickupFormSubmitValues = React.useRef({});
  const [pickupValidationRules, setPickupValidationRules] = React.useState(selfPickupConstraints);
  const { query: { edit: isGuestCheckoutEditMode = null } } = useRoute();

  // Initialize checkout process.
  const [isInitialized] = useAsyncMemo(async () => {
    if (isGuestCheckoutEditMode) {
      return true;
    }

    try {
      LoadingProvider.setLoading(GUEST_CHECKOUT_PATTERN);
      await prepareCheckout({
        initializePayment: false,
      });
      LoadingProvider.resetLoading(GUEST_CHECKOUT_PATTERN);
      return true;
    } catch (error) {
      return false;
    }
  }, [], false);

  // Determine values to prefill some form fields
  const userCountry = useMemo(
    () => userLocation?.country || appConfig?.marketId || null,
    [userLocation]
  );

  const userRegion = useMemo(() => userLocation?.region || null, [userLocation]);

  // Create initial values for billing and pickup forms.
  const defaultPickupPersonState = React.useMemo(() => ({
    ...initialPickupPersonState,
    ...(!billingPickupEquals ? pickBy(pickupAddress || {}, identity) : {}),
    pickupPerson: billingPickupEquals ? 'me' : 'someoneElse',
  }), [billingPickupEquals, pickupAddress]);

  const defaultBillingAddressState = React.useMemo(() => ({
    ...initialBillingAddressState,
    country: userCountry,
    region: userRegion,
    ...(pickBy(billingAddress || {}, identity)),
    ...Object.assign({}, ...customerAttributes
      .map(attribute => ({ [`attribute_${attribute.code}`]: attribute.value?.code || attribute.value }))),
  }), [billingAddress, customerAttributes, userCountry, userRegion]);

  // Handles submit of the checkout form.
  const handleSubmit = React.useCallback(async (values) => {
    /** Async wrapper for useCallback */
    LoadingProvider.setLoading(GUEST_CHECKOUT_PATTERN);
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
    try {
      const attributes = extractAttributes(customerAttributes, values);
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
        ...(attributes?.length ? { customer: { attributes } } : {}),
      });
    } catch (error) {
      LoadingProvider.resetLoading(GUEST_CHECKOUT_PATTERN);
      return;
    }

    LoadingProvider.resetLoading(GUEST_CHECKOUT_PATTERN);
    LoadingProvider.setLoading(GUEST_CHECKOUT_PAYMENT_PATTERN);

    if (isGuestCheckoutEditMode) {
      historyPop();
    } else {
      historyPush({ pathname: GUEST_CHECKOUT_PAYMENT_PATTERN });
    }

    // We don't set locked to false to avoid unnecessary UI changes right before
    // going to checkout page.
  }, [customerAttributes, historyPop, historyPush, isGuestCheckoutEditMode, updateCheckoutOrder]);

  // Create validation rules based on required fields.
  const billingValidationRules = React.useMemo(
    () => ({
      ...mapValues(billingConstraints, (constraint, field) => {
        const isRequired = requiredFields.includes(field);
        return {
          ...constraint,
          presence: isRequired ? constraint.presence : undefined,
        };
      }),
      ...generateFormConstraints(customerAttributes),
    }), [customerAttributes, requiredFields]
  );

  // Hold form states.
  const formBillingState = useFormState(
    defaultBillingAddressState,
    handleSubmit,
    billingValidationRules
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
  const value = React.useMemo(
    () => ({
      isLocked,
      supportedCountries: shopSettings.supportedCountries,
      formPickupValidationErrors: convertValidationErrors(
        formPickupState.validationErrors || {}
      ),
      formPickupSetValues: formPickupState.setValues,
      handleSubmit: formPickupState.handleSubmit,
      formBillingValidationErrors: convertValidationErrors(
        formBillingState.validationErrors || {}
      ),
      formBillingSetValues: formBillingState.setValues,
      handleSubmitBilling: formBillingState.handleSubmit,
      defaultPickupPersonState,
      defaultBillingAddressState,
      userLocation,
      billingAddress,
      requiredFields,
      needsPayment,
      orderReserveOnly,
      isGuestCheckoutEditMode,
      customerAttributes,
    }),
    [
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
      requiredFields,
      needsPayment,
      orderReserveOnly,
      isGuestCheckoutEditMode,
      customerAttributes,
    ]
  );

  if (!isDataReady || !isInitialized) {
    return null;
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

GuestRegistrationProvider.defaultProps = {
  orderReserveOnly: null,
};

export default connect(GuestRegistrationProvider);
