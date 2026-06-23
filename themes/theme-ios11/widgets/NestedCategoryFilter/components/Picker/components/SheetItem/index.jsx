import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  button: {
    outline: 0,
    padding: '16px 16px 16px 0',
    textAlign: 'left',
    width: '100%',
    color: theme.palette.text.primary,
    cursor: 'pointer',
  },
  buttonSelected: {
    outline: 0,
    padding: '17px 16px 17px 0',
    textAlign: 'left',
    width: '100%',
    color: theme.palette.text.primary,
    background: 'var(--color-background-accent)',
    boxShadow: `${theme.spacing(-2.5)}px 0px 0px var(--color-background-accent), ${theme.spacing(2.5)}px 0px 0px var(--color-background-accent)`,
    margin: '-1px 0',
    cursor: 'not-allowed',
  },
}));

/**
 * The SheetItem component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const SheetItem = ({ item, onClick, selected }) => {
  const { classes, cx } = useStyles();

  return (
    <button
      type="button"
      className={cx({
        [classes.button]: !selected,
        [classes.buttonSelected]: selected,
      })}
      value={item.id}
      onClick={onClick}
      key={item.id}
    >
      {item.name}
    </button>
  );
};

SheetItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
};

SheetItem.defaultProps = {
  onClick() {},
  selected: false,
};

export default memo(SheetItem);
