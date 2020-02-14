import React from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { pickUpButtonChangeLocation } from './FulfillmentSelector.style';

/**
 * Renders a RadioItem element to be used by the FulfillmentSelector component.
 * This component is meant to be rendered as child of a RadioGroup.
 * @param {Object} props All props required by the component to work.
 * @param {string} props.name The item to be rendered and identified by on selection.
 * @param {JSX} props.children The child components to be rendered besides the label.
 * @returns {JSX}
 */
const FulfillmentSelectorButtonChangeLocation = ({ onClick }) => (
  <RippleButton
    onClick={onClick}
    className={pickUpButtonChangeLocation}
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
