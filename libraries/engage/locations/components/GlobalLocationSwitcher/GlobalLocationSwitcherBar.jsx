/* eslint-disable jsx-a11y/aria-role */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';

import {
  wrapper, inner, innerStandalone, heading, name, button,
} from './GlobalLocationSwitcherBar.style';

/**
 * @returns {JSX}
 */
const GlobalLocationSwitcherBar = ({ locationName, handleChange, standalone }) => (
  <div className={wrapper}>
    <div className={classNames(inner, { [innerStandalone]: standalone })}>
      <span role="text">
        <span className={heading}>
          {i18n.text('locations.your_current_location.heading')}
        </span>
        <span className={name}>{ locationName }</span>
      </span>
      <RippleButton
        onClick={handleChange}
        type="secondary"
        className={button}
        aria-haspopup
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
/* eslint-enable jsx-a11y/aria-role */
