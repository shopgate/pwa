import {
  getNavigationAction,
  registerDefaultNavigationAction,
  registerNavigationAction,
} from './registry';
import type { NavigationActionHook } from './types';

const createAction = (label: string): NavigationActionHook => () => ({
  available: true,
  icon: 'burger',
  label,
  onClick: jest.fn(),
});

describe('navigation action registry', () => {
  it('uses the core action while no extension provides one', () => {
    const core = createAction('core');
    registerDefaultNavigationAction('menuA', core);

    expect(getNavigationAction('menuA')).toBe(core);
  });

  it('lets an extension replace the core action, even when it registers first', () => {
    const extension = createAction('extension');
    const core = createAction('core');
    registerNavigationAction('menuB', extension);
    registerDefaultNavigationAction('menuB', core);

    expect(getNavigationAction('menuB')).toBe(extension);
  });

  it('knows no action nobody registered', () => {
    expect(getNavigationAction('unknown')).toBeUndefined();
  });
});
