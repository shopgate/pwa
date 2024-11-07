import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import { View } from '@shopgate/engage/components';
import { DefaultBar } from 'Components/AppBar/presets';
import connect from './connector';
import EmptyFavorites from './components/EmptyFavorites';
import FavoritesList from './components/FavoritesList';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Favorites = ({
  initialLoading,
  favoritesCount,
  hasMultipleFavoritesListsSupport,
}) => {
  if (initialLoading) {
    return (
      <View>
        <DefaultBar title="titles.favorites" />
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View>
      <DefaultBar title="titles.favorites" />
      {favoritesCount > 0 || hasMultipleFavoritesListsSupport ? (
        <FavoritesList />
      ) : (
        <EmptyFavorites />
      )}
    </View>
  );
};

Favorites.propTypes = {
  favoritesCount: PropTypes.number,
  hasMultipleFavoritesListsSupport: PropTypes.bool,
  initialLoading: PropTypes.bool,
};

Favorites.defaultProps = {
  initialLoading: true,
  hasMultipleFavoritesListsSupport: false,
  favoritesCount: 0,
};

export default connect(Favorites);
