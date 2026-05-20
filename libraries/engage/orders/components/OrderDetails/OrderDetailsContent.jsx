import React from 'react';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { I18n } from '@shopgate/engage/components';
import { useOrderDetails } from '../../hooks';
import OrderDetailsOrder from './OrderDetailsOrder';
import OrderDetailsAuthenticate from './OrderDetailsAuthenticate';

const useStyles = makeStyles()(theme => ({
  headline: {
    display: 'none',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      display: 'block',
      fontSize: '2rem',
      fontWeight: 'normal',
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
        <div className={classes.headline}>
          <I18n.Text string="titles.order_details" />
        </div>
      )}
      <OrderDetailsAuthenticate />
      <OrderDetailsOrder />
    </>
  );
};

export default OrderDetailsContent;
