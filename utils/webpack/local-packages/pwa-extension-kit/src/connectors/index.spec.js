import connectors, {
  withPageProductId,
  withHistoryActions,
  withPageState,
  withThemeComponents,
  withProductContext,
  withUser,
} from './index';

describe('data/connectors', () => {
  it('should export all functions as default', () => {
    expect(typeof connectors).toBe('object');
    expect(typeof connectors.withHistoryActions).toBe('function');
    expect(typeof connectors.withPageProductId).toBe('function');
    expect(typeof connectors.withPageState).toBe('function');
    expect(typeof connectors.withThemeComponents).toBe('function');
    expect(typeof connectors.withProductContext).toBe('function');
    expect(typeof connectors.withUser).toBe('function');
  });

  it('should export withPageProductId as named export', () => {
    expect(typeof withHistoryActions).toBe('function');
    expect(typeof withPageProductId).toBe('function');
    expect(typeof withPageState).toBe('function');
    expect(typeof withUser).toBe('function');
    expect(typeof withThemeComponents).toBe('function');
    expect(typeof withProductContext).toBe('function');
  });
});
