import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import { View } from '@shopgate/engage/components';
import { BackBar } from 'Components/AppBar/presets';
import connect from './connector';
import EmptyFavorites from './components/EmptyFavorites';
import FavoritesList from './components/FavoritesList';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Favorites = ({ initialLoading, products, lists }) => {
  if (initialLoading) {
    return (
      <View>
        <BackBar title="titles.favorites" />
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View aria-hidden={false}>
      <BackBar title="titles.favorites" />
      {(!products.length && !lists.length) && <EmptyFavorites />}
      {(products.length > 0 || lists.length > 0) && <FavoritesList products={products} />}
    </View>
  );
};

Favorites.propTypes = {
  initialLoading: PropTypes.bool,
  lists: PropTypes.arrayOf(PropTypes.shape()),
  products: PropTypes.arrayOf(PropTypes.shape()),
};

Favorites.defaultProps = {
  initialLoading: true,
  products: [],
  lists: [],
};

export default connect(Favorites);
