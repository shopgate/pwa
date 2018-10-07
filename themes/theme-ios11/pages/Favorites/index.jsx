import React, { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'Components/View';
import LoadingIndicator from '@shopgate/pwa-ui-shared/LoadingIndicator';
import connect from './connector';
import EmptyFavorites from './components/EmptyFavorites';
import FavoritesList from './components/FavoritesList';
/**
 * Favorites page.
 */
class Favorites extends Component {
  static propTypes = {
    initialLoading: PropTypes.bool.isRequired,
    products: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  };

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * Title getter.
   */
  get title() {
    const { __ } = this.context.i18n();
    return __('titles.favorites');
  }

  /**
   * Initial render with just a loading spinner.
   * For normal app start should never be visible since it's only rendered when redux is not yet
   * filled with favorites data.
   * Will happen only if connection is very slow and user is very fast, or opens the favorites
   * via an interjection.
   * @returns {JSX}
   */
  initialRender() {
    return (
      <View title={this.title}>
        <LoadingIndicator />
      </View>
    );
  }

  /**
   *
   * @returns {JSX}
   */
  render() {
    if (this.props.initialLoading) {
      return this.initialRender();
    }
    return (
      <View title={this.title}>
        <EmptyFavorites products={this.props.products} />
        <FavoritesList products={this.props.products} />
      </View>
    );
  }
}

export default connect(Favorites);
