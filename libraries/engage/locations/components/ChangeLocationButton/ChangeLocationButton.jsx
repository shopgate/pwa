// @flow
import React from 'react';
import { RippleButton, I18n, SurroundPortals } from '@shopgate/engage/components';
import { button, ripple } from './ChangeLocationButton.style';
import { PRODUCT_FULFILLMENT_CHANGE_LOCATION } from '../../constants/Portals';

type Props = {
  onClick: () => void,
  disabled?: boolean,
}

/**
 * @param {Object} props .
 * @returns {JSX}
 */
export const ChangeLocationButtonUnwrapped = ({ onClick, disabled }: Props) => (
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

ChangeLocationButtonUnwrapped.defaultProps = {
  disabled: false,
};

export const ChangeLocationButton = React.memo<Props>(ChangeLocationButtonUnwrapped);
