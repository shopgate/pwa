import React from 'react';
import PropTypes from 'prop-types';
import { AppBarIOS as AppBar } from '@shopgate/engage/components';
import { withWidgetSettings } from '@shopgate/engage/core';

/**
 * A wrapper component for the AppBarIcon which injects the icon color from the widget settings.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AppBarIcon = ({ widgetSettings, ...rest }) => {
  const { buttonColor } = widgetSettings;
  return (
    <AppBar.Icon color={buttonColor || 'inherit'} {...rest} />
  );
};

AppBarIcon.propTypes = {
  widgetSettings: PropTypes.shape().isRequired,
};

export default withWidgetSettings(AppBarIcon, '@shopgate/engage/components/AppBar');

