import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  button: {
    position: 'absolute',
    right: 0,
    top: 0,
    transition: theme.transitions.create(['width', 'background-color']),
    padding: theme.spacing(1, 1),
  },
}));

/**
 * Add to cart button component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const AddToCartButton = ({
  disabled,
  handleAddToCart,
  itemCount,
  openCart,
  onReset,
}) => {
  const { classes, cx } = useStyles();
  const [opened, setOpened] = useState(!!itemCount);

  useEffect(() => {
    setOpened(!!itemCount);
  }, [itemCount]);

  const handleClick = useCallback(() => {
    if (!itemCount) {
      handleAddToCart();
      setTimeout(() => {
        onReset();
      }, 0);
      return;
    }

    setOpened(true);
    openCart();
  }, [itemCount, handleAddToCart, onReset, openCart]);

  const style = opened ? { width: '40%' } : null;
  const ariaLabel = i18n.text(!itemCount ? 'product.add_to_cart' : 'product.go_to_cart');

  return (
    <Button
      color="cta"
      fullWidth
      className={cx(classes.button, 'theme__product__add-to-cart-bar__add-to-cart-button')}
      style={style}
      onClick={handleClick}
      disabled={disabled}
      testId="addToCartBarButton"
      aria-label={ariaLabel}
    >
      <I18n.Text string={!itemCount ? 'product.add_to_cart' : 'product.go_to_cart'} />
    </Button>
  );
};

AddToCartButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  openCart: PropTypes.func.isRequired,
  onReset: PropTypes.func,
};

AddToCartButton.defaultProps = {
  onReset: () => { },
};

export default connect(AddToCartButton);
