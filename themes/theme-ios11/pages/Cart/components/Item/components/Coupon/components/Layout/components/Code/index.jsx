import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { Ellipsis } from '@shopgate/engage/components';

/**
 * The Coupon Code component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Code = ({ value }) => (
  <Ellipsis rows={2}>
    <I18n.Text string="cart.coupon_code" />
    {': '}
    {value}
  </Ellipsis>
);

Code.propTypes = {
  value: PropTypes.string.isRequired,
};

export default Code;
