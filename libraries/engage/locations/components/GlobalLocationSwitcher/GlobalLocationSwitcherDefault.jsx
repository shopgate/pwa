import React from 'react';
import PropTypes from 'prop-types';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

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
