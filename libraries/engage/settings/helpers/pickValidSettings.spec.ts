import { pickValidSettings } from './pickValidSettings';

const defaults = {
  type: 'dropdown' as 'dropdown' | 'chips',
  enabled: false,
  zoom: 100,
};
const options = { type: ['dropdown', 'chips'] as const };

describe('pickValidSettings', () => {
  it('keeps valid values', () => {
    expect(pickValidSettings({
      type: 'chips',
      enabled: true,
      zoom: 200,
    }, defaults, options)).toEqual({
      type: 'chips',
      enabled: true,
      zoom: 200,
    });
  });

  it('drops values that are no option, have the wrong type or are unknown', () => {
    expect(pickValidSettings({
      type: 'constructor',
      enabled: 'false',
      zoom: null,
      other: 1,
    }, defaults, options)).toEqual({});
  });

  it.each([null, undefined, 'chips', ['chips'], 5])('ignores the branch %p', (branch) => {
    expect(pickValidSettings(branch, defaults, options)).toBeUndefined();
  });
});
