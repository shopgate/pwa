import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { StylePresets } from '@shopgate/engage/components/Form';
import { useRegistration } from '../../hooks';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import { ELEMENT_ID_BILLING_CONTACT } from '../../constants';
import generateFormConfig from './RegistrationFormBilling.config';

const useStyles = makeStyles()(theme => ({
  form: {
    ...StylePresets.OUTLINED_FORM_FIELDS,
    ' .registrationOptInMarketingOptIn': {
      paddingTop: 0,
      paddingBottom: theme.spacing(2),
    },
  },
  section: {},
}));

/**
 * The RegistrationFormBilling component.
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const RegistrationFormBilling = ({ isGuest }) => {
  const { classes } = useStyles();
  const {
    supportedCountries,
    countrySortOrder,
    userLocation,
    defaultBillingFormState,
    billingFormValidationErrors,
    updateBillingForm,
    numberOfAddressLines,
    orderReserveOnly,
    isBillingAddressSelectionEnabled,
  } = useRegistration(isGuest);

  const formConfig = useMemo(
    () => generateFormConfig({
      supportedCountries,
      countrySortOrder,
      userLocation,
      numberOfAddressLines,
      isGuest,
      isReserveOnly: orderReserveOnly,
    }),
    [
      countrySortOrder,
      isGuest,
      numberOfAddressLines,
      orderReserveOnly,
      supportedCountries,
      userLocation,
    ]
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

  if (!isBillingAddressSelectionEnabled) {
    return null;
  }

  return (
    <Section title={title} className={classes.section} hasForm id={ELEMENT_ID_BILLING_CONTACT}>
      <FormBuilder
        className={classes.form}
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
