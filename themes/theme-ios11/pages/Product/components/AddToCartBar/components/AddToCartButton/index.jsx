import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './connector';

const { colors, variables } = themeConfig;
const padYTop = (variables.gap.big * 0.75) - 1;
const padX = variables.gap.big * 0.6;
const padYBottom = (variables.gap.big * 0.75) + 1;

const useStyles = makeStyles()(() => ({
  button: {
    position: 'absolute',
    right: 0,
    top: 0,
    display: 'block',
    flexGrow: 1,
    background: 'var(--color-button-cta)',
    color: 'var(--color-button-cta-contrast)',
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 5,
    width: '100%',
    outline: 0,
    transition: 'width 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    padding: `${padYTop}px ${padX}px ${padYBottom}px`,
    ':disabled': {
      cursor: 'not-allowed',
    },
  },
  disabled: {
    background: colors.shade5,
    color: colors.light,
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
  const className = cx(
    classes.button,
    'theme__product__add-to-cart-bar__add-to-cart-button',
    { [classes.disabled]: disabled }
  );

  const ariaLabel = i18n.text(!itemCount ? 'product.add_to_cart' : 'product.go_to_cart');

  return (
    <button
      className={className}
      style={style}
      onClick={handleClick}
      disabled={disabled}
      data-test-id="addToCartBarButton"
      aria-label={ariaLabel}
      type="button"
    >
      <I18n.Text string={!itemCount ? 'product.add_to_cart' : 'product.go_to_cart'} />
    </button>
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
