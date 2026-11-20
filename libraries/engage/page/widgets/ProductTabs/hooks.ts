import { useLayoutEffect, useMemo, useRef } from 'react';
import { useWidget } from '@shopgate/engage/page/hooks';
import type { ProductsWidgetInputConfig } from '@shopgate/engage/page/helpers';
import type { HeadlineProps } from '../../components/WidgetHeadline/WidgetHeadline';

/** One tab with its name and product source. */
export interface ProductTab {
  /** The name of the tab. */
  label?: string;
  /** The product source of the tab, with the options of the product slider. */
  products?: Partial<ProductsWidgetInputConfig>;
}

/**
 * Configuration of the Product Tabs widget.
 */
export interface ProductTabsWidgetConfig {
  /** Whether the headline is shown. */
  showHeadline?: boolean;
  /** The headline above the tabs. */
  headline?: HeadlineProps;
  /** The tabs. */
  tabs?: ProductTab[];
  /** The number of products of each tab. */
  productCount?: number;
  /** Sort order of the products of each tab. */
  sort?: 'relevance' | 'priceDesc' | 'priceAsc';
  /** Whether the cards show the product name. */
  showName?: boolean;
  /** Whether the cards show the price. */
  showPrice?: boolean;
  /** Whether the cards show the rating. */
  showRating?: boolean;
}

/** Duration and easing of the tab animations, like the tabs of the admin. */
export const TAB_SLIDE = {
  duration: 260,
  easing: 'cubic-bezier(0.2, 0, 0, 1)',
};

/**
 * Hook to access the Product Tabs widget configuration.
 * @returns The widget context, the headline when shown, the tabs and the product slider settings
 * that apply to all tabs.
 */
export const useProductTabsWidget = () => {
  const widget = useWidget<ProductTabsWidgetConfig>();
  const {
    tabs = [], productCount, sort, showName, showPrice, showRating,
  } = widget.config;

  const sliderSettings = useMemo(() => ({
    productCount,
    sort,
    showName,
    showPrice,
    showRating,
    slideAutomatic: false,
    endlessSlider: false,
  }), [productCount, sort, showName, showPrice, showRating]);

  return {
    widget,
    headline: widget.config.showHeadline && widget.config.headline?.text
      ? widget.config.headline
      : null,
    tabs,
    sliderSettings,
  };
};

/**
 * Slides the content of a newly selected tab in from the side of that tab.
 * @param index The index of the selected tab.
 * @param reduceMotion Whether the user asked for reduced motion.
 * @returns A ref for the element that holds the tab content.
 */
export const useTabSlideAnimation = (index: number, reduceMotion: boolean) => {
  const ref = useRef<HTMLDivElement>(null);
  const previousIndex = useRef(index);

  useLayoutEffect(() => {
    const direction = Math.sign(index - previousIndex.current);
    previousIndex.current = index;

    if (!direction || !ref.current?.animate || reduceMotion) return;

    ref.current.animate([
      {
        opacity: 0,
        transform: `translateX(${direction * 16}px)`,
      },
      {
        opacity: 1,
        transform: 'none',
      },
    ], TAB_SLIDE);
  }, [index, reduceMotion]);

  return ref;
};
