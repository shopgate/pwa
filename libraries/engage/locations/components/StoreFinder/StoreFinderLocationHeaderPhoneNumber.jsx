import React from 'react';
import PropTypes from 'prop-types';
import PhoneIcon from '@shopgate/pwa-ui-shared/icons/PhoneIcon';
import { StoreDetailsLine } from '../StoreList/StoreDetailsLine';

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const StoreFinderLocationHeaderPhoneNumber = ({ phone, pure }) => {
  if (!phone) {
    return null;
  }

  if (pure) {
    return (
      <a href={`tel:${phone}`}>
        { phone }
      </a>
    );
  }

  return (
    <StoreDetailsLine icon={PhoneIcon}>
      <a href={`tel:${phone}`}>
        { phone }
      </a>
    </StoreDetailsLine>

  );
};

StoreFinderLocationHeaderPhoneNumber.propTypes = {
  phone: PropTypes.string,
  pure: PropTypes.bool,
};

StoreFinderLocationHeaderPhoneNumber.defaultProps = {
  phone: null,
  pure: false,
};

export default StoreFinderLocationHeaderPhoneNumber;
