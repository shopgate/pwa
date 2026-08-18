import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
  chip: {
    ...theme.typography.body2,
    padding: theme.spacing(0.25, 1.25),
    borderRadius: 16,
    border: `1px solid ${theme.palette.secondary.main}`,
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
    return values.filter(value => selected.includes(value.id));
  }, [selected, values]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={classes.chips}>
      {items.map(({ id, label }) => (
        <span key={id} className={classes.chip}>{label}</span>
      ))}
    </div>
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
