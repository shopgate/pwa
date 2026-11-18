import { getNavigationActionBadge } from './getNavigationActionBadge';
import type { ResolvedNavigationAction } from '../types';

/**
 * Creates a resolved action with the given badge fields.
 * @param fields The badge fields of the action.
 * @returns The resolved action.
 */
const createAction = (fields: Partial<ResolvedNavigationAction>): ResolvedNavigationAction => ({
  available: true,
  icon: 'card',
  label: 'card.label',
  onClick: jest.fn(),
  ...fields,
});

describe('getNavigationActionBadge', () => {
  it('shows the count, capped at 99, and announces it with the label by default', () => {
    expect(getNavigationActionBadge(createAction({ badgeCount: 3 }), 'Card')).toEqual({
      count: 3,
      max: 99,
      showCount: true,
      ariaLabel: 'Card, 3',
    });
  });

  it('announces the exact count above the maximum', () => {
    const badge = getNavigationActionBadge(createAction({ badgeCount: 120 }), 'Card');

    expect(badge.count).toBe(120);
    expect(badge.max).toBe(99);
    expect(badge.ariaLabel).toBe('Card, 120');
  });

  it('uses the maximum of the action', () => {
    const badge = getNavigationActionBadge(createAction({
      badgeCount: 12,
      badgeMax: 9,
    }), 'Card');

    expect(badge.max).toBe(9);
  });

  it('announces only the label in dot mode', () => {
    expect(getNavigationActionBadge(createAction({
      badgeCount: 2,
      badgeShowCount: false,
    }), 'Card')).toEqual({
      count: 2,
      max: 99,
      showCount: false,
      ariaLabel: undefined,
    });
  });

  it.each([true, false])('announces the badge label of the action (showCount %j)', (badgeShowCount) => {
    const badge = getNavigationActionBadge(createAction({
      badgeCount: 3,
      badgeShowCount,
      badgeLabel: 'Card, 3 new',
    }), 'Card');

    expect(badge.ariaLabel).toBe('Card, 3 new');
  });

  it('falls back to the label and the count for an empty badge label', () => {
    const badge = getNavigationActionBadge(createAction({
      badgeCount: 3,
      badgeLabel: '',
    }), 'Card');

    expect(badge.ariaLabel).toBe('Card, 3');
  });

  it.each([
    ['no count', undefined],
    ['a count of 0', 0],
    ['a negative count', -2],
    ['NaN', NaN],
  ])('has a count of 0 and no accessible name for %s', (_, badgeCount) => {
    const badge = getNavigationActionBadge(createAction({
      badgeCount,
      badgeLabel: 'Card, nothing new',
    }), 'Card');

    expect(badge.count).toBe(0);
    expect(badge.ariaLabel).toBeUndefined();
  });

  it('has no accessible name in dot mode while the count is 0', () => {
    const badge = getNavigationActionBadge(createAction({
      badgeCount: 0,
      badgeShowCount: false,
    }), 'Card');

    expect(badge.count).toBe(0);
    expect(badge.showCount).toBe(false);
    expect(badge.ariaLabel).toBeUndefined();
  });
});
