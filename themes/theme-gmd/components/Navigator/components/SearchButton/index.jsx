import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MagnifierIcon from '@shopgate/pwa-ui-shared/icons/MagnifierIcon';
import Ripple from '@shopgate/pwa-ui-shared/Ripple';
import styles from './style';

/**
 * The search button component.
 */
class SearchButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: () => {},
  };

  /**
   * This component doesn't need to update at all.
   * @returns {boolean}
   */
  shouldComponentUpdate() {
    return false;
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
          onComplete={this.props.onClick}
        >
          <MagnifierIcon />
        </Ripple>
      </button>
    );
  }
}

export default SearchButton;
