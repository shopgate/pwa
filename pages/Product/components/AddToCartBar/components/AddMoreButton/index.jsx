import React from 'react';
import PropTypes from 'prop-types';
import AddToCartButton from '@shopgate/pwa-ui-shared/AddToCartButton';
import styles from './style';

/**
 * The AddMoreButton component.
 * @param {Function} handleAddToCart The addToCart handler.
 * @param {boolean} isDisabled Should the button shown as disabled.
 * @param {boolean} isLoading Should the button shown as loading.
 * @param {boolean} isOrderable Tells if the current product is orderable.
 * @return {JSX}
 */
const AddMoreButton = ({
  handleAddToCart, isDisabled, isLoading, isOrderable,
}) => (
  <AddToCartButton
    handleAddToCart={handleAddToCart}
    isDisabled={isDisabled}
    isLoading={isLoading}
    isOrderable={isOrderable}
    className={styles.container}
  />
);

AddMoreButton.propTypes = {
  handleAddToCart: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isOrderable: PropTypes.bool.isRequired,
};

export default AddMoreButton;
