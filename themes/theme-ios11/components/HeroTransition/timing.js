import { FADE_DURATION } from '@shopgate/engage/components/View/constants';

/**
 * The duration of the FLIP flight + crossfade, in milliseconds. Derived from
 * the engage View crossfade duration (the single source of truth) so the hero
 * clone's flight stays in lockstep with the routed-view fade.
 * @type {number}
 */
export const FLIGHT_DURATION = FADE_DURATION;

/**
 * How long to wait for a hero target before giving up, in milliseconds.
 * @type {number}
 */
export const TARGET_TIMEOUT = 600;

/**
 * Backstop teardown delay, in milliseconds. Slightly longer than the flight so
 * a missed transitionend still tears the flight down.
 * @type {number}
 */
export const CLEANUP_SAFETY = FLIGHT_DURATION + 100;

/**
 * Backstop reveal of a hidden hero, in milliseconds. Last resort to un-hide a
 * hero whose flight never completed.
 * @type {number}
 */
export const HERO_REVEAL_SAFETY = 1500;
