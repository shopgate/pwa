import React from 'react';

const initialValue = {};

const Context = React.createContext(initialValue);
export default Context;

/**
 * Hook to use the filter bar context.
 * @returns {Object}
 */
export const useFilterBarContext = () => React.useContext(Context);
