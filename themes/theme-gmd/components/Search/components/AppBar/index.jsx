import React from 'react';
import PropTypes from 'prop-types';
import { AppBarAndroid as AppBar, ArrowIcon, CrossIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function SearchAppBar({
  close, fieldRef, onEnter, onInput, reset,
}) {
  return (
    <AppBar
      left={<AppBar.Icon icon={ArrowIcon} onClick={close} aria-label={i18n.text('search.close')} />}
      center={<AppBar.Field fieldRef={fieldRef} onChange={onInput} onSubmit={onEnter} />}
      right={<AppBar.Icon icon={CrossIcon} onClick={reset} aria-label={i18n.text('search.reset')} />}
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
