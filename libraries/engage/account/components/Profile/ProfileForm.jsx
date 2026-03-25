import React, { useMemo, useCallback, forwardRef } from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { FormBuilder, RippleButton } from '@shopgate/engage/components';
import { StylePresets } from '@shopgate/engage/components/Form';
import { useProfileContext } from './Profile.provider';
import generateFormConfig from './Profile.config';

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 16,
  },
  form: {
    ...StylePresets.OUTLINED_FORM_FIELDS,
    ...StylePresets.TWO_COLUMN_LAYOUT,
    ' .container-checkbox': {
      [responsiveMediaQuery('>=md', { webOnly: false })]: {
        marginRight: '50%',
      },
    },
  },
  button: {
    '&&': {
      marginTop: 8,
      marginRight: 16,
      backgroundColor: 'var(--color-primary)',
      borderRadius: 5,
      fontSize: 14,
      textTransform: 'none',
      padding: 0,
      [responsiveMediaQuery('<md', { webOnly: false })]: {
        marginRight: 0,
      },
    },
  },
  buttonDelete: {
    '&&': {
      marginTop: 8,
      marginRight: 16,
      border: '1px solid var(--color-state-alert)',
      backgroundColor: '#fff',
      color: 'var(--color-state-alert)',
      borderRadius: 5,
      fontSize: 14,
      textTransform: 'none',
      padding: 0,
      [responsiveMediaQuery('<md', { webOnly: false })]: {
        marginRight: 0,
      },
    },
  },
  ripple: {
    padding: '8px 16px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    [responsiveMediaQuery('<md', { webOnly: false })]: {
      marginTop: 8,
      flexDirection: 'column-reverse',
    },
  },
});

/**
 * @returns {JSX}
 */
const ProfileForm = forwardRef((_, ref) => {
  const { classes } = useStyles();
  const {
    formState,
    customer,
    saveForm,
    deleteCustomer,
    validationErrors,
    merchantCustomerAttributes,
    supportedCountries,
    countrySortOrder,
    userLocation,
  } = useProfileContext();

  const formConfig = useMemo(
    () => generateFormConfig({
      customerAttributes: merchantCustomerAttributes,
      supportedCountries,
      countrySortOrder,
      userLocation,
    }),
    [countrySortOrder, merchantCustomerAttributes, supportedCountries, userLocation]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  const handleUpdate = useCallback((values) => {
    formState.setValues(values);
  }, [formState.setValues]);
  /* eslint-enable react-hooks/exhaustive-deps */

  if (!customer) {
    return null;
  }

  return (
    <div className={classes.root} ref={ref}>
      <FormBuilder
        name="ProfileForm"
        className={classes.form}
        config={formConfig}
        defaults={customer}
        validationErrors={validationErrors}
        handleUpdate={handleUpdate}
      />
      <div className={classes.actions}>
        <RippleButton
          className={classes.buttonDelete}
          rippleClassName={classes.ripple}
          type="primary"
          onClick={deleteCustomer}
        >
          {i18n.text('account.profile.delete')}
        </RippleButton>
        <RippleButton
          className={classes.button}
          rippleClassName={classes.ripple}
          type="primary"
          onClick={saveForm}
        >
          {i18n.text('account.profile.form.save')}
        </RippleButton>
      </div>
    </div>
  );
});

export default ProfileForm;
