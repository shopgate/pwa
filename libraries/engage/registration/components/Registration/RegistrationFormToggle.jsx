import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { Toggle } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { ELEMENT_ID_SHIPPING_CONTACT_TOGGLE } from '../../constants';
import { useRegistration } from '../../hooks';

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  label: {
    paddingRight: 8,
  },
});

/**
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const RegistrationFormToggle = ({ isGuest }) => {
  const { classes } = useStyles();
  const {
    isShippingAddressSelectionEnabled,
    isShippingFormVisible,
    setIsShippingFormVisible,
  } = useRegistration(isGuest);

  const handleChange = useCallback((e) => {
    setIsShippingFormVisible(e.target.checked);
  }, [setIsShippingFormVisible]);

  if (!isShippingAddressSelectionEnabled) {
    return null;
  }

  return (
    <div className={classes.root} id={ELEMENT_ID_SHIPPING_CONTACT_TOGGLE}>
      <label
        aria-hidden
        className={classes.label}
        htmlFor="toggle-shipping-form"
        id="toggle-shipping-form-label"
      >
        { i18n.text('registration.different_shipping_address_label')}
      </label>
      <Toggle
        id="toggle-shipping-form"
        checked={isShippingFormVisible}
        onChange={handleChange}
      />
    </div>
  );
};

RegistrationFormToggle.propTypes = {
  isGuest: PropTypes.bool,
};

RegistrationFormToggle.defaultProps = {
  isGuest: false,
};

export default RegistrationFormToggle;
