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
