import { type MediaMarginSettings } from '@shopgate/engage/settings/types/appSettings';

/**
 * Whether to consider vertical margins when calculating the overlay position.
 */
export const CONSIDER_CONTAINER_MARGINS_ON_SCROLL_DEFAULT = false;

/**
 * The margin sides of a widget container.
 */
export const MARGIN_SIDES = ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'] as const;

/**
 * The media widget margin side that belongs to each margin of a widget container.
 */
export const MARGIN_SIDE_SETTINGS: Record<
  typeof MARGIN_SIDES[number],
  keyof MediaMarginSettings
> = {
  marginTop: 'top',
  marginBottom: 'bottom',
  marginLeft: 'left',
  marginRight: 'right',
};

/**
 * The sides of the media widget margins.
 */
export const MEDIA_MARGIN_SIDES = Object.values(MARGIN_SIDE_SETTINGS);

/**
 * The number of widgets a page renders at once; the rest follows in further batches of this size.
 */
export const WIDGETS_PER_RENDER = 3;

/**
 * How much of a widget has to be visible before it fades in, as a share of its height or in px.
 */
export const ENTRANCE_MIN_VISIBLE_RATIO = 0.25;
export const ENTRANCE_MIN_VISIBLE_PX = 150;

/**
 * Delay in ms between widgets that come into view together, and the longest delay a widget gets.
 */
export const ENTRANCE_STAGGER = 80;
export const ENTRANCE_MAX_DELAY = 400;
