// @flow
import React from 'react';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { button, ripple } from './ChangeLocationButton.style';

type Props = {
  onClick: () => void,
}

/**
 * @param {Function} onClick callback.
 * @returns {JSX}
 */
export const ChangeLocationButton = React.memo<Props>(({ onClick }: Props) => (
  <RippleButton
    onClick={onClick}
    className={button}
    rippleClassName={ripple}
    type="secondary"
    flat
  >
    <I18n.Text string="locations.change_location" />
  </RippleButton>
));
