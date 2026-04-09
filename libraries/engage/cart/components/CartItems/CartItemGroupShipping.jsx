import React from 'react';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import { makeStyles } from '@shopgate/engage/styles';
import { LocalShippingIcon } from '../../../components';
import { i18n } from '../../../core';

const useStyles = makeStyles()(theme => ({
  address: {
    display: 'flex',
    flexFlow: 'row nowrap',
    fontSize: '0.875rem',
  },
  shippingIcon: {
    fontSize: '1.25rem',
    padding: theme.spacing(1, 2, 1, 0),
    transform: 'rotateY(180deg)',
  },
  shippingTitle: {
    fontWeight: 600,
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
          <div className={classes.shippingTitle}>
            {i18n.text('locations.method.direct_ship')}
          </div>
        </div>
      </div>
    </CardListItem>
  );
};
