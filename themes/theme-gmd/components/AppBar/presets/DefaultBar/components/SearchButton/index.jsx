import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { UIEvents, i18n } from '@shopgate/engage/core';
import { MagnifierIcon } from '@shopgate/engage/components';
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
    onToggle: () => { },
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
      <Icon
        icon={MagnifierIcon}
        onClick={this.handleOnClick}
        testId="SearchButton"
        aria-label={i18n.text('search.placeholder')}
      />
    );
  }
}

export default SearchButton;
