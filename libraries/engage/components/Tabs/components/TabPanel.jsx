import * as React from 'react';
import PropTypes from 'prop-types';
import { useTabContext } from '../TabContext';

/**
 * Tab panel component
 * @param {Object} props props
 * @returns {JSX}
 */
const TabPanel = (props) => {
  const {
    children, className, value,
  } = props;
  const context = useTabContext();
  return (
    <div
      className={className}
      hidden={value !== context.value}
      role="tabpanel"
    >
      {value === context.value && children}
    </div>
  );
};

TabPanel.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

TabPanel.defaultProps = {
  children: null,
  className: null,
};

export default TabPanel;
