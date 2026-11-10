import { useMemo } from 'react';
import { useResponsiveValue } from '@shopgate/engage/styles';
import type { Breakpoint } from '@shopgate/engage/styles/theme';
import { SCREEN_SIZE_BREAKPOINTS } from '@shopgate/engage/settings/constants/appSettings';
import type { ScreenSize } from '@shopgate/engage/settings/types/appSettings';
import useCategorySettings from './useCategorySettings';

const MIN_COLUMNS = 1;
const MAX_COLUMNS = 8;

/**
 * Resolves the number of category grid columns for the active breakpoint.
 * @returns The number of columns.
 */
const useCategoryGridColumns = (): number => {
  const { grid: { columns } } = useCategorySettings();

  const breakpoints = useMemo(
    () => (Object.entries(columns) as [ScreenSize, number][]).reduce(
      (acc, [size, value]) => {
        acc[SCREEN_SIZE_BREAKPOINTS[size]] = value;
        return acc;
      },
      {} as Partial<Record<Breakpoint, number>>
    ),
    [columns]
  );

  const configured = Math.round(Number(useResponsiveValue(breakpoints)));

  return Math.min(Math.max(configured || MIN_COLUMNS, MIN_COLUMNS), MAX_COLUMNS);
};

export default useCategoryGridColumns;
