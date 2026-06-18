import React, { useContext } from 'react';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '../../../core/helpers/i18n';
import { FulfillmentContext } from '../../locations.context';

const useStyles = makeStyles()(theme => ({
  container: {
    background: theme.palette.background.surface,
    padding: theme.spacing(2, 1.5, 16),
    boxShadow: 'inset rgba(0, 0, 0, .117647) 0 1px 6px, inset rgba(0, 0, 0, .117647) 0 1px 4px',
  },
  heading: {
    fontWeight: theme.typography.fontWeightBold,
    margin: theme.spacing(1, 0, 2.5),
  },
  body: {
    padding: theme.spacing(2, 0, 0),
    margin: theme.spacing(0, 0, 2.5),
    border: 0,
  },
  orderNum: {
    padding: 0,
    fontWeight: theme.typography.fontWeightBold,
    margin: theme.spacing(0, 0, 2),
    border: 0,
  },
}));

/**
 * Renders the reservation success screen.
 * @returns {JSX}
 */
export function ReservationSuccess() {
  const { classes } = useStyles();
  const { orderNumbers } = useContext(FulfillmentContext);

  return (
    <div className={classes.container}>
      <Typography variant="h4" component="h2" className={classes.heading}>
        {i18n.text('locations.success_title')}
      </Typography>
      <Typography variant="body1" component="p" className={classes.body}>
        {i18n.text('locations.success_copy')}
      </Typography>
      <Typography variant="body1" component="p" className={classes.body}>
        {i18n.text('locations.success_order_num')}
      </Typography>
      {orderNumbers !== null && (
        <Typography variant="h3" component="p" className={classes.orderNum}>
          {orderNumbers[0]}
        </Typography>
      )}
    </div>
  );
}
