import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { VisuallyHidden } from '@shopgate/engage/a11y';
import { getValueStateText } from './valueState';
import type { VariantSelectorValue } from '../types';

const useStyles = makeStyles({ name: 'VariantChip' })(theme => ({
  root: {
    flexShrink: 0,
    minWidth: 48,
    minHeight: 40,
    padding: '0 14px',
    border: `1px solid ${theme.components.input.border}`,
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.surface,
    color: theme.palette.text.primary,
    font: 'inherit',
    fontSize: theme.typography.body2.fontSize,
    lineHeight: 1.2,
    cursor: 'pointer',
    outline: 0,
    transition: 'background 150ms ease-in, color 150ms ease-in, border-color 150ms ease-in',
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.text.primary}`,
      outlineOffset: 2,
    },
    '&[data-unavailable]': {
      borderStyle: 'dashed',
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
}

/**
 * A single characteristic value shown as a chip.
 * @param props The component props.
 * @returns The chip.
 */
const VariantChip = ({ value, onSelect }: VariantChipProps) => {
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
