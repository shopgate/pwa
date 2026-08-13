import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Typography } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';

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
  },
  button: {
    marginLeft: 'auto',
    textTransform: 'none',
  },
}));

/**
 * @returns {JSX.Element}
 */
const GlobalLocationSwitcherBar = ({ locationName, handleChange, standalone }) => {
  const { classes, cx } = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={cx(classes.inner, { [classes.innerStandalone]: standalone })}>
        <span aria-label={`${i18n.text('locations.your_current_location.heading')}: ${locationName}`}>
          <Typography variant="body2" component="span" className={classes.heading}>
            {`${i18n.text('locations.your_current_location.heading')}:`}
          </Typography>
          <Typography variant="body2" component="span" fontWeight="medium">
            {locationName}
          </Typography>
        </span>
        <Button
          variant="text"
          size="small"
          dense
          onClick={handleChange}
          className={classes.button}
          aria-haspopup
        >
          <I18n.Text string="locations.your_current_location.change" />
        </Button>
      </div>
    </div>
  );
};

GlobalLocationSwitcherBar.propTypes = {
  handleChange: PropTypes.func.isRequired,
  locationName: PropTypes.string.isRequired,
  standalone: PropTypes.bool,
};

GlobalLocationSwitcherBar.defaultProps = {
  standalone: false,
};

export default GlobalLocationSwitcherBar;
