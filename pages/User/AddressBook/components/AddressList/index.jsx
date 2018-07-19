import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Address from './component/Address';
import connect from './connector';

/**
/**
 * @param {Object} props props
 * @constructor
 */
const AddressList = ({ addresses }) => (
  <Fragment>
    {
      addresses.map(address => (
        <Fragment key={`address_${address.id}`}>
          <Address address={address} />
        </Fragment>
      ))
    }
  </Fragment>
);

AddressList.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default connect(AddressList);
