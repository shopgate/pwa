import { makeStyles } from '@shopgate/engage/styles';
import { VisuallyHidden } from '@shopgate/engage/a11y';
import { getValueStateText } from './valueState';
import type { VariantSelectorValue } from '../types';

const useStyles = makeStyles({ name: 'VariantChip' })(theme => ({
  root: {
    flexShrink: 0,
    minWidth: 48,
    maxWidth: '100%',
    minHeight: 40,
    padding: theme.spacing(0, 1.75),
    border: `1px solid ${theme.components.input.border}`,
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.surface,
    color: theme.palette.text.primary,
    font: 'inherit',
    fontSize: theme.typography.body2.fontSize,
    lineHeight: 1.2,
    overflowWrap: 'anywhere',
    cursor: 'pointer',
    outline: 0,
    transition: theme.transitions.create(['background', 'color', 'border-color'], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeIn,
    }),
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.text.primary}`,
      outlineOffset: 2,
    },
    '&[data-unavailable]': {
      borderStyle: 'dashed',
      borderColor: theme.palette.text.secondary,
      color: theme.palette.text.secondary,
    },
    '&[data-sold-out]': {
      color: theme.palette.text.secondary,
      textDecoration: 'line-through',
    },
    '&[aria-checked="true"]': {
      background: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    '&[aria-disabled="true"]': {
      opacity: 0.4,
      cursor: 'default',
    },
  },
}));

export interface VariantChipProps {
  value: VariantSelectorValue;
  onSelect: (valueId: string) => void;
  tabIndex?: number;
}

/**
 * A single characteristic value shown as a chip.
 * @returns The chip.
 */
const VariantChip = ({ value, onSelect, tabIndex }: VariantChipProps) => {
  const { classes, cx } = useStyles();

  return (
    <button
      type="button"
      role="radio"
      aria-checked={value.selected}
      aria-disabled={!value.selectable}
      className={cx(classes.root, 'engage__variant-selector__chip')}
      data-unavailable={value.available === false ? true : undefined}
      data-sold-out={value.soldOut ? true : undefined}
      data-test-id={value.label}
      data-value-id={value.id}
      tabIndex={tabIndex}
      onClick={() => {
        if (value.selectable) {
          onSelect(value.id);
        }
      }}
    >
      {value.label}
      {getValueStateText(value) && <VisuallyHidden>{`, ${getValueStateText(value)}`}</VisuallyHidden>}
    </button>
  );
};

export default VariantChip;
