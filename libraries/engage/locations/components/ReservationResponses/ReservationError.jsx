import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { i18n } from '../../../core/helpers/i18n';

const { variables, colors } = themeConfig;

const useStyles = makeStyles()({
  container: {
    background: colors.background,
    padding: `${variables.gap.big}px ${variables.gap.small * 1.5}px ${variables.gap.xxbig * 2}px`,
    boxShadow: 'inset rgba(0, 0, 0, .117647) 0 1px 6px, inset rgba(0, 0, 0, .117647) 0 1px 4px',
  },
  heading: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    margin: `${variables.gap.small}px 0 ${variables.gap.bigger}px`,
  },
  body: {
    padding: `${variables.gap.big}px 0 0`,
    margin: `0 0 ${variables.gap.bigger}px`,
    border: 0,
  },
});

/**
 * Renders the reservation error screen.
 * @returns {JSX}
 */
export function ReservationError() {
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>
        {i18n.text('locations.error_title')}
      </h2>
      <p className={classes.body}>
        {i18n.text('locations.error_copy')}
      </p>
    </div>
  );
}
