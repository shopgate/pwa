// @flow
import React from 'react';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { button, ripple } from './ChangeLocationButton.style';

type Props = {
  onClick: () => void,
  disabled?: boolean,
}

/**
 * @param {Function} onClick callback.
 * @returns {JSX}
 */
export const ChangeLocationButtonUnwrapped = ({ onClick, disabled }: Props) => (
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
);

ChangeLocationButtonUnwrapped.defaultProps = {
  disabled: false,
};

export const ChangeLocationButton = React.memo<Props>(ChangeLocationButtonUnwrapped);
