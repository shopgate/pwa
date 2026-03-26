import React, { forwardRef } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { isIOSTheme, SHOP_SETTING_REGISTRATION_MODE_SIMPLE } from '@shopgate/engage/core';
import RegistrationFormBase from './RegistrationFormBase';
import RegistrationFormBilling from './RegistrationFormBilling';
import RegistrationFormShipping from './RegistrationFormShipping';
import RegistrationFormActions from './RegistrationFormActions';
import RegistrationFormExtra from './RegistrationFormExtra';
import RegistrationFormToggle from './RegistrationFormToggle';
import { useRegistration } from '../../hooks';

const useStyles = makeStyles()(theme => ({
  container: {
    padding: theme.spacing(2, 2, 0),
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
    ...(!isIOSTheme() ? {
      '@media(min-width: 768px)': {
        flexDirection: 'row-reverse',
        '> :not(:first-of-type)': {
          marginRight: theme.spacing(2),
        },
      },
    } : null),
  },
  containerItem: {
    flexGrow: 1,
    flexShrink: 0,
    ...(!isIOSTheme() ? {
      '@media(min-width: 768px)': {
        width: `calc(50% - ${theme.spacing(2)}px)`,
      },
    } : null),
  },
}));

/**
 * The Registration component.
 * @returns {JSX}
 */
const Registration = forwardRef((_, ref) => {
  const { classes } = useStyles();
  const {
    registrationMode,
  } = useRegistration();

  const renderSingleColumn = registrationMode === SHOP_SETTING_REGISTRATION_MODE_SIMPLE;

  return (
    <>
      <div className={classes.container} ref={ref}>
        <div className={classes.containerItem}>
          {!renderSingleColumn && (
            <RegistrationFormBase />
          )}
        </div>
        <div className={classes.containerItem}>
          {renderSingleColumn && (
            <RegistrationFormBase />
          )}
          <RegistrationFormBilling />
          <RegistrationFormToggle />
          <RegistrationFormShipping />
          <RegistrationFormExtra />
        </div>
      </div>
      <RegistrationFormActions />
    </>
  );
});

export default Registration;
