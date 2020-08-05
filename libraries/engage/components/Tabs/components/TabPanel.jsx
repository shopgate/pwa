import * as React from 'react';
import PropTypes from 'prop-types';

/**
 * Tab panel component
 * @param {Object} props props
 * @returns {JSX}
 */
const TabPanel = (props) => {
  const {
    children, className, value, index,
  } = props;
  return (
    <div
      className={className}
      hidden={value !== index}
      role="tabpanel"
    >
      {value === index && children}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default TabPanel;
