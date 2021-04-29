import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder } from '@shopgate/engage/components';
import { useRegistration } from '../../hooks';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import { ELEMENT_ID_BILLING_CONTACT } from '../../constants';
import generateFormConfig from './RegistrationFormBilling.config';
import { form, section } from './Registration.style';

/**
 * The RegistrationFormBilling component.
 * @param {Object} props The component props
 * @returns {JSX}
 */
const RegistrationFormBilling = ({ isGuest }) => {
  const {
    supportedCountries,
    userLocation,
    defaultBillingFormState,
    billingFormValidationErrors,
    updateBillingForm,
    numberOfAddressLines,
    orderReserveOnly,
  } = useRegistration(isGuest);

  const formConfig = useMemo(
    () => generateFormConfig({
      supportedCountries,
      userLocation,
      numberOfAddressLines,
      isGuest,
      isReserveOnly: orderReserveOnly,
    }),
    [isGuest, numberOfAddressLines, orderReserveOnly, supportedCountries, userLocation]
  );

  const title = useMemo(() => {
    if (isGuest && orderReserveOnly) {
      return 'registration.headlines.billing_address_reserve';
    }

    return 'registration.headlines.billing_address';
  }, [isGuest, orderReserveOnly]);

  const handleUpdate = useCallback((values) => {
    updateBillingForm(values);
  }, [updateBillingForm]);

  return (
    <Section title={title} className={section} hasForm id={ELEMENT_ID_BILLING_CONTACT}>
      <FormBuilder
        className={form}
        name="RegistrationBilling"
        config={formConfig}
        defaults={defaultBillingFormState}
        validationErrors={billingFormValidationErrors}
        handleUpdate={handleUpdate}
      />
    </Section>
  );
};

RegistrationFormBilling.propTypes = {
  isGuest: PropTypes.bool,
};

RegistrationFormBilling.defaultProps = {
  isGuest: false,
};

export default RegistrationFormBilling;
