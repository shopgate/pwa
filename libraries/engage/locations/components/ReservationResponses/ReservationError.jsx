import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '../../../core/helpers/i18n';

const useStyles = makeStyles()(theme => ({
  container: {
    background: theme.palette.background.default,
    padding: theme.spacing(2, 1.5, 16),
    boxShadow: 'inset rgba(0, 0, 0, .117647) 0 1px 6px, inset rgba(0, 0, 0, .117647) 0 1px 4px',
  },
  heading: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    margin: theme.spacing(1, 0, 2.5),
  },
  body: {
    padding: theme.spacing(2, 0, 0),
    margin: theme.spacing(0, 0, 2.5),
    border: 0,
  },
}));

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
