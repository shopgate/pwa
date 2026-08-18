import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  toggle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    flex: 1,
    minWidth: 0,
  },
  label: {
    ...theme.typography.body1,
    textAlign: 'left',
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
      {selected}
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
