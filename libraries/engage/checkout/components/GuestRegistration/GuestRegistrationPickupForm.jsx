import React, { useMemo } from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import { FormBuilder } from '@shopgate/engage/components';

import generateFormConfig from './GuestRegistrationPickupForm.config';
import Section from '../Checkout/CheckoutSection';
import { useGuestRegistration } from '../../hooks/common';
import { styles as formStyles } from '../Form';

const { variables } = themeConfig;

const styles = {
  root: css({
    padding: `0 ${variables.gap.big}px ${variables.gap.big}px`,
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
  }).toString(),
  form: css({
    ' .guestFormPickupPerson': {
      marginTop: variables.gap.small,
    },
    ' .guestFormPickupPerson .me': {
      marginRight: variables.gap.big,
    },
    ' .guestFormPickupPerson .label span': {
      color: 'var(--color-text-high-emphasis)',
      fontSize: 20,
      fontWeight: 'bold',
    },
    ' .guestFormPickupPerson .radioGroup': {
      marginTop: variables.gap.small,
      flexDirection: 'row',
      ' .uncheckedIcon': {
        color: 'var(--color-text-medium-emphasis)',
      },
    },
    ...formStyles,
  }).toString(),
};

/**
 * PickupContactForm
 * @returns {JSX}
 */
const GuestRegistrationForm = () => {
  const {
    supportedCountries,
    userLocation,
    defaultPickupPersonState,
    formPickupValidationErrors,
    formPickupSetValues,
    orderReserveOnly,
  } = useGuestRegistration();

  const formConfig = React.useMemo(
    () => generateFormConfig(supportedCountries, userLocation),
    [supportedCountries, userLocation]
  );

  const handleUpdate = React.useCallback((values) => {
    formPickupSetValues(values);
  }, [formPickupSetValues]);

  const headline = useMemo(
    () =>
      (orderReserveOnly
        ? 'checkout.pickup_contact.headline_reserve'
        : 'checkout.pickup_contact.headline'),
    [orderReserveOnly]
  );

  return (
    <div className={styles.root}>
      <Section title={headline} hasForm>
        <FormBuilder
          className={styles.form}
          name="GuestForm"
          config={formConfig}
          defaults={defaultPickupPersonState}
          validationErrors={formPickupValidationErrors}
          handleUpdate={handleUpdate}
        />
      </Section>
    </div>
  );
};

export default GuestRegistrationForm;
