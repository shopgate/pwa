import * as React from 'react';
import * as PropTypes from 'prop-types';

const Context = React.createContext(null);

/**
 * Tab Context Provider
 * @param {Object} props props
 * @returns {JSX}
 */
const TabContext = (props) => {
  const { children, value } = props;
  const context = React.useMemo(() => ({ value }), [value]);
  return <Context.Provider value={context}>{children}</Context.Provider>;
};

TabContext.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

/**
 * @returns {unknown}
 */
export const useTabContext = () => React.useContext(Context);

export { TabContext };
