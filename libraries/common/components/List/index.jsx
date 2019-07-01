import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './components/Item';

/**
 * The List component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const List = ({ children, className, role }) => (
  <ul className={className} role={role}>{children}</ul>
);

List.Item = ListItem;

List.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  role: PropTypes.string,
};

List.defaultProps = {
  className: '',
  role: null,
};

export default List;
