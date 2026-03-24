import React, { memo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables } = themeConfig;
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
    outline: 0,
    padding: '17px 16px 17px 0',
    textAlign: 'left',
    width: '100%',
    color: 'var(--color-text-high-emphasis)',
    background: 'var(--color-background-accent)',
    boxShadow: `-${boxShadowOffset}px 0px 0px var(--color-background-accent), ${boxShadowOffset}px 0px 0px var(--color-background-accent)`,
    margin: '-1px 0',
  },
});

/**
 * The SheetItem component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const SheetItem = ({ item, onClick, selected }) => {
  const { classes } = useStyles();

  return (
    <button
      type="button"
      className={classNames({
        [classes.button]: !selected,
        [classes.buttonSelected]: selected,
      })}
      value={item.id}
      key={item.id}
      onClick={onClick}
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
