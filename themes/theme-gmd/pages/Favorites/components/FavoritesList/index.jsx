import React from 'react';
import PropTypes from 'prop-types';
import { CardList } from '@shopgate/engage/components';
import Item from './components/Item';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const FavoritesList = ({ products }) => (
  <div className={styles.container}>
    <CardList>
      {products.map(product => (
        <Item key={product.id} product={product} />
      ))}
    </CardList>
  </div>
);

FavoritesList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape),
};

FavoritesList.defaultProps = {
  products: [],
};

export default FavoritesList;
