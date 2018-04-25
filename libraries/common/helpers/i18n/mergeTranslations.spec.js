import merge from 'lodash/merge';
import mergeTranslations from './mergeTranslations';

global.process.env = {
  LOCALE_FILE: 'en-US',
};

const themeTranslations = {
  common: {
    cancel: 'Cancel',
    submit: 'Submit',
  },
  search: {
    no_result: {
      heading: 'Oops!',
    },
    placeholder: 'Search',
  },
};

const extensionTranslations = {
  '@shopgate/awesome-extension_12345/locale/en': {
    search: {
      no_result: {
        heading: 'Ouch!',
      },
    },
  },
  '@acme/some-extension/locale/de-DE': {
    custom_scope: {
      string: 'Wert',
      other_string: 'Anderer Wert',
    },
    common: {
      submit: 'Senden',
    },
  },
  '@acme/some-extension/locale/en-US': {
    common: {
      submit: 'Send',
    },
    custom_scope: {
      string: 'Value',
      other_string: 'Other value',
    },
  },
  '@acme/wrong/en-US/translations': {
    common: {
      cancel: 'Abort',
    },
  },
};

// Manually merged translations to eleminate false positives through wrong configured lodash merge.
const mergedTranslations = {
  common: {
    cancel: 'Cancel',
    submit: 'Send',
  },
  custom_scope: {
    string: 'Value',
    other_string: 'Other value',
  },
  search: {
    no_result: {
      heading: 'Ouch!',
    },
    placeholder: 'Search',
  },
};

describe('mergeTranslations helper', () => {
  it('should merge the translations as expected based on the env locale', () => {
    const result = mergeTranslations(themeTranslations, extensionTranslations);
    expect(result).toEqual(mergedTranslations);
  });

  it('should merge the translations as expected for a passed en-US locale', () => {
    const result = mergeTranslations(themeTranslations, extensionTranslations, 'en-US');
    expect(result).toEqual(mergedTranslations);
  });

  it('should merge the translations as expected for a passed de-DE locale', () => {
    const result = mergeTranslations(themeTranslations, extensionTranslations, 'de-DE');
    expect(result).toEqual(merge(themeTranslations, extensionTranslations['@acme/some-extension/locale/de-DE']));
  });

  it('should return the theme translations if no extension translations match the locale', () => {
    const result = mergeTranslations(themeTranslations, extensionTranslations, 'fr-FR');
    expect(result).toEqual(themeTranslations);
  });

  it('should return the theme translations if no extension translations are passed', () => {
    const result = mergeTranslations(themeTranslations);
    expect(result).toEqual(themeTranslations);
  });

  it('should return the theme translations if the extension translations are empty', () => {
    const result = mergeTranslations(themeTranslations, {}, 'en-US');
    expect(result).toEqual(themeTranslations);
  });
});
