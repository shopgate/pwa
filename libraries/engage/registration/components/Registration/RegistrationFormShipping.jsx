import React, { useMemo, useCallback } from 'react';
import { FormBuilder } from '@shopgate/engage/components';
import { useRegistration } from '../../hooks';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import generateFormConfig from './RegistrationFormShipping.config';
import { form, containerItem, section } from './Registration.style';

/**
 * The RegistrationFormShipping component.
 * @returns {JSX}
 */
const RegistrationFormShipping = () => {
  const {
    supportedCountries,
    userLocation,
    defaultShippingFormState,
    shippingFormValidationErrors,
    updateShippingForm,
  } = useRegistration();

  const formConfig = useMemo(
    () => generateFormConfig(supportedCountries, userLocation),
    [supportedCountries, userLocation]
  );

  const handleUpdate = useCallback((values) => {
    updateShippingForm(values);
  }, [updateShippingForm]);

  return (
    <div className={containerItem}>
      <Section title="registration.headlines.shipping_address" className={section}>
        <FormBuilder
          className={form}
          name="RegistrationShipping"
          config={formConfig}
          defaults={defaultShippingFormState}
          validationErrors={shippingFormValidationErrors}
          handleUpdate={handleUpdate}
        />
      </Section>
    </div>
  );
};

export default RegistrationFormShipping;
