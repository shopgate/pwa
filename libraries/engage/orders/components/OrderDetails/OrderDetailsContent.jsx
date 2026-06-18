import React from 'react';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { I18n, Typography } from '@shopgate/engage/components';
import { useOrderDetails } from '../../hooks';
import OrderDetailsOrder from './OrderDetailsOrder';
import OrderDetailsAuthenticate from './OrderDetailsAuthenticate';

const useStyles = makeStyles()(theme => ({
  headline: {
    display: 'none',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      display: 'block',
      fontWeight: theme.typography.fontWeightRegular,
      paddingBottom: theme.spacing(2),
      padding: theme.spacing(2, 2, 0),
    },
  },
}));

/**
 * @returns {JSX}
 */
const OrderDetailsContent = () => {
  const { classes } = useStyles();
  const {
    errorMessage,
    showForm,
    order,
  } = useOrderDetails();

  return (
    <>
      { (showForm || order || errorMessage) && (
        <Typography variant="h1" component="div" className={classes.headline}>
          <I18n.Text string="titles.order_details" />
        </Typography>
      )}
      <OrderDetailsAuthenticate />
      <OrderDetailsOrder />
    </>
  );
};

export default OrderDetailsContent;
