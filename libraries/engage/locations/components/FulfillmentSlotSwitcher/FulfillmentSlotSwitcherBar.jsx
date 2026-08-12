import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { I18n, Typography } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { getTimeSlotDisplayText } from './time';

const useStyles = makeStyles()(theme => ({
  wrapper: {
    color: theme.palette.text.primary,
    background: theme.palette.background.emphasized,
  },
  inner: {
    display: 'flex',
    flexShrink: 0,
    margin: theme.spacing(0, 2),
    borderBottom: `1px solid ${theme.components.border.light}`,
    alignItems: 'center',
    height: theme.components.filterBar.height,
  },
  innerStandalone: {
    borderBottom: 'none',
  },
  heading: {
    paddingRight: theme.spacing(1),
    ':after': {
      content: '":"',
    },
  },
  button: {
    marginLeft: 'auto',
    // The bar label is intentionally sentence case, unlike the uppercase button default.
    textTransform: 'none',
    padding: theme.spacing(0.375, 0),
  },
}));

/**
 * @returns {JSX.Element}
 */
const FulfillmentSlotSwitcherBar = ({
  fulfillmentSlot, handleChange, standalone, editable,
}) => {
  const { classes, cx } = useStyles();
  const displayTime = useMemo(() => getTimeSlotDisplayText(fulfillmentSlot), [fulfillmentSlot]);
  return (
    <div className={classes.wrapper}>
      <div className={cx(classes.inner, { [classes.innerStandalone]: standalone })}>
        <Typography variant="body2" component="span" className={classes.heading}>
          {i18n.text('locations.your_current_timeslot.heading')}
        </Typography>
        <Typography variant="body2" component="span" fontWeight="medium">
          {displayTime}
        </Typography>
        { editable && (
          <Button
            variant="text"
            color="inherit"
            size="small"
            onClick={handleChange}
            className={classes.button}
          >
            <I18n.Text string="locations.your_current_location.change" />
          </Button>
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
