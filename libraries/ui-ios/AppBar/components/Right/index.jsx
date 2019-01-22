import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_RIGHT,
  APP_BAR_RIGHT_BEFORE,
  APP_BAR_RIGHT_AFTER,
} from '@shopgate/pwa-common/constants/Portals';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Right({ elements }) {
  return (
    <Fragment key="right">
      <Portal name={APP_BAR_RIGHT_BEFORE} />
      <Portal name={APP_BAR_RIGHT}>
        {elements}
      </Portal>
      <Portal name={APP_BAR_RIGHT_AFTER} />
    </Fragment>
  );
}

Right.propTypes = {
  elements: PropTypes.node,
};

Right.defaultProps = {
  elements: null,
};

export default Right;
