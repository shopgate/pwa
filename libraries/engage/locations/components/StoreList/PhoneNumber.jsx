import React from 'react';
import PropTypes from 'prop-types';
import { PhoneIcon } from '@shopgate/engage/components';
import { phone as phoneStyle, phoneIcon } from './style';

/**
 * Renders the store's phone number.
 * @param {Object} props The compnent props.
 * @returns {JSX}
 */
function PhoneNumber({ phone }) {
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

PhoneNumber.propTypes = {
  phone: PropTypes.string,
};

PhoneNumber.defaultProps = {
  phone: null,
};

export default PhoneNumber;
