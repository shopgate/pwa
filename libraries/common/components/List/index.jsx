import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './components/Item';

/**
 * The List component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const List = ({ children, className }) => (
  <ul className={className}>{children}</ul>
);

List.Item = ListItem;

List.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
};

List.defaultProps = {
  className: '',
};

export default List;
