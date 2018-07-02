import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MagnifierIcon from '@shopgate/pwa-ui-shared/icons/MagnifierIcon';
import Ripple from '@shopgate/pwa-ui-shared/Ripple';
import { NavigatorContext } from '../../context';
import styles from './style';

/**
 * The search button component.
 */
class SearchButton extends Component {
  static propTypes = {
    searchActive: PropTypes.bool.isRequired,
    toggleSearchField: PropTypes.func.isRequired,
  }

  /**
   * This component doesn't need to update at all.
   * @returns {boolean}
   */
  shouldComponentUpdate() {
    return false;
  }

  handleClick = () => {
    this.props.toggleSearchField(!this.props.searchActive, true);
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <button
        data-test-id="SearchButton"
        className={styles.button}
      >
        <Ripple
          className={styles.buttonContent}
          onClick={this.handleClick}
        >
          <MagnifierIcon />
        </Ripple>
      </button>
    );
  }
}

export default () => (
  <NavigatorContext.Consumer>
    {({ searchField, toggleSearchField }) => (
      <SearchButton searchActive={searchField} toggleSearchField={toggleSearchField} />
    )}
  </NavigatorContext.Consumer>
);

export { SearchButton as UnwrappedSearchButton };
