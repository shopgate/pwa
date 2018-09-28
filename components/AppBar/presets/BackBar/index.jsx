import React from 'react';
import PropTypes from 'prop-types';
import { AppBar } from '@shopgate/pwa-ui-material';
import { ArrowIcon } from '@shopgate/pwa-ui-shared';
import DefaultBar from '../DefaultBar';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function BackBar({ goBack, ...rest }) {
  const left = <AppBar.Icon icon={ArrowIcon} onClick={goBack} />;

  return (
    <DefaultBar left={left} {...rest} />
  );
}

BackBar.propTypes = {
  goBack: PropTypes.func.isRequired,
};

export default connect(BackBar);
