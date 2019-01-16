import React from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import { APP_BAR_SIMPLE } from '@shopgate/pwa-common/constants/Portals';
import DefaultBar from '../DefaultBar';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function SimpleBar({ title }) {
  return (
    <Portal name={APP_BAR_SIMPLE}>
      <DefaultBar title={title} right={null} />
    </Portal>
  );
}

SimpleBar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default SimpleBar;
