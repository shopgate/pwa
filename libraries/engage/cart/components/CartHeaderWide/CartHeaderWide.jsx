import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  header: {
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
    <Typography variant="h1" component="div" className={classes.header}>
      { i18n.text('navigation.cart') }
    </Typography>
  );
};

export default CartHeaderWide;
