import React, { PureComponent } from 'react';
import { UIEvents } from '@shopgate/engage/core';
import { AppBarAndroid as AppBar, MagnifierIcon } from '@shopgate/engage/components';
import { TOGGLE_SEARCH } from 'Components/Search/constants';

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
      <AppBar.Icon icon={MagnifierIcon} onClick={this.handleOnClick} testId="SearchButton" />
    );
  }
}

export default SearchButton;
