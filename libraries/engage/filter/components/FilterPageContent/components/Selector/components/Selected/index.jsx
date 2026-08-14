import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(() => ({
  values: {
    display: 'block',
    textAlign: 'left',
    overflowWrap: 'anywhere',
  },
}));

/**
 * The filter selected component.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const Selected = ({ selected, values }) => {
  const { classes } = useStyles();

  const items = useMemo(() => {
    if (!selected || selected.length === 0) {
      return [];
    }
    return values.reduce((prevValues, value) => {
      if (selected.includes(value.id)) {
        prevValues.push(value.label);
      }
      return prevValues;
    }, []);
  }, [selected, values]);

  if (items.length === 0) {
    return null;
  }

  return (
    <span className={classes.values}>{items.join(', ')}</span>
  );
};

Selected.propTypes = {
  values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string),
};

Selected.defaultProps = {
  selected: null,
};

export default memo(Selected);
