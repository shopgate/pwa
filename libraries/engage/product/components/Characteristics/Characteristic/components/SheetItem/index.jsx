import React, { useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { withForwardedRef } from '@shopgate/engage/core/hocs';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { CharacteristicsButton } from '@shopgate/engage/back-in-stock/components';

const useStyles = makeStyles()((theme) => {
  const buttonBase = {
    outline: 0,
    textAlign: 'left',
    paddingLeft: 0,
    paddingRight: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    color: theme.palette.text.primary,
  };

  return {
    button: {
      ...buttonBase,
    },
    buttonDisabled: {
      ...buttonBase,
      color: theme.palette.action.disabled,
    },
    buttonUnavailable: {
      color: theme.palette.text.secondary,
    },
    buttonSoldOut: {
      color: theme.palette.text.secondary,
      textDecoration: 'line-through',
    },
    root: {
      padding: '16px 0',
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        padding: '8px 16px',
      },
    },
    rootSelected: {
      ...buttonBase,
      background: theme.palette.background.emphasized,
      boxShadow: `-16px 0 0 ${theme.palette.background.emphasized}, 16px 0 0 ${theme.palette.background.emphasized}`,
      margin: '-1px 0',
      paddingTop: 17,
      paddingBottom: 17,
      fontWeight: theme.typography.fontWeightMedium,
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        margin: 0,
        paddingTop: 8,
        paddingBottom: 8,
        padding: '8px 16px',
        boxShadow: 'none',
      },
    },
    mainRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px 8px',
      justifyContent: 'space-between',
      width: '100%',
    },
    mainRowRight: {
      marginLeft: 'auto',
    },
    bottomRow: {
      '&:not(:empty)': {
        textAlign: 'right',
      },
    },
  };
});

/**
 * The SheetItem component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const SheetItem = ({
  characteristics,
  item,
  forwardedRef,
  onClick,
  rightComponent: Right,
  selected,
}) => {
  const { classes, cx } = useStyles();

  const buildProps = useCallback(() => ({
    className: cx({
      [classes.button]: item.selectable,
      [classes.buttonDisabled]: !item.selectable,
      [classes.buttonUnavailable]: item.selectable && item.available === false,
      [classes.buttonSoldOut]: item.selectable && !!item.soldOut,
    }, 'theme__product__characteristic__option'),
    key: item.id,
    ref: forwardedRef,
    value: item.id,
    'aria-hidden': !item.selectable,
    ...(item.selectable ? { onClick: event => onClick(event, item.id) } : {}),
  }), [
    forwardedRef,
    item.id,
    item.selectable,
    item.available,
    item.soldOut,
    onClick,
    classes.button,
    classes.buttonDisabled,
    classes.buttonUnavailable,
    classes.buttonSoldOut,
    cx,
  ]);

  return (
    <div className={cx(classes.root, {
      [classes.rootSelected]: selected,
    })}
    >
      <button
        {...buildProps()}
        data-test-id={item.label}
        data-unavailable={item.available === false ? true : undefined}
        data-sold-out={item.soldOut ? true : undefined}
        aria-selected={selected}
        role="option"
        type="button"
      >
        <div className={classes.mainRow}>
          <div>
            {item.label}
          </div>
          <div className={classes.mainRowRight}>
            {item.selectable && <Right />}
          </div>
        </div>
      </button>
      <div className={classes.bottomRow}>
        {item.selectable && (
          <CharacteristicsButton characteristics={characteristics} />
        )}
      </div>
    </div>
  );
};

SheetItem.propTypes = {
  characteristics: PropTypes.shape().isRequired,
  item: PropTypes.shape().isRequired,
  forwardedRef: PropTypes.shape(),
  onClick: PropTypes.func,
  rightComponent: PropTypes.func,
  selected: PropTypes.bool,
};

SheetItem.defaultProps = {
  forwardedRef: null,
  onClick() { },
  rightComponent: null,
  selected: false,
};

export default withForwardedRef(memo(SheetItem));
