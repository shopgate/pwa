import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  item: {
    background: theme.palette.common.white,
    marginTop: 4,
    borderTop: `1px solid ${theme.components.seperatorLine.borderColor}`,
  },
}));

/**
 * Wraps a single filter page item.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const FilterItem = ({ children }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.item}>
      {children}
    </div>
  );
};

FilterItem.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FilterItem;
