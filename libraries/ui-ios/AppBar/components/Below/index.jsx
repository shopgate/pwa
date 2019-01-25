import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_BELOW,
  APP_BAR_BELOW_BEFORE,
  APP_BAR_BELOW_AFTER,
} from '@shopgate/pwa-common/constants/Portals';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Below({ elements }) {
  return (
    <Fragment key="below">
      <Portal name={APP_BAR_BELOW_BEFORE} />
      <Portal name={APP_BAR_BELOW}>
        {elements}
      </Portal>
      <Portal name={APP_BAR_BELOW_AFTER} />
    </Fragment>
  );
}

Below.propTypes = {
  elements: PropTypes.node,
};

Below.defaultProps = {
  elements: null,
};

export default Below;
