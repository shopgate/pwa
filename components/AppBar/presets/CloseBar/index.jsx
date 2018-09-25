import React from 'react';
import PropTypes from 'prop-types';
import { CrossIcon } from '@shopgate/pwa-ui-shared';
import AppBar from 'Components/AppBar';
import DefaultBar from '../DefaultBar';
import connect from './connector';

/**
 * @param {Function} props.goBack The pop history action.
 * @returns {JSX}
 */
function CloseBar({ goBack }) {
  const left = <AppBar.Icon icon={CrossIcon} onClick={goBack} />;

  return (
    <DefaultBar left={left} center={null} right={null} />
  );
}

CloseBar.propTypes = {
  goBack: PropTypes.func.isRequired,
};

export default connect(CloseBar);
