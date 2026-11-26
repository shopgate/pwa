import { registerWidgetAliases, resolveWidgetCode } from './widgetAliases';

describe('widget aliases', () => {
  beforeAll(() => {
    registerWidgetAliases({
      'old/Widget': 'new/Widget',
      'old/Installed': 'new/Widget',
      'old/MissingTarget': 'new/NotInstalled',
    });
  });

  const components = {
    'new/Widget': () => null,
    'old/Installed': () => null,
  };

  it('keeps an installed code instead of its alias', () => {
    expect(resolveWidgetCode('old/Installed', components)).toBe('old/Installed');
  });

  it('resolves an alias to its installed target', () => {
    expect(resolveWidgetCode('old/Widget', components)).toBe('new/Widget');
  });

  it('keeps the code when the alias target is not installed', () => {
    expect(resolveWidgetCode('old/MissingTarget', components)).toBe('old/MissingTarget');
  });

  it('keeps a code without an alias', () => {
    expect(resolveWidgetCode('unknown/Widget', components)).toBe('unknown/Widget');
  });
});
