import React, { Fragment, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(() => ({
  elipsed: {
    maxWidth: '95%',
    overflow: 'hidden',
    textAlign: 'right',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  comma: {
    ' + span': {
      marginLeft: '0.65ch',
    },
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

  if (!selected || selected.length === 0) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => (
        <Fragment key={item}>
          <span className={classes.elipsed}>{item}</span>
          {(index < items.length - 1) ? <span className={classes.comma}>, </span> : ''}
        </Fragment>
      ))}
    </>
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
