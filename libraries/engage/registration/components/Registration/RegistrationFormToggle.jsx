import React, { useCallback } from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { Toggle } from '@shopgate/engage/components';
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
 * @returns {JSX}
 */
const RegistrationFormToggle = () => {
  const {
    enableShippingForm,
    isShippingFormVisible,
    setIsShippingFormVisible,
  } = useRegistration();
  const handleChange = useCallback((e) => {
    setIsShippingFormVisible(e.target.checked);
  }, [setIsShippingFormVisible]);

  if (!enableShippingForm) {
    return null;
  }

  return (
    <div className={styles.root}>
      <span className={styles.label}>
        { i18n.text('registration.different_shipping_address_label')}
      </span>
      <Toggle
        id="toggle-shipping-form"
        checked={isShippingFormVisible}
        onChange={handleChange}
      />
    </div>
  );
};

export default RegistrationFormToggle;
