import React from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n, SurroundPortals } from '@shopgate/engage/components';
import { button, ripple } from './ChangeLocationButton.style';
import { PRODUCT_FULFILLMENT_CHANGE_LOCATION } from '../../constants/Portals';

/**
 * Renders the Change Location button.
 * @param {Object} props The component props.
 * @param {Function} props.onClick The click handler.
 * @param {boolean} [props.disabled=false] Whether the button is disabled.
 * @returns {JSX.Element} The rendered component.
 */
export const ChangeLocationButtonUnwrapped = ({ onClick, disabled }) => (
  <SurroundPortals
    portalName={PRODUCT_FULFILLMENT_CHANGE_LOCATION}
    portalProps={{
      onClick,
      disabled,
    }}
  >
    <RippleButton
      onClick={onClick}
      className={button}
      disabled={disabled}
      rippleClassName={ripple}
      type="secondary"
      flat
    >
      <I18n.Text string="locations.change_location" />
    </RippleButton>
  </SurroundPortals>
);

ChangeLocationButtonUnwrapped.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ChangeLocationButtonUnwrapped.defaultProps = {
  disabled: false,
};

export const ChangeLocationButton = React.memo(ChangeLocationButtonUnwrapped);
