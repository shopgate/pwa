import React from 'react';
import PropTypes from 'prop-types';
import { AppBar } from '@shopgate/pwa-ui-material';
import { CrossIcon } from '@shopgate/pwa-ui-shared';
import DefaultBar from '../DefaultBar';
import connect from './connector';

/**
 * @param {Function} props.goBack The pop history action.
 * @returns {JSX}
 */
function CloseBar({ goBack, ...rest }) {
  const left = <AppBar.Icon icon={CrossIcon} onClick={goBack} />;

  return (
    <DefaultBar left={left} right={null} {...rest} />
  );
}

CloseBar.propTypes = {
  goBack: PropTypes.func.isRequired,
};

export default connect(CloseBar);
