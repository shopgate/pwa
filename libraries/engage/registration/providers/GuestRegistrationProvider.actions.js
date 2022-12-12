import { EVALIDATION } from '@shopgate/engage/core';
import { updateCheckoutOrder } from '@shopgate/engage/checkout/actions';
import { extractAttributes } from '@shopgate/engage/account/helper/form';
import { getMerchantCustomerAttributes } from '@shopgate/engage/core/selectors/merchantSettings';
import { convertSubmitRegistrationValidationErrors } from '../helpers';

/**
 * Submits guest registration form data.
 * @returns {Function}
 */
export const submitGuestRegistration = ({
  billingFormData,
  shippingFormData,
  pickupFormData,
  extraFormData,
  processShipping,
}) => async (dispatch, getState) => {
  const customerAttributes = getMerchantCustomerAttributes(getState());
  const { marketingOptIn, ...attributeData } = extraFormData;
  const attributes = extractAttributes(customerAttributes, attributeData);

  let pickupPerson;
  let restPickupFormData = {};

  if (pickupFormData) {
    ({ pickupPerson, ...restPickupFormData } = pickupFormData);
  }

  const shippingFormVisible = processShipping && !!shippingFormData;
  const pickupFormVisible = pickupFormData && pickupPerson !== 'me';

  const addressSequences = [
    {
      type: 'billing',
      ...billingFormData,
    },
    ...(processShipping ? {
      type: 'shipping',
      ...(shippingFormData || billingFormData),
    } : []),
    ...(pickupFormData ? {
      ...(pickupPerson === 'me' ? {
        type: 'pickup',
        ...billingFormData,
      } : {
        type: 'pickup',
        ...restPickupFormData,
      }),
    } : []),

  ];

  const order = {
    addressSequences,
    primaryBillToAddressSequenceIndex: 0,
    primaryShipToAddressSequenceIndex: 1,
    ...(attributes?.length ? { customer: { attributes } } : {}),
  };

  let errors;
  let response;
  try {
    response = await dispatch(updateCheckoutOrder(order));
  } catch (error) {
    const { code, errors: validationErrors } = error;
    if (code === EVALIDATION) {
      errors = validationErrors;
    } else {
      throw error;
    }
  }

  const converted = convertSubmitRegistrationValidationErrors(errors, attributes);

  if (converted?.validation && Object.keys(converted.validation).length > 0) {
    const sequenceErrors = converted?.validation?.addressSequences;
    const shippingIndex = addressSequences.findIndex(item => item.type === 'shipping');
    const pickupIndex = addressSequences.findIndex(item => item.type === 'pickup');

    const billing = sequenceErrors?.['0'] || {};
    const shipping = shippingFormVisible ? sequenceErrors?.[shippingIndex] || {} : {};
    const pickup = pickupFormVisible ? sequenceErrors?.[pickupIndex] || {} : {};
    const extra = converted?.validation?.attributes || {};

    return {
      response,
      errors: {
        billingFormData: { ...billing },
        shippingFormData: { ...shipping },
        pickupFormData: { ...pickup },
        extraFormData: { ...extra },
      },
    };
  }

  return { response };
};
