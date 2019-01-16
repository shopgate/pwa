import React from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import { APP_BAR_BACK } from '@shopgate/pwa-common/constants/Portals';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { ArrowIcon } from '@shopgate/pwa-ui-shared';
import DefaultBar from '../DefaultBar';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function BackBar({ goBack, ...props }) {
  const left = <AppBar.Icon icon={ArrowIcon} onClick={goBack} testId="backButton" />;

  return (
    <Portal name={APP_BAR_BACK}>
      <DefaultBar left={left} {...props} />
    </Portal>
  );
}

BackBar.propTypes = {
  goBack: PropTypes.func.isRequired,
};

export default connect(BackBar);
