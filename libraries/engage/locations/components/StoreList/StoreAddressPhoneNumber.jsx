import React from 'react';
import PropTypes from 'prop-types';
import { PhoneIcon } from '../../../components';
import { phone as phoneStyle, phoneIcon } from './style';

/**
 * Renders the store's phone number.
 * @param {Object} props The compnent props.
 * @returns {JSX}
 */
function StoreAddressPhoneNumber({ phone }) {
  if (!phone) {
    return null;
  }

  return (
    <a href={`tel:${phone}`} className={phoneStyle}>
      <span className={phoneIcon}>
        <PhoneIcon />
      </span>
      <span data-test-id="store-phone">{phone}</span>
    </a>
  );
}

StoreAddressPhoneNumber.propTypes = {
  phone: PropTypes.string,
};

StoreAddressPhoneNumber.defaultProps = {
  phone: null,
};

export default StoreAddressPhoneNumber;
