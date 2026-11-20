import { forwardRef, memo } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { CharacteristicsButton } from '@shopgate/engage/back-in-stock/components';
import { VisuallyHidden } from '@shopgate/engage/a11y/components';
import { getValueStateText } from '../../../../VariantSelector/renderers/valueState';
import type {
  VariantSelection,
  VariantSelectorValue,
} from '../../../../VariantSelector/types';

export interface SheetItemProps {
  item: VariantSelectorValue;
  /** The selection this value leads to, for the back in stock button. */
  characteristics: VariantSelection;
  onClick?: (event: MouseEvent<HTMLButtonElement>, valueId: string) => void;
  /** Renders content at the end of the row, e.g. the availability. */
  rightComponent?: () => ReactNode;
  selected?: boolean;
}

const useStyles = makeStyles()((theme) => {
  const buttonBase = {
    outline: 0,
    textAlign: 'left' as const,
    paddingLeft: 0,
    paddingRight: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
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
    },
    labelSoldOut: {
      textDecoration: 'line-through',
      textDecorationThickness: 2,
    },
    root: {
      padding: '16px 0',
      [theme.breakpoints.up('md')]: {
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
      [theme.breakpoints.up('md')]: {
        margin: 0,
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
 * A value of a characteristic in the sheet or menu of the variant selection.
 * @returns The value row.
 */
const SheetItem = forwardRef<HTMLButtonElement, SheetItemProps>(({
  item,
  characteristics,
  onClick,
  rightComponent,
  selected = false,
}, ref) => {
  const { classes, cx } = useStyles();
  const stateText = getValueStateText(item);

  return (
    <div className={cx(classes.root, { [classes.rootSelected]: selected })}>
      <button
        ref={ref}
        type="button"
        role="option"
        value={item.id}
        className={cx({
          [classes.button]: item.selectable,
          [classes.buttonDisabled]: !item.selectable,
          [classes.buttonUnavailable]: item.selectable && item.available === false,
          [classes.buttonSoldOut]: item.selectable && !!item.soldOut,
        }, 'theme__product__characteristic__option')}
        aria-hidden={!item.selectable}
        aria-selected={selected}
        data-test-id={item.label}
        data-unavailable={item.available === false ? true : undefined}
        data-sold-out={item.soldOut ? true : undefined}
        onClick={item.selectable && onClick ? event => onClick(event, item.id) : undefined}
      >
        <div className={classes.mainRow}>
          <div className={item.selectable && item.soldOut ? classes.labelSoldOut : undefined}>
            {item.label}
            {stateText && <VisuallyHidden>{`, ${stateText}`}</VisuallyHidden>}
          </div>
          <div className={classes.mainRowRight}>
            {item.selectable && rightComponent?.()}
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
});

SheetItem.displayName = 'SheetItem';

export default memo(SheetItem);
