import React from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';

import {
  wrapper, heading, name, button,
} from './GlobalLocationSwitcherDefault.style';

/**
 * @returns {JSX}
 */
const GlobalLocationSwitcherDefault = ({ locationName, handleChange, editable }) => (
  <div className={wrapper}>
    <div className={heading}>{i18n.text('locations.your_current_location.heading')}</div>
    <div className={name}>
      <span>{ locationName }</span>
      <RippleButton
        onClick={handleChange}
        type="secondary"
        className={button}
        disabled={!editable}
        flat
      >
        <I18n.Text string="locations.your_current_location.change" />
      </RippleButton>
    </div>
  </div>
);

GlobalLocationSwitcherDefault.propTypes = {
  editable: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  locationName: PropTypes.string.isRequired,
};

export default GlobalLocationSwitcherDefault;
