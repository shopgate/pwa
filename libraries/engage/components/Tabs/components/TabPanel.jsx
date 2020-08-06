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
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

TabPanel.defaultProps = {
  children: null,
  className: null,
};

export default TabPanel;
