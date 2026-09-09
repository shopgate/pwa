import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { WidgetContext } from '@shopgate/engage/page/components/Widgets/WidgetContext';
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
 * Resolves the number of slides the ProductSlider shows side by side for the active breakpoint.
 * @param slidesPerViewProp The explicit prop value, if the caller passed one.
 * @returns The resolved number of slides for the active breakpoint.
 */
export const useSlidesPerView = (slidesPerViewProp?: number): number => {
  const { code: widgetCode } = useContext(WidgetContext);
  const isInsideWidget = Boolean(widgetCode);

  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const appSettingsSlidesPerView = useSelector(getProductSliderSlidesPerView);

  const { slidesPerView: legacySlidesPerView } =
    (useWidgetSettings(WIDGET_ID) || {}) as { slidesPerView?: number };

  const sizes = useMemo<SlidesPerView>(() => {
    if (!areAppSettingsHydrated && !isInsideWidget && typeof legacySlidesPerView === 'number') {
      return { small: legacySlidesPerView };
    }

    return appSettingsSlidesPerView;
  }, [areAppSettingsHydrated, isInsideWidget, legacySlidesPerView, appSettingsSlidesPerView]);

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

  return slidesPerViewProp || resolved || DEFAULT_SLIDES_PER_VIEW;
};
