import React from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import { APP_BAR_CENTER } from '@shopgate/pwa-common/constants/Portals';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Center({ elements }) {
  return (
    <Portal name={APP_BAR_CENTER}>
      {elements}
    </Portal>
  );
}

Center.propTypes = {
  elements: PropTypes.node,
};

Center.defaultProps = {
  elements: null,
};

export default Center;
