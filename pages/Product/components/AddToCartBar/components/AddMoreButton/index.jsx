import React from 'react';
import PropTypes from 'prop-types';
import AddToCartButton from '@shopgate/pwa-ui-shared/AddToCartButton';
import { withForwardedRef } from '@shopgate/engage/core';
import styles from './style';

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
  const { __ } = context.i18n();
  return (
    <AddToCartButton
      onClick={handleAddToCart}
      onReset={onReset}
      isDisabled={disabled}
      isLoading={loading}
      className={styles.container}
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
