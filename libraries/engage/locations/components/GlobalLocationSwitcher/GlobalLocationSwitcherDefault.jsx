import React from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n, Typography } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 2),
    flexShrink: 0,
  },
  name: {
    color: theme.palette.text.primary,
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
const GlobalLocationSwitcherDefault = ({ locationName, handleChange, editable }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Typography variant="body2" component="div" color="textSecondary">
        {i18n.text('locations.your_current_location.heading')}
      </Typography>
      <div>
        <Typography variant="body2" component="span" fontWeight="medium" className={classes.name}>
          {locationName}
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

GlobalLocationSwitcherDefault.propTypes = {
  editable: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  locationName: PropTypes.string.isRequired,
};

export default GlobalLocationSwitcherDefault;
