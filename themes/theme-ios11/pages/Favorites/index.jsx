import React from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
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
const Favorites = ({ initialLoading, products, favoritesProductsIds }) => {
  if (initialLoading) {
    return (
      <View>
        <BackBar title="titles.favorites" />
        <LoadingIndicator />
      </View>
    );
  }

  const { hasMultipleFavoritesLists } = appConfig.favoritesMode;

  return (
    <View aria-hidden={false}>
      <BackBar title="titles.favorites" />
      {favoritesProductsIds.length > 0 || hasMultipleFavoritesLists ? (
        <FavoritesList products={products} />
      ) : (
        <EmptyFavorites />
      )}
    </View>
  );
};

Favorites.propTypes = {
  favoritesProductsIds: PropTypes.arrayOf(PropTypes.string),
  initialLoading: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.shape()),
};

Favorites.defaultProps = {
  initialLoading: true,
  products: [],
  favoritesProductsIds: [],
};

export default connect(Favorites);
