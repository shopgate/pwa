import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { getTimeSlotDisplayText } from './time';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.875rem',
    padding: `0 ${variables.gap.big}px`,
    flexShrink: 0,
  },
  heading: {
    color: 'var(--color-text-medium-emphasis)',
  },
  name: {
    fontWeight: 500,
    color: 'var(--color-text-high-emphasis)',
  },
  button: {
    fontSize: '0.625rem !important',
    letterSpacing: '0.05em',
    padding: `${variables.gap.xsmall * 0.75}px 0 !important`,
    ' *': {
      padding: '0 !important',
    },
  },
});

/**
 * @returns {JSX}
 */
const FulfillmentSlotSwitcherDefault = ({ handleChange, fulfillmentSlot, editable }) => {
  const { classes } = useStyles();
  const displayTime = useMemo(() => getTimeSlotDisplayText(fulfillmentSlot), [fulfillmentSlot]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.heading}>{i18n.text('locations.your_current_timeslot.heading')}</div>
      <div className={classes.name}>
        <span>{displayTime}</span>
        <RippleButton
          onClick={handleChange}
          type="secondary"
          className={classes.button}
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
