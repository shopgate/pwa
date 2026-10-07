import {
  useCallback, useEffect, useRef, useState, type KeyboardEvent, type RefObject,
} from 'react';
import Transition from 'react-transition-group/Transition';
import { ArrowDropIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import { makeStyles } from '@shopgate/engage/styles';
import { VisuallyHidden } from '@shopgate/engage/a11y';
import { getValueStateText } from './valueState';
import useRadioGroupKeys from './useRadioGroupKeys';
import transition from '../../Characteristics/transition';
import type { VariantRendererProps } from '../types';

const useStyles = makeStyles({ name: 'VariantInlineDropdown' })(theme => ({
  root: {
    margin: theme.spacing(0, 2, 1.5),
    border: `1px solid ${theme.components.input.border}`,
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.surface,
    overflow: 'hidden',
  },
  field: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '100%',
    minHeight: 56,
    padding: theme.spacing(1, 1, 1, 2),
    border: 0,
    background: 'transparent',
    color: theme.palette.text.primary,
    font: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
    outline: 0,
    transition: theme.transitions.create(['background', 'color'], {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeIn,
    }),
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
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.25),
  },
  selection: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  arrow: {
    display: 'flex',
    fontSize: theme.components.icon.small,
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shorter,
    }),
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
    padding: theme.spacing(1.5, 2),
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
    '&[aria-checked="true"]': {
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
 * @returns The inline dropdown.
 */
const VariantInlineDropdown = ({
  charRef,
  highlight: highlightProp,
  id,
  domId = id,
  label,
  selected,
  values,
  select,
}: VariantRendererProps) => {
  const { classes, cx } = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const listId = `variant-inline-dropdown-${domId}`;
  const labelId = `${listId}-label`;
  const wasExpanded = useRef(false);
  const selectedLabel = values.find(value => value.id === selected)?.label;

  useEffect(() => {
    setHighlight(highlightProp);
  }, [highlightProp]);

  const collapse = useCallback(() => {
    setExpanded(false);
    charRef.current?.focus();
  }, [charRef]);

  const handleSelect = useCallback((valueId: string) => {
    select({
      id,
      value: valueId,
    });
    collapse();
  }, [collapse, id, select]);

  const handleArrowSelect = useCallback((valueId: string) => {
    select({
      id,
      value: valueId,
    });
  }, [id, select]);

  const { groupRef, onKeyDown, getTabIndex } = useRadioGroupKeys(
    values,
    selected,
    handleArrowSelect
  );

  useEffect(() => {
    if (expanded && !wasExpanded.current) {
      groupRef.current?.querySelector<HTMLElement>('[role="radio"][tabindex="0"]')?.focus();
    }
    wasExpanded.current = expanded;
  }, [expanded, groupRef]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && expanded) {
      event.stopPropagation();
      collapse();
    }
  }, [collapse, expanded]);

  return (
    <div
      className={cx(classes.root, 'engage__variant-selector__inline-dropdown')}
      data-type="inlineDropdown"
    >
      <Transition in={highlight} timeout={500} onEntered={() => setHighlight(false)}>
        {(state: keyof typeof transition) => (
          <button
            type="button"
            ref={charRef as RefObject<HTMLButtonElement>}
            className={cx(classes.field, 'engage__variant-selector__inline-dropdown__field')}
            aria-expanded={expanded}
            aria-controls={expanded ? listId : undefined}
            onClick={() => setExpanded(current => !current)}
            onKeyDown={handleKeyDown}
            style={transition[state]}
          >
            <span className={cx(classes.text, 'engage__variant-selector__inline-dropdown__text')}>
              <span id={labelId} className={cx(classes.label, 'engage__variant-selector__label')}>{label}</span>
              <span className={cx(classes.selection, 'engage__variant-selector__selected-value')}>
                {selectedLabel || i18n.text('common.please_choose')}
              </span>
            </span>
            <span
              className={cx(classes.arrow, 'engage__variant-selector__inline-dropdown__arrow')}
              data-expanded={expanded ? true : undefined}
              aria-hidden
            >
              <ArrowDropIcon />
            </span>
          </button>
        )}
      </Transition>
      {expanded && (
        // eslint-disable-next-line jsx-a11y/interactive-supports-focus
        <div
          id={listId}
          ref={groupRef}
          role="radiogroup"
          aria-labelledby={labelId}
          className={cx(classes.list, 'engage__variant-selector__inline-dropdown__list')}
          onKeyDown={(event) => {
            handleKeyDown(event);
            onKeyDown(event);
          }}
        >
          {values.map(value => (
            <button
              key={value.id}
              type="button"
              role="radio"
              aria-checked={value.selected}
              aria-disabled={!value.selectable}
              className={cx(classes.option, 'engage__variant-selector__inline-dropdown__option')}
              data-unavailable={value.available === false ? true : undefined}
              data-sold-out={value.soldOut ? true : undefined}
              data-value-id={value.id}
              tabIndex={getTabIndex(value.id)}
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
