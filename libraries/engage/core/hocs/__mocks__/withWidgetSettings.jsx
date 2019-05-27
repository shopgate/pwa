import React from 'react';

/**
 * Mock for the withWidgetSettings HOC.
 * @param {Function} WrappedComponent The react component to wrap.
 * @returns {JSX}
 */
export function withWidgetSettings(WrappedComponent) {
  const settings = {
    mocked: 'widgetSetting',
  };

  return props => (<WrappedComponent widgetSettings={settings} {...props} />);
}
