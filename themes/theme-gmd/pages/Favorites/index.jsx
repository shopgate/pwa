import React from 'react';
import PropTypes from 'prop-types';
import { View, LoadingIndicator } from '@shopgate/engage/components';
import { DefaultBar } from 'Components/AppBar/presets';
import connect from './connector';
import EmptyFavorites from './components/EmptyFavorites';
import FavoritesList from './components/FavoritesList';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Favorites = ({ initialLoading, hasFavorites }) => {
  if (initialLoading) {
    return (
      <View>
        <DefaultBar title="titles.favorites" />
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View aria-hidden={false}>
      <DefaultBar title="titles.favorites" />
      {hasFavorites
        ? <FavoritesList />
        : <EmptyFavorites />
      }
    </View>
  );
};

Favorites.propTypes = {
  hasFavorites: PropTypes.bool,
  initialLoading: PropTypes.bool,
};

Favorites.defaultProps = {
  hasFavorites: false,
  initialLoading: true,
};

export default connect(Favorites);
