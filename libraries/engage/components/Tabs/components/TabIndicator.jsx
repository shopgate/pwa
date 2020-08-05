import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { root } from './TabIndicator.style';

/**
 * Tab indicator component
 * @param {Object} props props
 * @returns {JSX}
 */
const TabIndicator = ({ className, ...other }) => (
  <span
    className={classNames(root, className)}
    {...other}
  />
);

TabIndicator.propTypes = {
  className: PropTypes.string,
};

TabIndicator.defaultProps = {
  className: null,
};

export default TabIndicator;
