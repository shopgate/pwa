import React from 'react';
import PropTypes from 'prop-types';
import AddToCartButton from '@shopgate/pwa-ui-shared/AddToCartButton';
import { withForwardedRef } from '@shopgate/engage/core';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';

// Width comes from `aspectRatio`, which Safari only supports from 15 on. The supported range starts
// at iOS 13.4, and there the button has no in flow content to size against, so this is its floor.
const MIN_SIZE = 46;

const useStyles = makeStyles()(theme => ({
  container: {
    display: 'block',
    flexShrink: 0,
    alignSelf: 'stretch',
    aspectRatio: '1',
    minWidth: MIN_SIZE,
    fontSize: '1.75rem !important',
    background: theme.palette.grey.light,
    transform: 'opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1) !important',
    outline: 0,
    boxShadow: 'none !important',
    borderRadius: '5px !important',
    width: 'auto !important',
    height: 'auto !important',
    zIndex: '0 !important',
    color: 'inherit',
    '&:active svg': {
      opacity: 0.5,
    },
  },
}));

/**
 * The AddMoreButton component.
 * @param {Function} handleAddToCart The addToCart handler.
 * @param {Object} context The component context.
 * @param {boolean} disabled Should the button shown as disabled.
 * @param {boolean} loading Should the button shown as loading.
 * @param {boolean} visible Should the button be visible.
 * @param {Function} onReset The reset handler.
 * @return {JSX}
 */
const AddMoreButton = ({
  handleAddToCart, disabled, loading, onReset, visible, forwardedRef,
}) => {
  const { classes, cx } = useStyles();

  return (
    <AddToCartButton
      onClick={handleAddToCart}
      onReset={onReset}
      isDisabled={disabled}
      isLoading={loading}
      className={cx(classes.container, 'theme__product__add-to-cart-bar__add-more-button')}
      aria-hidden={!visible}
      aria-label={i18n.text('product.add_to_cart')}
      ref={forwardedRef}
    />
  );
};

AddMoreButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  forwardedRef: PropTypes.shape(),
  onReset: PropTypes.func,
};

AddMoreButton.defaultProps = {
  onReset: () => {},
  forwardedRef: null,
};

export default withForwardedRef(AddMoreButton);
