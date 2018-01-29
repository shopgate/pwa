/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import AddMoreIcon from 'Components/icons/AddMoreIcon';
import connect from './connector';
import styles from './style';

/**
 * The AddMoreButton component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const AddMoreButton = ({ handleAddToCart }) => (
  <button onClick={handleAddToCart} className={styles.container}>
    <AddMoreIcon />
  </button>
);

AddMoreButton.propTypes = {
  handleAddToCart: PropTypes.func.isRequired,
};

export default connect(AddMoreButton);
