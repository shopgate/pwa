import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  toggle: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  label: {
    ...theme.typography.body1,
    flexShrink: 0,
    textAlign: 'left',
    maxWidth: '50%',
    paddingRight: '16px',
  },
  selected: {
    ...theme.typography.body2,
    flex: 1,
    minWidth: 0,
  },
}));

/**
 * The toggle component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Toggle = ({
  label,
  selected,
}) => {
  const { classes } = useStyles();

  return (
    <div className={classes.toggle}>
      <span className={classes.label}>
        {label}
      </span>
      {selected && (
        <span className={classes.selected}>{selected}</span>
      )}
    </div>
  );
};

Toggle.propTypes = {
  label: PropTypes.node.isRequired,
  selected: PropTypes.node,
};

Toggle.defaultProps = {
  selected: null,
};

export default memo(Toggle);
