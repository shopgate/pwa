import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';

import {
  wrapper, heading, name, button,
} from './FulfillmentSlotSwitcherDefault.style';
import { getTimeSlotDisplayText } from './time';

/**
 * @returns {JSX}
 */
const FulfillmentSlotSwitcherDefault = ({ handleChange, fulfillmentSlot, editable }) => {
  const displayTime = useMemo(() => getTimeSlotDisplayText(fulfillmentSlot), [fulfillmentSlot]);

  return (
    <div className={wrapper}>
      <div className={heading}>{i18n.text('locations.your_current_timeslot.heading')}</div>
      <div className={name}>
        <span>{displayTime}</span>
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
};

FulfillmentSlotSwitcherDefault.propTypes = {
  handleChange: PropTypes.func.isRequired,
  editable: PropTypes.bool,
  fulfillmentSlot: PropTypes.shape(),
};
FulfillmentSlotSwitcherDefault.defaultProps = {
  fulfillmentSlot: null,
  editable: true,
};

export default FulfillmentSlotSwitcherDefault;
