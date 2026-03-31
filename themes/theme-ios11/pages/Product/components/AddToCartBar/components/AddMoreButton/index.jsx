import React from 'react';
import PropTypes from 'prop-types';
import AddToCartButton from '@shopgate/pwa-ui-shared/AddToCartButton';
import { withForwardedRef } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const useStyles = makeStyles()({
  container: {
    display: 'block',
    flexShrink: 0,
    fontSize: '1.75rem !important',
    background: themeColors.darkOverlay,
    transform: 'opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1) !important',
    outline: 0,
    boxShadow: 'none !important',
    borderRadius: '5px !important',
    width: '46px !important',
    height: '46px !important',
    zIndex: '0 !important',
    color: 'inherit',
    '&:active svg': {
      opacity: 0.5,
    },
  },
});

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
}, context) => {
  const { classes, cx } = useStyles();
  const { __ } = context.i18n();

  return (
    <AddToCartButton
      onClick={handleAddToCart}
      onReset={onReset}
      isDisabled={disabled}
      isLoading={loading}
      className={cx(classes.container, 'theme__product__add-to-cart-bar__add-more-button')}
      aria-hidden={!visible}
      aria-label={__('product.add_to_cart')}
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

AddMoreButton.contextTypes = {
  i18n: PropTypes.func,
};

export default withForwardedRef(AddMoreButton);
