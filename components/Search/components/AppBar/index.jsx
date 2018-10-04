import React from 'react';
import PropTypes from 'prop-types';
import { ArrowIcon, CrossIcon } from '@shopgate/pwa-ui-shared';
import { AppBar } from '@shopgate/pwa-ui-material';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function SearchAppBar({
  close, fieldRef, onEnter, onInput, reset,
}) {
  return (
    <AppBar
      left={<AppBar.Icon icon={ArrowIcon} onClick={close} />}
      center={<AppBar.Field key={1234} fieldRef={fieldRef} onChange={onInput} onSubmit={onEnter} />}
      right={<AppBar.Icon icon={CrossIcon} onClick={reset} />}
    />
  );
}

SearchAppBar.propTypes = {
  close: PropTypes.func.isRequired,
  fieldRef: PropTypes.shape().isRequired,
  onEnter: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export default SearchAppBar;
