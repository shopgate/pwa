import React from 'react';
import PropTypes from 'prop-types';
import { LocationIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { address as container, addressIcon } from './style';

/**
 * Renders the a pickup location's address information.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Address({ address }) {
  if (!address) {
    return null;
  }

  return (
    <div className={container}>
      <div className={addressIcon}>
        <LocationIcon />
      </div>
      <div>
        <div data-test-id="street">
          {address.street}
        </div>
        {(address.street2 && address.street2 !== '') && (
          <div data-test-id="street2">
            {address.street2}
          </div>
        )}
        {(address.street3 && address.street3 !== '') && (
          <div data-test-id="street3">
            {address.street3}
          </div>
        )}
        {(address.street4 && address.street4 !== '') && (
          <div data-test-id="street4">
            {address.street4}
          </div>
        )}
        {i18n.text('product.location.address', address)}
      </div>
    </div>
  );
}

Address.propTypes = {
  address: PropTypes.shape({
    city: PropTypes.string,
    postalCode: PropTypes.string,
    region: PropTypes.string,
    street: PropTypes.string,
    street2: PropTypes.string,
    street3: PropTypes.string,
    street4: PropTypes.string,
  }),
};

Address.defaultProps = {
  address: null,
};

export default Address;
