/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import CardList from 'Components/CardList';
import Item from './components/Item';
import styles from './style';

/**
 * Favorites list. Renders items if available.
 * @property {Array} products Products.
 * @returns {JSX}
 */
const FavoritesList = ({ products }) => {
  if (!products.length) {
    return null;
  }
  return (
    <div className={styles.container}>
      <CardList>
        {products.map(product => <Item key={product.id} product={product} />)}
      </CardList>
    </div>
  );
};

FavoritesList.prototype.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default FavoritesList;
