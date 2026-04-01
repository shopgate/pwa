import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { getTimeSlotDisplayText } from './time';

const { variables } = themeConfig;

const useStyles = makeStyles()(theme => ({
  wrapper: {
    fontSize: '0.875rem',
    color: theme.palette.text.primary,
    background: 'var(--color-background-accent)',
  },
  inner: {
    display: 'flex',
    flexShrink: 0,
    margin: theme.spacing(0, 2),
    borderBottom: '1px solid #eaeaea',
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
  name: {
    fontWeight: 500,
  },
  button: {
    marginLeft: 'auto',
    letterSpacing: '0.05em',
    padding: `${theme.spacing(0.375, 0)} !important`,
    ' *': {
      fontSize: '0.875rem',
      textTransform: 'initial',
      padding: '0 !important',
      color: theme.palette.text.primary,
      fontWeight: 500,
    },
  },
}));

/**
 * @returns {JSX}
 */
const FulfillmentSlotSwitcherBar = ({
  fulfillmentSlot, handleChange, standalone, editable,
}) => {
  const { classes, cx } = useStyles();
  const displayTime = useMemo(() => getTimeSlotDisplayText(fulfillmentSlot), [fulfillmentSlot]);
  return (
    <div className={classes.wrapper}>
      <div className={cx(classes.inner, { [classes.innerStandalone]: standalone })}>
        <span className={classes.heading}>
          {i18n.text('locations.your_current_timeslot.heading')}
        </span>
        <span className={classes.name}>{displayTime}</span>
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
