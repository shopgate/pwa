import React from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import connect from './connector';
import EmptyFavorites from './components/EmptyFavorites';
import FavoritesList from './components/FavoritesList';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Favorites = ({ initialLoading, products }) => {
  if (initialLoading) {
    return (
      <View>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View>
      {!products.length && <EmptyFavorites />}
      {(products.length > 0) && <FavoritesList products={products} />}
    </View>
  );
};

Favorites.propTypes = {
  initialLoading: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.shape()),
};

Favorites.defaultProps = {
  initialLoading: true,
  products: [],
};

export default connect(Favorites);
