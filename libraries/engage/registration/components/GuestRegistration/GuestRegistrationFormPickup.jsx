import React, { useMemo, useCallback } from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import { FormBuilder } from '@shopgate/engage/components';
import { StylePresets } from '@shopgate/engage/components/Form';
import { ELEMENT_ID_PICKUP_CONTACT } from '../../constants';
import generateFormConfig from './GuestRegistrationFormPickup.config';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import { useRegistration } from '../../hooks';

const { variables } = themeConfig;

const styles = {
  root: css({
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
      fontWeight: 'bold',
    },
    ' .guestFormPickupPerson .radioGroup': {
      marginTop: variables.gap.small,
      flexDirection: 'row',
      ' .uncheckedIcon': {
        color: 'var(--color-text-medium-emphasis)',
      },
    },
    ...StylePresets.OUTLINED_FORM_FIELDS,
  }).toString(),
};

/**
 * PickupContactForm
 * @returns {JSX}
 */
const GuestRegistrationFormPickup = () => {
  const {
    supportedCountries,
    userLocation,
    defaultPickupFormState,
    pickupFormValidationErrors,
    updatePickupForm,
    orderReserveOnly,
    isPickupContactSelectionEnabled,
  } = useRegistration(true);

  const formConfig = React.useMemo(
    () => generateFormConfig({
      supportedCountries,
      userLocation,
    }),
    [supportedCountries, userLocation]
  );

  const handleUpdate = useCallback((values) => {
    updatePickupForm(values);
  }, [updatePickupForm]);

  const headline = useMemo(
    () =>
      (orderReserveOnly
        ? 'checkout.pickup_contact.headline_reserve'
        : 'checkout.pickup_contact.headline'),
    [orderReserveOnly]
  );

  if (!isPickupContactSelectionEnabled) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Section title={headline} hasForm id={ELEMENT_ID_PICKUP_CONTACT}>
        <FormBuilder
          className={styles.form}
          name="GuestForm"
          config={formConfig}
          defaults={defaultPickupFormState}
          validationErrors={pickupFormValidationErrors}
          handleUpdate={handleUpdate}
        />
      </Section>
    </div>
  );
};

export default GuestRegistrationFormPickup;
