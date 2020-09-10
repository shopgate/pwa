import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';

import {
  wrapper, inner, innerStandalone, heading, name, button,
} from './FulfillmentSlotSwitcherBar.style';

/**
 * @returns {JSX}
 */
const GlobalLocationSwitcherBar = ({ locationName, handleChange, standalone }) => (
  <div className={wrapper}>
    <div className={classNames(inner, { [innerStandalone]: standalone })}>
      <span className={heading}>
        {i18n.text('locations.your_current_location.heading')}
      </span>
      <span className={name}>{ locationName }</span>
      <RippleButton
        onClick={handleChange}
        type="secondary"
        className={button}
        flat
      >
        <I18n.Text string="locations.your_current_location.change" />
      </RippleButton>
    </div>
  </div>
);

GlobalLocationSwitcherBar.propTypes = {
  handleChange: PropTypes.func.isRequired,
  locationName: PropTypes.string.isRequired,
  standalone: PropTypes.bool,
};

GlobalLocationSwitcherBar.defaultProps = {
  standalone: false,
};

export default GlobalLocationSwitcherBar;
