import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { Toggle } from '@shopgate/engage/components';
import { ELEMENT_ID_SHIPPING_CONTACT_TOGGLE } from '../../constants';
import { useRegistration } from '../../hooks';

const styles = {
  root: css({
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: 24,
  }).toString(),
  label: css({
    paddingRight: 8,
  }).toString(),
};

/**
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const RegistrationFormToggle = ({ isGuest }) => {
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
    <div className={styles.root} id={ELEMENT_ID_SHIPPING_CONTACT_TOGGLE}>
      <label
        aria-hidden
        className={styles.label}
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
