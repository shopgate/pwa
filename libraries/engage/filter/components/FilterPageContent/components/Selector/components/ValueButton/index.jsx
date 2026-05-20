import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const useStyles = makeStyles()(() => {
  const inactive = {
    border: `1px solid ${themeColors.darkGray}`,
    borderRadius: 2,
    color: 'inherit',
    height: 42,
    marginLeft: 8,
    marginBottom: 8,
    maxWidth: '100%',
    minWidth: 42,
    outline: 0,
    overflow: 'hidden',
    padding: '0 8px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    transition: 'color 100ms cubic-bezier(0.25, 0.1, 0.25, 1), border-color 100ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    willChange: 'color, border-color',
  };

  return {
    inactive,
    active: {
      ...inactive,
      borderColor: 'var(--color-secondary)',
      color: 'var(--color-secondary)',
    },
  };
});

/**
 * The value button component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const ValueButton = ({
  id,
  isActive,
  label,
  onClick,
}) => {
  const { classes, cx } = useStyles();

  const buttonClassName = useMemo(() => cx({
    [classes.inactive]: !isActive,
    [classes.active]: isActive,
  }), [classes.active, classes.inactive, isActive, cx]);

  return (
    <button
      className={buttonClassName}
      value={id}
      onClick={onClick}
      data-test-id={id}
      type="button"
      role="checkbox"
      aria-checked={isActive}
    >
      {label}
    </button>
  );
};

ValueButton.propTypes = {
  id: PropTypes.string,
  isActive: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

ValueButton.defaultProps = {
  id: null,
  label: null,
  isActive: false,
  onClick() {},
};

export default memo(ValueButton);
