import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import { MagnifierIcon } from '@shopgate/pwa-ui-shared';
import { TOGGLE_SEARCH, SEARCH_CLOSED } from 'Components/Search/constants';
import Icon from '../Icon';

/**
 * The SearchButton component.
 */
class SearchButton extends PureComponent {
  static propTypes = {
    onToggle: PropTypes.func,
  };

  static defaultProps = {
    onToggle: () => {},
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);
    UIEvents.on(SEARCH_CLOSED, this.onClose);
  }

  /**
   * Removes the TOGGLE_SEARCH listener.
   */
  componentWillUnmount() {
    UIEvents.off(SEARCH_CLOSED, this.onClose);
  }

  onOpen = () => {
    this.props.onToggle(true);
  }

  onClose = () => {
    this.props.onToggle(false);
  }

  handleOnClick = () => {
    UIEvents.emit(TOGGLE_SEARCH, true);
    this.onOpen();
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <Icon icon={MagnifierIcon} onClick={this.handleOnClick} testId="SearchButton" aria-hidden />
    );
  }
}

export default SearchButton;
