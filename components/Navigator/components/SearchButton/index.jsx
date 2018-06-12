import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MagnifierIcon from '@shopgate/pwa-ui-shared/icons/MagnifierIcon';
import Ripple from '@shopgate/pwa-ui-shared/Ripple';
import { UIEvents } from '@shopgate/pwa-core';
import styles from './style';

/**
 * The search button component.
 */
class SearchButton extends Component {
  static propTypes = {
    searchActive: PropTypes.bool.isRequired,
  }

  /**
   * This component doesn't need to update at all.
   * @returns {boolean}
   */
  shouldComponentUpdate() {
    return false;
  }

  handleClick = () => {
    UIEvents.emit('UI_NAVIGATOR_SEARCH_FIELD', !this.props.searchActive);
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

export default SearchButton;
