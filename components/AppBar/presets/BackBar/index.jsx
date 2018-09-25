import React from 'react';
import { ArrowIcon } from '@shopgate/pwa-ui-shared';
import AppBar from 'Components/AppBar';
import DefaultBar from '../DefaultBar';
import connect from './connector';

/**
 * @param {*} param0 
 * @returns {JSX}
 */
function BackBar({ goBack, ...rest }) {
  const left = <AppBar.Icon icon={ArrowIcon} onClick={goBack} />;

  return (
    <DefaultBar left={left} {...rest} />
  );
}

export default connect(BackBar);
