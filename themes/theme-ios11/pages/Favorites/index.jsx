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
const Favorites = ({
  initialLoading,
  favoritesCount,
  hasMultipleFavoritesListsSupport,
}) => {
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
  favoritesCount: 0,
  hasMultipleFavoritesListsSupport: false,
};

export default connect(Favorites);
