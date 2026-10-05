import React, { useCallback, useEffect, useState } from 'react';
import Transition from 'react-transition-group/Transition';
import { ArrowDropIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import { makeStyles } from '@shopgate/engage/styles';
import { VisuallyHidden } from '@shopgate/engage/a11y';
import { getValueStateText } from './valueState';
import transition from '../../Characteristics/transition';
import type { VariantRendererProps } from '../types';

const useStyles = makeStyles({ name: 'VariantInlineDropdown' })(theme => ({
  root: {
    margin: '0 16px 12px',
    border: `1px solid ${theme.components.input.border}`,
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.surface,
    overflow: 'hidden',
  },
  field: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    minHeight: 56,
    padding: '8px 8px 8px 16px',
    border: 0,
    background: 'transparent',
    color: theme.palette.text.primary,
    font: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
    outline: 0,
    transition: 'background 250ms ease-in, color 250ms ease-in',
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.text.primary}`,
      outlineOffset: -2,
    },
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: theme.typography.caption.fontSize,
    opacity: 0.7,
    marginBottom: 2,
  },
  selection: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  arrow: {
    display: 'flex',
    fontSize: theme.components.icon.small,
    transition: 'transform 200ms ease-in-out',
    '&[data-expanded]': {
      transform: 'rotate(180deg)',
    },
  },
  list: {
    maxHeight: 240,
    overflowY: 'auto',
    borderTop: `1px solid ${theme.components.border.light}`,
  },
  option: {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    border: 0,
    background: 'transparent',
    color: theme.palette.text.primary,
    font: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.text.primary}`,
      outlineOffset: -2,
    },
    '&[aria-selected="true"]': {
      background: theme.palette.background.emphasized,
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&[data-unavailable]': {
      color: theme.palette.text.secondary,
    },
    '&[data-sold-out]': {
      color: theme.palette.text.secondary,
      textDecoration: 'line-through',
    },
  },
}));

/**
 * Renders a characteristic as a field that expands its values inline, for use inside sheets.
 * @param props The renderer props.
 * @returns The inline dropdown.
 */
const VariantInlineDropdown = ({
  charRef,
  highlight: highlightProp,
  id,
  label,
  selected,
  values,
  select,
}: VariantRendererProps) => {
  const { classes, cx } = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const listId = `variant-inline-dropdown-${id}`;
  const selectedLabel = values.find(value => value.id === selected)?.label;

  useEffect(() => {
    setHighlight(highlightProp);
  }, [highlightProp]);

  const collapse = useCallback(() => {
    setExpanded(false);
    charRef.current?.focus();
  }, [charRef]);

  const handleSelect = useCallback((valueId: string) => {
    select({ id, value: valueId });
    collapse();
  }, [collapse, id, select]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && expanded) {
      event.stopPropagation();
      collapse();
    }
  }, [collapse, expanded]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cx(classes.root, 'engage__variant-selector__inline-dropdown')}
      data-type="inlineDropdown"
      onKeyDown={handleKeyDown}
    >
      <Transition in={highlight} timeout={500} onEntered={() => setHighlight(false)}>
        {(state: keyof typeof transition) => (
          <button
            type="button"
            ref={charRef as React.RefObject<HTMLButtonElement>}
            className={cx(classes.field, 'engage__variant-selector__inline-dropdown-field')}
            aria-expanded={expanded}
            aria-controls={expanded ? listId : undefined}
            onClick={() => setExpanded(current => !current)}
            style={transition[state]}
          >
            <span className={classes.text}>
              <span className={cx(classes.label, 'engage__variant-selector__label')}>{label}</span>
              <span className={cx(classes.selection, 'engage__variant-selector__selected-value')}>
                {selectedLabel || i18n.text('product.pick_an_attribute', [label])}
              </span>
            </span>
            <span className={classes.arrow} data-expanded={expanded ? true : undefined} aria-hidden>
              <ArrowDropIcon />
            </span>
          </button>
        )}
      </Transition>
      {expanded && (
        <div id={listId} role="listbox" aria-label={label} className={classes.list}>
          {values.map(value => (
            <button
              key={value.id}
              type="button"
              role="option"
              aria-selected={value.selected}
              aria-disabled={!value.selectable}
              className={cx(classes.option, 'engage__variant-selector__inline-dropdown-option')}
              data-unavailable={value.available === false ? true : undefined}
              data-sold-out={value.soldOut ? true : undefined}
              onClick={() => {
                if (value.selectable) {
                  handleSelect(value.id);
                }
              }}
            >
              {value.label}
              {getValueStateText(value) && <VisuallyHidden>{`, ${getValueStateText(value)}`}</VisuallyHidden>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantInlineDropdown;
