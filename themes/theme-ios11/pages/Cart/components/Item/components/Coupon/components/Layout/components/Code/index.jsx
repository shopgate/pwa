import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';

/**
* The Coupon Code component.
* @param {Object} props The component props.
* @returns {JSX}
*/
const Code = ({ value }) => (
  <div>
    <I18n.Text string="cart.coupon_code" />: {value}
  </div>
);

Code.propTypes = {
  value: PropTypes.string.isRequired,
};

export default Code;
