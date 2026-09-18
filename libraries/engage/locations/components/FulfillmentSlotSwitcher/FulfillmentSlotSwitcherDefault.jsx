import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { I18n, Typography } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
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
    // Inline affordance that follows the location name, so it carries no button chrome and
    // stays sentence case - matching the switcher bars that render the same action.
    padding: theme.spacing(0.375, 0),
    textTransform: 'none',
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
        <Button
          variant="text"
          color="primary"
          size="small"
          onClick={handleChange}
          className={classes.button}
          disabled={!editable}
        >
          <I18n.Text string="locations.your_current_location.change" />
        </Button>
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
