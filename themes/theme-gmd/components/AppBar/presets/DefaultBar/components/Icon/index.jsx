import React from 'react';
import PropTypes from 'prop-types';
import { AppBarAndroid } from '@shopgate/engage/components';
import { withWidgetSettings } from '@shopgate/engage/core';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AppBarIcon = ({ widgetSettings, ...rest }) => {
  const { buttonColor } = widgetSettings;
  return (
    <AppBarAndroid.Icon color={buttonColor || 'inherit'} {...rest} />
  );
};

AppBarIcon.propTypes = {
  widgetSettings: PropTypes.shape().isRequired,
};

export default withWidgetSettings(AppBarIcon, '@shopgate/engage/components/AppBar');

