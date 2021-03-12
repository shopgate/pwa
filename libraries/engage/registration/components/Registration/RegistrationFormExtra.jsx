import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder } from '@shopgate/engage/components';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import { useRegistration } from '../../hooks';
import { ELEMENT_ID_CUSTOMER_ATTRIBUTES } from '../../constants';
import generateFormConfig from './RegistrationFormExtra.config';
import { form, section } from './Registration.style';

/**
 * The RegistrationFormExtra component.
 * @param {Object} props The component props
 * @returns {JSX}
 */
const RegistrationFormExtra = ({ isGuest }) => {
  const {
    defaultExtraFormState,
    updateExtraForm,
    customerAttributes,
    extraFormRequestErrors,
  } = useRegistration(isGuest);

  const formConfig = useMemo(
    () => generateFormConfig({
      customerAttributes,
      isGuest,
    }),
    [customerAttributes, isGuest]
  );

  const handleUpdate = useCallback((values) => {
    updateExtraForm(values);
  }, [updateExtraForm]);

  return (
    <Section className={section} hasForm id={ELEMENT_ID_CUSTOMER_ATTRIBUTES}>
      <FormBuilder
        className={form}
        name="RegistrationExtra"
        config={formConfig}
        defaults={defaultExtraFormState}
        validationErrors={extraFormRequestErrors}
        handleUpdate={handleUpdate}
      />
    </Section>
  );
};

RegistrationFormExtra.propTypes = {
  isGuest: PropTypes.bool,
};

RegistrationFormExtra.defaultProps = {
  isGuest: false,
};

export default RegistrationFormExtra;
