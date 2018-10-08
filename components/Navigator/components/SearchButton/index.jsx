import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import MagnifierIcon from '@shopgate/pwa-ui-shared/icons/MagnifierIcon';
import Ripple from '@shopgate/pwa-ui-shared/Ripple';
import { NavigatorContext } from '../../context';
import { TOGGLE_NAVIGATOR_SEARCH } from '../../constants';
import styles from './style';

/**
 * The SearchButton component.
 */
class SearchButton extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    toggleField: PropTypes.func.isRequired,
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };

    UIEvents.on(TOGGLE_NAVIGATOR_SEARCH, this.toggle);
  }

  /**
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.visible !== nextState.visible;
  }

  handleClick = () => {
    this.props.toggleField(!this.props.active, true);
  }

  /**
   * @param {boolean} visible The next visibility state.
   */
  toggle = (visible) => {
    this.setState({ visible });
  }

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.state.visible) {
      return null;
    }

    return (
      <button className={styles.button} data-test-id="SearchButton">
        <Ripple className={styles.buttonContent} onClick={this.handleClick}>
          <MagnifierIcon />
        </Ripple>
      </button>
    );
  }
}

export default () => (
  <NavigatorContext.Consumer>
    {({ searchField, toggleSearchField }) => (
      <SearchButton active={searchField} toggleField={toggleSearchField} />
    )}
  </NavigatorContext.Consumer>
);

export { SearchButton as UnwrappedSearchButton };
