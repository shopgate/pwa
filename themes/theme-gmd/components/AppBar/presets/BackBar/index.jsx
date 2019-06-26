import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_BACK_BEFORE,
  APP_BAR_BACK,
  APP_BAR_BACK_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { ArrowIcon } from '@shopgate/pwa-ui-shared';
import DefaultBar, { Icon as DefaultBarIcon } from '../DefaultBar';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function BackBar({ goBack, ...props }) {
  const left = <DefaultBarIcon icon={ArrowIcon} onClick={goBack} testId="backButton" />;

  return (
    <Fragment>
      <Portal name={APP_BAR_BACK_BEFORE} />
      <Portal name={APP_BAR_BACK}>
        <DefaultBar left={left} {...props} />
      </Portal>
      <Portal name={APP_BAR_BACK_AFTER} />
    </Fragment>
  );
}

BackBar.propTypes = {
  goBack: PropTypes.func.isRequired,
};

export default connect(BackBar);
