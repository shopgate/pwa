import React, { useMemo, useCallback, useEffect } from 'react';
import { FormBuilder, SurroundPortals } from '@shopgate/engage/components';
import { isIOSTheme } from '@shopgate/engage/core';
import { StylePresets } from '@shopgate/engage/components/Form';
import { makeStyles } from '@shopgate/engage/styles';
import Section from '../Checkout/CheckoutSection';
import { useCheckoutContext } from '../../hooks/common';
import generateFormConfig from './GuestCheckoutOptIn.config';
import { CHECKOUT_MARKETING_OPTIN } from '../../constants';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(0, 2),
    ...(!isIOSTheme() ? {
      paddingBottom: theme.spacing(4),
    } : {}),
  },
  form: {
    ' .guestCheckoutOptInMarketingOptIn .checkbox': {
      paddingBottom: 0,
    },
    ...StylePresets.OUTLINED_FORM_FIELDS,
  },
}));

/**
 * @returns {JSX}
 */
const GuestCheckoutOptIn = () => {
  const { classes } = useStyles();
  const {
    defaultOptInFormState,
    optInFormSetValues,
    setUpdateOptIns,
  } = useCheckoutContext();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setUpdateOptIns();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */
  const formConfig = useMemo(
    () => generateFormConfig(),
    []
  );

  const handleUpdate = useCallback((values) => {
    optInFormSetValues(values);
  }, [optInFormSetValues]);

  return (
    <SurroundPortals portalName={CHECKOUT_MARKETING_OPTIN}>
      <div className={classes.root}>
        <Section hasForm>
          <FormBuilder
            className={classes.form}
            name="GuestCheckoutOptIn"
            config={formConfig}
            defaults={defaultOptInFormState}
            handleUpdate={handleUpdate}
          />
        </Section>
      </div>
    </SurroundPortals>
  );
};

export default GuestCheckoutOptIn;
