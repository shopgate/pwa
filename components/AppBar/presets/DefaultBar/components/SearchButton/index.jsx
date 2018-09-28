import React from 'react';
import { UIEvents } from '@shopgate/pwa-core';
import { AppBar } from '@shopgate/pwa-ui-material';
import { MagnifierIcon } from '@shopgate/pwa-ui-shared';
import { TOGGLE_SEARCH } from 'Components/Search/constants';

/**
 * @returns {JSX}
 */
function SearchButton() {
  return (
    <AppBar.Icon icon={MagnifierIcon} onClick={() => UIEvents.emit(TOGGLE_SEARCH, true)} />
  );
}

export default SearchButton;
