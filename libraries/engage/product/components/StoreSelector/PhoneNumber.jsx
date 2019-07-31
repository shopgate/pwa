import React, { memo } from 'react';
import PropTypes from 'prop-types';
import PhoneIcon from '@shopgate/pwa-ui-shared/icons/PhoneIcon';
import { phone as phoneStyle, phoneIcon } from './style';

/**
 * Renders the store's phone number.
 * @param {Object} props The compnent props.
 * @returns {JSX}
 */
const PhoneNumber = ({ phone }) => {
  if (!phone) {
    return null;
  }

  return (
    <a href={`tel:${phone}`} className={phoneStyle}>
      <span className={phoneIcon}>
        <PhoneIcon />
      </span>
      <span>{phone}</span>
    </a>
  );
};

PhoneNumber.propTypes = {
  phone: PropTypes.string,
};

PhoneNumber.defaultProps = {
  phone: null,
};

export default memo(PhoneNumber);
