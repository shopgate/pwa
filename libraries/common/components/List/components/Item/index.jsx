import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  item: {
    display: 'block',
    position: 'relative',
  },
  unselected: {
    zIndex: 1,
  },
  selected: {
    zIndex: 2,
  },
});

/**
 * The ListItem component.
 * @returns {JSX}
 */
const ListItem = ({
  children,
  className,
  isSelected,
  role,
}) => {
  const { classes, cx } = useStyles();
  if (!React.Children.count(children)) {
    return null;
  }

  return (
    <li
      className={cx(
        classes.item,
        className,
        'common__list__list-item',
        isSelected ? classes.selected : classes.unselected
      )}
      data-test-id="listItem"
      role={role}
    >
      {children}
    </li>
  );
};

ListItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isSelected: PropTypes.bool,
  role: PropTypes.string,
};

ListItem.defaultProps = {
  className: null,
  children: null,
  isSelected: false,
  role: null,
};

export default ListItem;
