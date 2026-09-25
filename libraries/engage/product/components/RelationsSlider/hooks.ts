import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { useResponsiveValue } from '@shopgate/engage/styles';
import type { Breakpoint } from '@shopgate/engage/styles/theme';
import {
  getAreAppSettingsHydrated,
  getProductSliderSlidesPerView,
} from '@shopgate/engage/settings/selectors/appSettings';
import { SCREEN_SIZE_BREAKPOINTS } from '@shopgate/engage/settings/constants/appSettings';
import type {
  ScreenSize,
  SlidesPerView,
} from '@shopgate/engage/settings/types/appSettings';
import { WIDGET_ID, DEFAULT_SLIDES_PER_VIEW } from './constants';

/**
 * Resolves the number of slides the RelationsSlider shows side by side for the active breakpoint.
 * @returns The resolved number of slides for the active breakpoint.
 */
export const useSlidesPerView = (): number => {
  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const appSettingsSlidesPerView = useSelector(getProductSliderSlidesPerView);

  const { slidesPerView: legacySlidesPerView } =
    (useWidgetSettings(WIDGET_ID) || {}) as { slidesPerView?: number };

  const sizes = useMemo<SlidesPerView>(() => {
    if (!areAppSettingsHydrated && typeof legacySlidesPerView === 'number') {
      return { small: legacySlidesPerView };
    }

    return appSettingsSlidesPerView;
  }, [areAppSettingsHydrated, legacySlidesPerView, appSettingsSlidesPerView]);

  const breakpoints = useMemo<Partial<Record<Breakpoint, number>>>(
    () => (Object.entries(sizes) as [ScreenSize, number][]).reduce(
      (acc, [size, value]) => {
        acc[SCREEN_SIZE_BREAKPOINTS[size]] = value;
        return acc;
      },
      {} as Partial<Record<Breakpoint, number>>
    ),
    [sizes]
  );

  const resolved = useResponsiveValue(breakpoints) as number | undefined;

  return resolved || DEFAULT_SLIDES_PER_VIEW;
};
