import React from 'react';
import { RouterContext, RouteContext } from '@virtuous/react-conductor';

export { RouterContext };
export { RouteContext };

export const ThemeContext = React.createContext();
export const Theme = ThemeContext.Consumer;

export const FormContext = React.createContext();
