import React from 'react';
import PropTypes from 'prop-types';
import { ArrowIcon, CrossIcon } from '@shopgate/pwa-ui-shared';
import { AppBar } from '@shopgate/pwa-ui-material';

/**
 * 
 * @param {*} param0 
 */
function SearchAppBar({
  close, fieldRef, onEnter, onInput, reset, query,
}) {
  return (
    <AppBar
      left={<AppBar.Icon icon={ArrowIcon} onClick={close} />}
      center={<AppBar.Field fieldRef={fieldRef} onChange={onInput} value={query} onSubmit={onEnter} />}
      right={<AppBar.Icon icon={CrossIcon} onClick={reset} />}
    />
  );
}

export default SearchAppBar;
