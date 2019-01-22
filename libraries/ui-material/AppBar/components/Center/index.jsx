import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_CENTER,
  APP_BAR_CENTER_BEFORE,
  APP_BAR_CENTER_AFTER,
} from '@shopgate/pwa-common/constants/Portals';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Center({ elements }) {
  return (
    <Fragment key="center">
      <Portal name={APP_BAR_CENTER_BEFORE} />
      <Portal name={APP_BAR_CENTER}>
        {elements}
      </Portal>
      <Portal name={APP_BAR_CENTER_AFTER} />
    </Fragment>
  );
}

Center.propTypes = {
  elements: PropTypes.node,
};

Center.defaultProps = {
  elements: null,
};

export default Center;
