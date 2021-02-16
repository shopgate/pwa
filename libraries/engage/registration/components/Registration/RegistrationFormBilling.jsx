import React, { useMemo, useCallback } from 'react';
import { FormBuilder } from '@shopgate/engage/components';
import { useRegistration } from '../../hooks';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import generateFormConfig from './RegistrationFormBilling.config';
import { form, section } from './Registration.style';

/**
 * The RegistrationFormBilling component.
 * @returns {JSX}
 */
const RegistrationFormBilling = () => {
  const {
    supportedCountries,
    userLocation,
    defaultBillingFormState,
    billingFormValidationErrors,
    updateBillingForm,
    numberOfAddressLines,
  } = useRegistration();

  const formConfig = useMemo(
    () => generateFormConfig(supportedCountries, userLocation, numberOfAddressLines),
    [numberOfAddressLines, supportedCountries, userLocation]
  );

  const handleUpdate = useCallback((values) => {
    updateBillingForm(values);
  }, [updateBillingForm]);

  return (
    <Section title="registration.headlines.billing_address" className={section} hasForm>
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

export default RegistrationFormBilling;
