import React from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.875rem',
    padding: theme.spacing(0, 2),
    flexShrink: 0,
  },
  heading: {
    color: 'var(--color-text-medium-emphasis)',
  },
  name: {
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  button: {
    fontSize: '0.625rem !important',
    letterSpacing: '0.05em',
    padding: [theme.spacing(0.375, 0), '!important'],
    ' *': {
      padding: '0 !important',
    },
  },
}));

/**
 * @returns {JSX}
 */
const GlobalLocationSwitcherDefault = ({ locationName, handleChange, editable }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.heading}>{i18n.text('locations.your_current_location.heading')}</div>
      <div className={classes.name}>
        <span>{ locationName }</span>
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

GlobalLocationSwitcherDefault.propTypes = {
  editable: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  locationName: PropTypes.string.isRequired,
};

export default GlobalLocationSwitcherDefault;
