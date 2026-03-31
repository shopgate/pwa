import React, { useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { withForwardedRef } from '@shopgate/engage/core/hocs';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { CharacteristicsButton } from '@shopgate/engage/back-in-stock/components';

const { colors } = themeConfig;

const useStyles = makeStyles()(theme => ({
  button: {
    outline: 0,
    textAlign: 'left',
    paddingLeft: 0,
    paddingRight: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    color: theme.palette.text.primary,
  },
  buttonDisabled: {
    outline: 0,
    textAlign: 'left',
    paddingLeft: 0,
    paddingRight: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    color: colors.shade4,
  },
  root: {
    padding: '16px 0',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      padding: '8px 16px',
    },
  },
  rootSelected: {
    outline: 0,
    textAlign: 'left',
    paddingLeft: 0,
    paddingRight: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    color: theme.palette.text.primary,
    background: 'var(--color-background-accent)',
    boxShadow: '-16px 0 0 var(--color-background-accent), 16px 0 0 var(--color-background-accent)',
    margin: '-1px 0',
    paddingTop: 17,
    paddingBottom: 17,
    fontWeight: 500,
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
}));

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

  const getStyle = useCallback(selectable => (
    selectable ? classes.button : classes.buttonDisabled
  ), [classes.button, classes.buttonDisabled]);

  const buildProps = useCallback(() => ({
    className: `${getStyle(item.selectable)} theme__product__characteristic__option`,
    key: item.id,
    ref: forwardedRef,
    value: item.id,
    'aria-hidden': !item.selectable,
    ...(item.selectable ? { onClick: event => onClick(event, item.id) } : {}),
  }), [forwardedRef, getStyle, item.id, item.selectable, onClick]);

  return (
    <div className={cx(classes.root, {
      [classes.rootSelected]: selected,
    })}
    >
      <button
        {...buildProps()}
        data-test-id={item.label}
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
