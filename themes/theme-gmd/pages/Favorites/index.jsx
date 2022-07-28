import React from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import { View } from '@shopgate/engage/components';
import { DefaultBar } from 'Components/AppBar/presets';
import connect from './connector';
import FavoritesList from './components/FavoritesList';
import EmptyFavorites from './components/EmptyFavorites';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Favorites = ({ initialLoading, products, favoriteProductIds }) => {
  if (initialLoading) {
    return (
      <View>
        <DefaultBar title="titles.favorites" />
        <LoadingIndicator />
      </View>
    );
  }

  const { hasMultipleFavoritesLists } = appConfig.favoritesMode;

  return (
    <View aria-hidden={false}>
      <DefaultBar title="titles.favorites" />
      {favoriteProductIds.length > 0 || hasMultipleFavoritesLists ? (
        <FavoritesList products={products} />
      ) : (
        <EmptyFavorites />
      )}
    </View>
  );
};

Favorites.propTypes = {
  favoriteProductIds: PropTypes.arrayOf(PropTypes.string),
  initialLoading: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.shape()),
};

Favorites.defaultProps = {
  initialLoading: true,
  products: [],
  favoriteProductIds: [],
};

export default connect(Favorites);
