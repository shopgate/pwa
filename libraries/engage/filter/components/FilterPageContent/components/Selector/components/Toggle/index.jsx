import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(() => ({
  toggle: {
    display: 'flex',
    flexFlow: 'row no-wrap',
    alignContent: 'stretch',
    alignItems: 'flex-start',
  },
  label: {
    whiteSpace: 'no-wrap',
    flexShrink: 0,
    flexGrow: 1,
    textAlign: 'left',
    maxWidth: '50%',
    minWidth: '35%',
    paddingRight: '16px',
  },
  selected: {
    display: 'flex',
    flexFlow: 'row wrap',
    flexGrow: 1,
    justifyContent: 'flex-end',
    minWidth: '50%',
    maxWidth: '65%',
  },
  closed: {
    fontWeight: 'normal',
  },
  open: {
    fontWeight: 'bold',
  },
}));

/**
 * The toggle component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Toggle = ({
  label,
  open,
  selected,
}) => {
  const { classes } = useStyles();

  const labelClassName = useMemo(() => classNames({
    [classes.label]: true,
    [classes.open]: open,
    [classes.closed]: !open,
  }), [classes.closed, classes.label, classes.open, open]);

  return (
    <div className={classes.toggle}>
      <span className={labelClassName}>
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
  open: PropTypes.bool,
  selected: PropTypes.node,
};

Toggle.defaultProps = {
  open: false,
  selected: null,
};

export default memo(Toggle);
