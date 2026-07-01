import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n, Typography } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { getTimeSlotDisplayText } from './time';

const { variables } = themeConfig;

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
    height: variables.filterbar.height,
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
    letterSpacing: '0.05em',
    padding: `${theme.spacing(0.375, 0)} !important`,
    ' *': {
      fontSize: theme.typography.body2.fontSize,
      textTransform: 'initial',
      padding: '0 !important',
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightMedium,
    },
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
          <RippleButton
            onClick={handleChange}
            type="secondary"
            className={classes.button}
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
