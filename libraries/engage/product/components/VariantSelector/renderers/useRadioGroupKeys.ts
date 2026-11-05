import { useCallback, useRef } from 'react';
import type { VariantSelectorValue } from '../types';

const STEPS: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

/**
 * Keyboard handling of a radio group: one tab stop, arrow keys, Home and End move and select.
 * @param values The values of the group.
 * @param selected The id of the selected value.
 * @param onSelect Called with the id of the value that receives the focus.
 * @returns The ref for the group element, its key handler and the tab index per value.
 */
const useRadioGroupKeys = (
  values: VariantSelectorValue[],
  selected: string | null,
  onSelect: (valueId: string) => void
) => {
  const groupRef = useRef<HTMLDivElement>(null);
  const selectable = values.filter(value => value.selectable);
  const tabStop = selectable.some(value => value.id === selected) ? selected : selectable[0]?.id;

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    const isHomeOrEnd = event.key === 'Home' || event.key === 'End';

    if (!(event.key in STEPS) && !isHomeOrEnd) {
      return;
    }

    const items = Array.from(
      groupRef.current?.querySelectorAll<HTMLElement>('[role="radio"]:not([aria-disabled="true"])') ?? []
    );

    if (!items.length) {
      return;
    }

    event.preventDefault();

    const current = items.indexOf(document.activeElement as HTMLElement);
    let next = 0;

    if (event.key === 'End') {
      next = items.length - 1;
    } else if (event.key !== 'Home') {
      next = (Math.max(current, 0) + STEPS[event.key] + items.length) % items.length;
    }

    items[next].focus();

    const { valueId } = items[next].dataset;

    if (valueId) {
      onSelect(valueId);
    }
  }, [onSelect]);

  const getTabIndex = useCallback((valueId: string) => (valueId === tabStop ? 0 : -1), [tabStop]);

  return {
    groupRef,
    onKeyDown,
    getTabIndex,
  };
};

export default useRadioGroupKeys;
