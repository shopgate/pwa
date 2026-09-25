import React from 'react';
import { I18n } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { makeStyles } from '@shopgate/engage/styles';
import { useCartItemProduct } from './CartItem.hooks';

const useStyles = makeStyles()(theme => ({
  button: {
    marginTop: theme.spacing(2),
    textTransform: 'none',
  },
}));

/**
 * @returns {JSX.Element}
 */
const CartItemProductLayoutWideRemoveItem = () => {
  const { classes } = useStyles();
  const { handleRemove } = useCartItemProduct();

  return (
    <Button
      variant="text"
      color="primary"
      onClick={handleRemove}
      className={classes.button}
    >
      <I18n.Text string="cart.remove_item" />
    </Button>
  );
};

export { CartItemProductLayoutWideRemoveItem };
