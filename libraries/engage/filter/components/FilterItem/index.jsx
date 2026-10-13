import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  item: {
    background: theme.palette.background.surface,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: theme.spacing(2),
      right: theme.spacing(2),
      borderTop: `1px solid ${theme.components.separatorLine.borderColor}`,
    },
    '&:first-child::before': {
      display: 'none',
    },
  },
}));

/**
 * Wraps a single filter page item.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FilterItem = ({ children }) => {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.item, 'engage__filter-item')}>
      {children}
    </div>
  );
};

FilterItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FilterItem;
