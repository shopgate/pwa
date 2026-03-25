import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { RippleButton, I18n } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  wrapper: {
    fontSize: '0.875rem',
    color: 'var(--color-text-high-emphasis)',
    background: 'var(--color-background-accent)',
  },
  inner: {
    display: 'flex',
    flexShrink: 0,
    margin: `0 ${variables.gap.big}px`,
    borderBottom: '1px solid #eaeaea',
    alignItems: 'center',
    height: variables.filterbar.height,
  },
  innerStandalone: {
    borderBottom: 'none',
  },
  heading: {
    paddingRight: variables.gap.small,
  },
  name: {
    fontWeight: 500,
  },
  button: {
    marginLeft: 'auto',
    letterSpacing: '0.05em',
    padding: `${variables.gap.xsmall * 0.75}px 0 !important`,
    ' *': {
      fontSize: '0.875rem',
      textTransform: 'initial',
      padding: '0 !important',
      color: 'var(--color-text-high-emphasis)',
      fontWeight: 500,
    },
  },
});

/**
 * @returns {JSX.Element}
 */
const GlobalLocationSwitcherBar = ({ locationName, handleChange, standalone }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classNames(classes.inner, { [classes.innerStandalone]: standalone })}>
        <span aria-label={`${i18n.text('locations.your_current_location.heading')}: ${locationName}`}>
          <span className={classes.heading}>
            {`${i18n.text('locations.your_current_location.heading')}:`}
          </span>
          <span className={classes.name}>{ locationName }</span>
        </span>
        <RippleButton
          onClick={handleChange}
          type="secondary"
          className={classes.button}
          aria-haspopup
          flat
        >
          <I18n.Text string="locations.your_current_location.change" />
        </RippleButton>
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
