import React, { useMemo, useCallback } from 'react';
import { FormBuilder } from '@shopgate/engage/components';
import { StylePresets } from '@shopgate/engage/components/Form';
import { makeStyles } from '@shopgate/engage/styles';
import { ELEMENT_ID_PICKUP_CONTACT } from '../../constants';
import generateFormConfig from './GuestRegistrationFormPickup.config';
import Section from '../../../checkout/components/Checkout/CheckoutSection';
import { useRegistration } from '../../hooks';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
  },
  form: {
    ' .guestFormPickupPerson': {
      marginTop: theme.spacing(1),
    },
    ' .guestFormPickupPerson .me': {
      marginRight: theme.spacing(2),
    },
    ' .guestFormPickupPerson .label span': {
      color: theme.palette.text.primary,
      fontWeight: 'bold',
    },
    ' .guestFormPickupPerson .radioGroup': {
      marginTop: theme.spacing(1),
      flexDirection: 'row',
      ' .uncheckedIcon': {
        color: 'var(--color-text-medium-emphasis)',
      },
    },
    ...StylePresets.OUTLINED_FORM_FIELDS,
  },
}));

/**
 * PickupContactForm
 * @returns {JSX}
 */
const GuestRegistrationFormPickup = () => {
  const { classes } = useStyles();
  const {
    supportedCountries,
    countrySortOrder,
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
      countrySortOrder,
      userLocation,
    }),
    [countrySortOrder, supportedCountries, userLocation]
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
    <div className={classes.root}>
      <Section title={headline} hasForm id={ELEMENT_ID_PICKUP_CONTACT}>
        <FormBuilder
          className={classes.form}
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
