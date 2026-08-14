import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { I18n, TickIcon } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  button: {
    ...theme.typography.body1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    outline: 0,
    padding: theme.spacing(2, 0),
    textAlign: 'left',
    width: '100%',
    color: theme.palette.text.primary,
  },
  selected: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  tick: {
    flexShrink: 0,
    fontSize: theme.components.icon.medium,
    color: theme.palette.primary.main,
  },
}));

/**
 * A single sort option within the sort sheet.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Item = ({
  label, value, isSelected, onClick,
}) => {
  const { classes, cx } = useStyles();

  const handleClick = useCallback(() => {
    onClick(value);
  }, [onClick, value]);

  return (
    <button
      className={cx(classes.button, { [classes.selected]: isSelected })}
      onClick={handleClick}
      data-test-id={label}
      role="option"
      aria-selected={isSelected}
      type="button"
    >
      <I18n.Text string={label} />
      {isSelected && <TickIcon className={classes.tick} />}
    </button>
  );
};

Item.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
};

Item.defaultProps = {
  isSelected: false,
};

export default Item;
