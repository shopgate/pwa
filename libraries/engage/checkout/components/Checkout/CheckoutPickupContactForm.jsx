import React from 'react';
import { FormBuilder, SurroundPortals } from '@shopgate/engage/components';
import { StylePresets } from '@shopgate/engage/components/Form';
import { makeStyles } from '@shopgate/engage/styles';
import generateFormConfig from './CheckoutPickupContactForm.config';
import Section from './CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';
import { CHECKOUT_PICKUP_CONTACT_FORM } from '../../constants';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: 16,
    paddingTop: 0,
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
  },
  form: {
    ' .pickupFormPickupPerson': {
      marginTop: theme.spacing(1),
    },
    ' .pickupFormPickupPerson .me': {
      marginRight: theme.spacing(2),
    },
    ' .pickupFormPickupPerson .label span': {
      color: 'var(--color-text-high-emphasis)',
      fontWeight: 'bold',
    },
    ' .pickupFormPickupPerson .radioGroup': {
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
const PickupContactForm = () => {
  const { classes } = useStyles();
  const {
    supportedCountries,
    countrySortOrder,
    userLocation,
    defaultPickupPersonState,
    formValidationErrors,
    formSetValues,
    isPickupContactSelectionEnabled,
  } = useCheckoutContext();

  const formConfig = React.useMemo(
    () => generateFormConfig({
      supportedCountries,
      countrySortOrder,
      userLocation,
    }),
    [countrySortOrder, supportedCountries, userLocation]
  );

  const handleUpdate = React.useCallback((values) => {
    formSetValues(values);
  }, [formSetValues]);

  if (!isPickupContactSelectionEnabled) {
    return null;
  }

  return (
    <SurroundPortals portalName={CHECKOUT_PICKUP_CONTACT_FORM}>
      <div className={classes.root}>
        <Section title="checkout.pickup_contact.headline" hasForm>
          <FormBuilder
            className={classes.form}
            name="PickupForm"
            config={formConfig}
            defaults={defaultPickupPersonState}
            validationErrors={formValidationErrors}
            handleUpdate={handleUpdate}
          />
        </Section>
      </div>
    </SurroundPortals>
  );
};

export default PickupContactForm;
