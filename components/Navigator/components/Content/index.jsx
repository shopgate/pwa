import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import Logo from './components/Logo';
import Title from './components/Title';
import Search from './components/Search2';

/**
 * The NavigatorContent component.
 */
class NavigatorContent extends Component {
  static propTypes = {
    searchActive: PropTypes.bool.isRequired,
    searchQuery: PropTypes.string.isRequired,
  };

  /**
   * 
   */
  get isIndexRoute() {
    return this.props.path === INDEX_PATH;
  }

  /**
   * 
   */
  get isSearchActive() {
    return this.state.searchField;
  }

  /**
   * @return {JSX}
   */
  render() {
    let currentTitle = null;

    if (!this.props.searchActive) {
      const isSearching = true;//this.state.searchQuery !== null;
      currentTitle = <Title onClick={isSearching ? this.props.submitSearch : null} />;
    }

    return (
      <Fragment>
        {/*currentTitle*/}
        {this.isIndexRoute && <Logo />}
        {!this.isIndexRoute && <Title />}
        <Search
          active={this.props.searchActive}
          query={this.props.searchQuery}
        />
      </Fragment>
    );
  }
}

export default NavigatorContent;
