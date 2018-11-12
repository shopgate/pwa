import React from 'react';

export const AppContext = React.createContext();
export const App = AppContext.Consumer;

export const ThemeContext = React.createContext();
export const Theme = ThemeContext.Consumer;

export * from '@virtuous/react-conductor/Router/context';
