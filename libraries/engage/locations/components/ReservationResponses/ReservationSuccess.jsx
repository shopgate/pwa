import React, { useContext } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { i18n } from '../../../core/helpers/i18n';
import { FulfillmentContext } from '../../locations.context';

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
  orderNum: {
    padding: 0,
    fontSize: '1.1875rem',
    fontWeight: 'bold',
    margin: `0 0 ${variables.gap.big}px`,
    border: 0,
  },
});

/**
 * Renders the reservation success screen.
 * @returns {JSX}
 */
export function ReservationSuccess() {
  const { classes } = useStyles();
  const { orderNumbers } = useContext(FulfillmentContext);

  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>
        {i18n.text('locations.success_title')}
      </h2>
      <p className={classes.body}>
        {i18n.text('locations.success_copy')}
      </p>
      <p className={classes.body}>
        {i18n.text('locations.success_order_num')}
      </p>
      {orderNumbers !== null && (
        <p className={classes.orderNum}>
          {orderNumbers[0]}
        </p>
      )}
    </div>
  );
}
