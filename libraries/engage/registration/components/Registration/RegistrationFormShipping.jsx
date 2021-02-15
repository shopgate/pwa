import React, { useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { FormBuilder } from '@shopgate/engage/components';
import { useRegistration } from '../../hooks';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import generateFormConfig from './RegistrationFormShipping.config';
import {
  form, section, shippingFormSection, hidden,
} from './Registration.style';

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
    isShippingFormVisible,
  } = useRegistration();

  const formConfig = useMemo(
    () => generateFormConfig(supportedCountries, userLocation),
    [supportedCountries, userLocation]
  );

  const handleUpdate = useCallback((values) => {
    updateShippingForm(values);
  }, [updateShippingForm]);

  return (
    <div className={classNames({
      [hidden]: !isShippingFormVisible,
    })}
    >
      <Section
        title="registration.headlines.shipping_address"
        className={classNames(section, shippingFormSection)}
        hasForm
      >
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
