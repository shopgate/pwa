import React from 'react';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { I18n } from '@shopgate/engage/components';
import { useOrderDetails } from '../../hooks';
import OrderDetailsOrder from './OrderDetailsOrder';
import OrderDetailsAuthenticate from './OrderDetailsAuthenticate';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  headline: {
    display: 'none',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      display: 'block',
      fontSize: '2rem',
      fontWeight: 'normal',
      paddingBottom: variables.gap.big,
      padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
    },
  },
});

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
