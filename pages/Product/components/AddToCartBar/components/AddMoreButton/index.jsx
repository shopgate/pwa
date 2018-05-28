import React from 'react';
import PropTypes from 'prop-types';
import AddMoreIcon from '@shopgate/pwa-ui-shared/icons/AddMoreIcon';
import styles from './style';

/**
 * The AddMoreButton component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const AddMoreButton = ({ handleAddToCart }) => (
  <button onClick={handleAddToCart} className={styles.container}>
    <AddMoreIcon className={styles.icon}/>
  </button>
);

AddMoreButton.propTypes = {
  handleAddToCart: PropTypes.func.isRequired,
};

export default AddMoreButton;
