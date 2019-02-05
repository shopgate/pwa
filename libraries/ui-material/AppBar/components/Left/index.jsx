import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_LEFT,
  APP_BAR_LEFT_BEFORE,
  APP_BAR_LEFT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Left({ elements }) {
  return (
    <Fragment key="left">
      <Portal name={APP_BAR_LEFT_BEFORE} />
      <Portal name={APP_BAR_LEFT}>
        {elements}
      </Portal>
      <Portal name={APP_BAR_LEFT_AFTER} />
    </Fragment>
  );
}

Left.propTypes = {
  elements: PropTypes.node,
};

Left.defaultProps = {
  elements: null,
};

export default Left;
