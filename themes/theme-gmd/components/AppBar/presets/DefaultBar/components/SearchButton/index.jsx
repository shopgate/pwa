import React, { PureComponent } from 'react';
import { UIEvents } from '@shopgate/pwa-core';
import { MagnifierIcon } from '@shopgate/pwa-ui-shared';
import { TOGGLE_SEARCH } from 'Components/Search/constants';
import Icon from '../Icon';

/**
 * The SearchButton component.
 */
class SearchButton extends PureComponent {
  handleOnClick = () => {
    UIEvents.emit(TOGGLE_SEARCH, true);
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
