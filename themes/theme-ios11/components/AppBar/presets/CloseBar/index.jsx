import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import {
  APP_BAR_CLOSE_BEFORE,
  APP_BAR_CLOSE,
  APP_BAR_CLOSE_AFTER,
} from '@shopgate/engage/core';
import { AppBarIOS } from '@shopgate/pwa-ui-ios';
import { CrossIcon } from '@shopgate/engage/components';
import DefaultBar from '../DefaultBar';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function CloseBar({ goBack, ...props }) {
  const left = <AppBar.Icon icon={CrossIcon} onClick={goBack} />;

  return (
    <Fragment>
      <Portal name={APP_BAR_CLOSE_BEFORE} />
      <Portal name={APP_BAR_CLOSE}>
        <DefaultBar left={left} right={null} {...props} />
      </Portal>
      <Portal name={APP_BAR_CLOSE_AFTER} />
    </Fragment>
  );
}

CloseBar.propTypes = {
  goBack: PropTypes.func.isRequired,
};

export default connect(CloseBar);
