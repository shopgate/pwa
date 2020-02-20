import React from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { pickUpButtonChangeLocation, pickUpButtonChangeLocationRipple } from './FulfillmentSelector.style';

/**
 * @param {Function} onClick callback.
 * @returns {JSX}
 */
const FulfillmentSelectorButtonChangeLocation = ({ onClick }) => (
  <RippleButton
    onClick={onClick}
    className={pickUpButtonChangeLocation}
    rippleClassName={pickUpButtonChangeLocationRipple}
    type="secondary"
    flat
  >
    <I18n.Text string="locations.change_location" />
  </RippleButton>
);

FulfillmentSelectorButtonChangeLocation.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default FulfillmentSelectorButtonChangeLocation;
