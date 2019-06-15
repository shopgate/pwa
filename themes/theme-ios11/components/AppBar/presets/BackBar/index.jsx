import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_BACK_BEFORE,
  APP_BAR_BACK,
  APP_BAR_BACK_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { ArrowIcon } from '@shopgate/pwa-ui-shared';
import DefaultBar from '../DefaultBar';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
function BackBar({ goBack, ...props }, context) {
  const { __ } = context.i18n();
  const left = <AppBar.Icon icon={ArrowIcon} onClick={goBack} aria-label={__('common.back')} testId="backButton" />;

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

BackBar.contextTypes = {
  i18n: PropTypes.func,
};

export default connect(BackBar);
