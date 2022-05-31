import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import { View } from '@shopgate/engage/components';
import { BackBar } from 'Components/AppBar/presets';
import connect from './connector';
import FavoritesList from './components/FavoritesList';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Favorites = ({ initialLoading }) => {
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
      {<FavoritesList />}
    </View>
  );
};

Favorites.propTypes = {
  initialLoading: PropTypes.bool,
};

Favorites.defaultProps = {
  initialLoading: true,
};

export default connect(Favorites);
