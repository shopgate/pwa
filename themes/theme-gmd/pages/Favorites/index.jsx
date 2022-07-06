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
const Favorites = ({ initialLoading, products }) => {
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
      {products.length > 0 || hasMultipleFavoritesLists ? (
        <FavoritesList products={products} />
      ) : (
        <EmptyFavorites />
      )}
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
