import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  APP_BAR_BACK_BEFORE,
  APP_BAR_BACK,
  APP_BAR_BACK_AFTER,
} from '@shopgate/engage/core';
import { ArrowIcon, AppBarAndroid as AppBar, Portal } from '@shopgate/engage/components';
import DefaultBar from '../DefaultBar';
import connect from './connector';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function BackBar({ goBack, ...props }) {
  const left = <AppBar.Icon icon={ArrowIcon} onClick={goBack} testId="backButton" />;

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
