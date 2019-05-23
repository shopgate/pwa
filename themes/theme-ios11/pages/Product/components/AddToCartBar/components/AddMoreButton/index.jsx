import React from 'react';
import PropTypes from 'prop-types';
import { AddToCartButton } from '@shopgate/engage/components';
import styles from './style';

/**
 * The AddMoreButton component.
 * @param {Function} handleAddToCart The addToCart handler.
 * @param {boolean} disabled Should the button shown as disabled.
 * @param {boolean} loading Should the button shown as loading.
 * @param {Function} onReset The reset handler.
 * @return {JSX}
 */
const AddMoreButton = ({
  handleAddToCart, disabled, loading, onReset,
}) => (
  <AddToCartButton
    onClick={handleAddToCart}
    onReset={onReset}
    isDisabled={disabled}
    isLoading={loading}
    className={styles.container}
  />
);

AddMoreButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onReset: PropTypes.func,
};

AddMoreButton.defaultProps = {
  onReset: () => {},
};

export default AddMoreButton;
