import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const useStyles = makeStyles()({
  item: {
    background: colors.light,
    marginTop: 4,
  },
});

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
