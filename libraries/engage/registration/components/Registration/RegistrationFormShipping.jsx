import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { StylePresets } from '@shopgate/engage/components/Form';
import { useRegistration } from '../../hooks';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import { ELEMENT_ID_SHIPPING_CONTACT } from '../../constants';
import generateFormConfig from './RegistrationFormShipping.config';

const useStyles = makeStyles()(theme => ({
  form: {
    ...StylePresets.getOutlinedFormFields(theme),
    ' .registrationOptInMarketingOptIn': {
      paddingTop: 0,
      paddingBottom: theme.spacing(2),
    },
  },
  section: {},
  shippingFormSection: {
    paddingBottom: 32,
  },
}));

/**
 * The RegistrationFormShipping component.
 * @param {Object} props The component props
 * @returns {JSX}
 */
const RegistrationFormShipping = ({ isGuest }) => {
  const { classes, cx } = useStyles();
  const {
    supportedCountries,
    countrySortOrder,
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
      countrySortOrder,
      userLocation,
      numberOfAddressLines,
    }),
    [countrySortOrder, numberOfAddressLines, supportedCountries, userLocation]
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
      className={cx(classes.section, classes.shippingFormSection)}
      hasForm
      id={ELEMENT_ID_SHIPPING_CONTACT}
    >
      <FormBuilder
        className={classes.form}
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
