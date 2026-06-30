import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n, Typography } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { getTimeSlotDisplayText } from './time';

const useStyles = makeStyles()(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 2),
    flexShrink: 0,
  },
  button: {
    letterSpacing: '0.05em',
    padding: `${theme.spacing(0.375, 0)} !important`,
    ' *': {
      padding: '0 !important',
    },
  },
}));

/**
 * @returns {JSX.Element}
 */
const FulfillmentSlotSwitcherDefault = ({ handleChange, fulfillmentSlot, editable }) => {
  const { classes } = useStyles();
  const displayTime = useMemo(() => getTimeSlotDisplayText(fulfillmentSlot), [fulfillmentSlot]);

  return (
    <div className={classes.wrapper}>
      <Typography variant="body2" component="div" color="textSecondary">
        {i18n.text('locations.your_current_timeslot.heading')}
      </Typography>
      <div>
        <Typography variant="body2" component="span" color="textPrimary" fontWeight="medium">
          {displayTime}
        </Typography>
        <RippleButton
          onClick={handleChange}
          type="secondary"
          className={classes.button}
          disabled={!editable}
          flat
        >
          <Typography variant="caption" component="span" fontWeight="bold">
            <I18n.Text string="locations.your_current_location.change" />
          </Typography>
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
