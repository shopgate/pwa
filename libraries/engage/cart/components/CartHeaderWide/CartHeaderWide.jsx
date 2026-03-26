import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  header: {
    fontSize: '2.125rem',
    lineHeight: '2.25rem',
    padding: theme.spacing(4),
  },
}));

/**
 * @return {JSX}
 */
const CartHeaderWide = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.header}>
      { i18n.text('navigation.cart') }
    </div>
  );
};

export default CartHeaderWide;
