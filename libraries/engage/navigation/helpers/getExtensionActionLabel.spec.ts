import { getExtensionActionLabel } from './getExtensionActionLabel';

jest.mock('@shopgate/engage/core/helpers/i18n', () => ({
  i18n: {
    text: (key: string) => `translated ${key}`,
    getLang: () => mockLang,
  },
}));

let mockLang: unknown = 'de-DE';

const ADMIN_LABEL = {
  'en-us': 'Customer card',
  'de-de': 'Kundenkarte',
};

const MISSING_TEXTS: [string, unknown][] = [
  ['missing', undefined],
  ['empty', ''],
  ['null', null],
  ['whitespace only', ' \n\t '],
  ['no string', 42],
];

describe('getExtensionActionLabel', () => {
  beforeEach(() => {
    mockLang = 'de-DE';
  });

  it('translates the label of the placement first', () => {
    const meta = {
      label: 'card.label',
      adminLabel: ADMIN_LABEL,
    };

    expect(getExtensionActionLabel('@shopgate/test/card', meta, 'card.action'))
      .toBe('translated card.label');
  });

  it.each(MISSING_TEXTS)('translates the label of the resolved action when the label of the placement is %s', (_, label) => {
    const meta = {
      label,
      adminLabel: ADMIN_LABEL,
    };

    expect(getExtensionActionLabel('@shopgate/test/card', meta, 'card.action'))
      .toBe('translated card.action');
  });

  it.each(MISSING_TEXTS)('uses the admin label of the shop language when the label of the resolved action is %s', (_, actionLabel) => {
    const meta = {
      label: '',
      adminLabel: ADMIN_LABEL,
    };

    expect(getExtensionActionLabel('@shopgate/test/card', meta, actionLabel)).toBe('Kundenkarte');
  });

  it.each([
    ['de-DE', { 'DE-de': 'Kundenkarte' }],
    ['de-de', { 'de-DE': 'Kundenkarte' }],
  ])('compares the shop language %s with the admin locales case-insensitively', (lang, adminLabel) => {
    mockLang = lang;

    expect(getExtensionActionLabel('@shopgate/test/card', { adminLabel }))
      .toBe('Kundenkarte');
  });

  it('does not take an admin label of another region of the shop language', () => {
    mockLang = 'de-AT';

    expect(getExtensionActionLabel('@shopgate/test/card', { adminLabel: ADMIN_LABEL }))
      .toBe('Customer card');
  });

  it.each(MISSING_TEXTS)('falls back to the en-us admin label when the one of the shop language is %s', (_, text) => {
    const meta = {
      adminLabel: {
        'de-de': text,
        'EN-US': 'Customer card',
      },
    };

    expect(getExtensionActionLabel('@shopgate/test/card', meta)).toBe('Customer card');
  });

  it.each([
    ['no shop language', undefined],
    ['an empty shop language', ''],
  ])('uses the en-us admin label with %s', (_, lang) => {
    mockLang = lang;

    expect(getExtensionActionLabel('@shopgate/test/card', { adminLabel: ADMIN_LABEL }))
      .toBe('Customer card');
  });

  it.each(MISSING_TEXTS)('falls back to the name of the action when the en-us admin label is %s', (_, text) => {
    const meta = { adminLabel: { 'en-us': text } };

    expect(getExtensionActionLabel('@shopgate/test/card', meta)).toBe('@shopgate/test/card');
  });

  it.each([
    ['missing', undefined],
    ['null', null],
    ['a string', 'Customer card'],
    ['an array', ['Customer card']],
    ['a map without string values', { 'en-us': 1 }],
    ['an empty map', {}],
  ])('falls back to the name of the action when the admin labels are %s', (_, adminLabel) => {
    expect(getExtensionActionLabel('@shopgate/test/card', { adminLabel }))
      .toBe('@shopgate/test/card');
  });
});
