import React from 'react';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { LocalShippingIcon } from '../../../components';
import { i18n } from '../../../core';

const useStyles = makeStyles()(theme => ({
  address: {
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  shippingIcon: {
    fontSize: theme.components.icon.small,
    padding: theme.spacing(1, 2, 1, 0),
    transform: 'rotateY(180deg)',
  },
  shippingTitle: {
    fontWeight: theme.typography.fontWeightBold,
    padding: theme.spacing(1),
  },
}));

/**
 * Renders the cart item group.
 * @returns {JSX.Element}
 */
export const CartItemGroupShipping = () => {
  const { classes } = useStyles();

  return (
    <CardListItem>
      <div className={classes.address}>
        <div className={classes.shippingIcon}>
          <LocalShippingIcon />
        </div>
        <div>
          <Typography variant="body2" component="div" className={classes.shippingTitle}>
            {i18n.text('locations.method.direct_ship')}
          </Typography>
        </div>
      </div>
    </CardListItem>
  );
};
