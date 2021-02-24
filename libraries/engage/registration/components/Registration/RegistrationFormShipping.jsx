import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormBuilder } from '@shopgate/engage/components';
import { useRegistration } from '../../hooks';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import { ELEMENT_ID_SHIPPING_CONTACT } from '../../constants';
import generateFormConfig from './RegistrationFormShipping.config';
import {
  form, section, shippingFormSection,
} from './Registration.style';

/**
 * The RegistrationFormShipping component.
 * @param {Object} props The component props
 * @returns {JSX}
 */
const RegistrationFormShipping = ({ isGuest }) => {
  const {
    supportedCountries,
    userLocation,
    defaultShippingFormState,
    shippingFormValidationErrors,
    updateShippingForm,
    isShippingFormVisible,
    isShippingAddressSelectionEnabled,
    numberOfAddressLines,
  } = useRegistration(isGuest);

  const formConfig = useMemo(
    () => generateFormConfig({
      supportedCountries,
      userLocation,
      numberOfAddressLines,
    }),
    [numberOfAddressLines, supportedCountries, userLocation]
  );

  const handleUpdate = useCallback((values) => {
    updateShippingForm(values);
  }, [updateShippingForm]);

  if (!isShippingAddressSelectionEnabled || !isShippingFormVisible) {
    return null;
  }

  return (
    <Section
      title="registration.headlines.shipping_address"
      className={classNames(section, shippingFormSection)}
      hasForm
      id={ELEMENT_ID_SHIPPING_CONTACT}
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
  );
};

RegistrationFormShipping.propTypes = {
  isGuest: PropTypes.bool,
};

RegistrationFormShipping.defaultProps = {
  isGuest: false,
};

export default RegistrationFormShipping;
