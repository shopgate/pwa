import React from 'react';
import { RouterContext, RouteContext } from '@virtuous/react-conductor';

export { RouterContext };
export { RouteContext };

export const AppContext = React.createContext();
export const App = AppContext.Consumer;

export const ThemeContext = React.createContext();
export const Theme = ThemeContext.Consumer;
