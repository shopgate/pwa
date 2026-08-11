import React, { Children } from 'react';
import PropTypes from 'prop-types';
import Card from '@shopgate/engage/components/Card';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'block',
    marginBottom: theme.spacing(0.5),
  },
  unselected: {
    zIndex: 1,
  },
  selected: {
    zIndex: 2,
  },
}));

/**
 * The Card List Item component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Item = ({
  children,
  className,
  isSelected,
  role,
}) => {
  const { classes, cx } = useStyles();

  if (!Children.count(children)) {
    return null;
  }

  return (
    <Card
      component="li"
      className={cx(
        classes.root,
        className,
        'common__list__list-item',
        isSelected ? classes.selected : classes.unselected
      )}
      data-test-id="listItem"
      role={role}
    >
      {children}
    </Card>
  );
};

Item.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isSelected: PropTypes.bool,
  role: PropTypes.string,
};

Item.defaultProps = {
  children: null,
  className: null,
  isSelected: false,
  role: null,
};

export default Item;
