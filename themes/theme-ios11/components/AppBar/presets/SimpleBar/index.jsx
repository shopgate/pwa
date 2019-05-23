import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/engage/components';
import {
  APP_BAR_SIMPLE_BEFORE,
  APP_BAR_SIMPLE,
  APP_BAR_SIMPLE_AFTER,
} from '@shopgate/engage/core';
import DefaultBar from '../DefaultBar';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function SimpleBar({ title }) {
  return (
    <Fragment>
      <Portal name={APP_BAR_SIMPLE_BEFORE} />
      <Portal name={APP_BAR_SIMPLE}>
        <DefaultBar title={title} right={null} />
      </Portal>
      <Portal name={APP_BAR_SIMPLE_AFTER} />
    </Fragment>
  );
}

SimpleBar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SimpleBar;
