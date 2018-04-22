import React from 'react';

export const defaultComponents = {
  Button: null,
};

export const themeConfig = {
  mySettings: 123,
};

export const ThemeContext = React.createContext({
  components: defaultComponents,
  config: themeConfig,
});

export const Theme = ThemeContext.Consumer;
