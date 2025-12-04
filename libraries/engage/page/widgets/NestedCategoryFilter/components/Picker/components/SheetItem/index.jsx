import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/engage';

const { colors, variables } = themeConfig;
const bgColor = colors.darkGray;
const boxShadowOffset = variables.gap.bigger;

const useStyles = makeStyles()({
  button: {
    outline: 0,
    padding: '16px 16px 16px 0',
    textAlign: 'left',
    width: '100%',
    color: 'var(--color-text-high-emphasis)',
  },
  buttonSelected: {
    background: `var(--color-background-accent, ${bgColor})`,
    boxShadow: `-${boxShadowOffset}px 0px 0px var(--color-background-accent, ${bgColor}), ${boxShadowOffset}px 0px 0px var(--color-background-accent,${bgColor})`,
    margin: '-1px 0',
    paddingTop: 17,
    paddingBottom: 17,
  },
});

/**
 * The SheetItem component.
 * @param {Object} props The component props.
 * @param {Object} props.item The item data.
 * @param {boolean} props.selected Whether the item is selected.
 * @param {Function} props.onClick The click handler.
 * @return {JSX.Element}
 */
const SheetItem = ({ item, selected, onClick }) => {
  const { classes, cx } = useStyles();

  return (
    <button
      className={cx(classes.button, { [classes.buttonSelected]: selected })}
      value={item.id}
      onClick={onClick}
      type="button"
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
  onClick() { },
  selected: false,
};

export default SheetItem;
