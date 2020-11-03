import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';

import {
  wrapper, inner, innerStandalone, heading, name, button,
} from './FulfillmentSlotSwitcherBar.style';
import { getTimeSlotDisplayText } from './time';

/**
 * @returns {JSX}
 */
const FulfillmentSlotSwitcherBar = ({
  fulfillmentSlot, handleChange, standalone, editable,
}) => {
  const displayTime = useMemo(() => getTimeSlotDisplayText(fulfillmentSlot), [fulfillmentSlot]);
  return (
    <div className={wrapper}>
      <div className={classNames(inner, { [innerStandalone]: standalone })}>
        <span className={heading}>
          {i18n.text('locations.your_current_timeslot.heading')}
        </span>
        <span className={name}>{displayTime}</span>
        { editable && (
          <RippleButton
            onClick={handleChange}
            type="secondary"
            className={button}
            flat
          >
            <I18n.Text string="locations.your_current_location.change" />
          </RippleButton>
        )}
      </div>
    </div>);
};

FulfillmentSlotSwitcherBar.propTypes = {
  handleChange: PropTypes.func.isRequired,
  editable: PropTypes.bool,
  fulfillmentSlot: PropTypes.shape(),
  standalone: PropTypes.bool,
};

FulfillmentSlotSwitcherBar.defaultProps = {
  fulfillmentSlot: null,
  standalone: false,
  editable: true,
};

export default FulfillmentSlotSwitcherBar;
