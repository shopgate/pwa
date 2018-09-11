import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListItem from './components/Item';

/**
 * The List component.
 * @param {Object} props The component props.
 */
const List = ({ children, className }) => (
  <ul className={className}>{children}</ul>
);

List.Item = ListItem;

List.propTypes = {
  className: PropTypes.string,
};

List.defaultProps = {
  className: '',
};

export default List;