import React, { useMemo, useCallback, forwardRef } from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { FormBuilder } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { StylePresets } from '@shopgate/engage/components/Form';
import { useProfileContext } from './Profile.provider';
import generateFormConfig from './Profile.config';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 16,
  },
  form: {
    ...StylePresets.getOutlinedFormFields(theme),
    ...StylePresets.TWO_COLUMN_LAYOUT,
    ' .container-checkbox': {
      [responsiveMediaQuery('>=md', { webOnly: false })]: {
        marginRight: '50%',
      },
    },
  },
  button: {
    marginTop: 8,
    marginRight: 16,
    [responsiveMediaQuery('<md', { webOnly: false })]: {
      marginRight: 0,
    },
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
}));

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
        <Button
          variant="outlined"
          color="error"
          className={classes.button}
          onClick={deleteCustomer}
        >
          {i18n.text('account.profile.delete')}
        </Button>
        <Button
          color="primary"
          className={classes.button}
          onClick={saveForm}
        >
          {i18n.text('account.profile.form.save')}
        </Button>
      </div>
    </div>
  );
});

export default ProfileForm;
