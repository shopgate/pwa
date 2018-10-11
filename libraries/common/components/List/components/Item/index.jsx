import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The ListItem component.
 * @returns {JSX}
 */
const ListItem = ({
  children,
  className,
  isSelected,
}) => {
  if (!React.Children.count(children)) {
    return null;
  }

  let classes = styles.item;

  if (className) {
    classes += ` ${className}`;
  }

  // Add selected or unselected styling.
  classes += ` ${isSelected ? styles.selected : styles.unselected}`;

  return <li className={classes} data-test-id="listItem">{children}</li>;
};

ListItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isSelected: PropTypes.bool,
};

ListItem.defaultProps = {
  className: null,
  children: null,
  isSelected: false,
};

export default ListItem;
