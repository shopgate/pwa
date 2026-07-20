import { transformGeneralPipelineError, getDisplayErrorMessage } from './pipeline';

describe('transformGeneralPipelineError', () => {
  const general = [
    'An internal error occured.',
    '502 Bad Gateway',
    'error from bigApi 504',
    'BigApi request timeout',
    'error in bigApi response',
  ];

  const others = [
    'Some other pipeline error',
    'Login was unsuccessful',
  ];

  general.forEach((message) => {
    it(`should return general for ${message}`, () => {
      expect(transformGeneralPipelineError({ message })).toBe('error.general');
    });
  });

  others.forEach((message) => {
    it(`should return original ${message}`, () => {
      expect(transformGeneralPipelineError({ message })).toBe(message);
    });
  });
});

describe('getDisplayErrorMessage', () => {
  const GENERIC = 'modal.body_error';

  it('should use an extension-provided translated message and flag it as translated', () => {
    const error = {
      message: 'Der Artikel ist nicht mehr verfügbar',
      meta: {
        translated: true,
        message: 'Der Artikel ist nicht mehr verfügbar',
      },
    };
    expect(getDisplayErrorMessage(error, GENERIC)).toEqual({
      message: 'Der Artikel ist nicht mehr verfügbar',
      translated: true,
    });
  });

  it('should use the code-mapped message key when it differs from the raw backend message', () => {
    // errorManager mapped EFAVORITE to a locale key; raw message kept in meta. The mapped key is
    // deliberately different from GENERIC so this asserts the mapped branch, not the fallback.
    const error = {
      message: 'favorites.error_general',
      meta: { message: "Pipeline 'x' failed to load favorites" },
    };
    expect(getDisplayErrorMessage(error, GENERIC)).toEqual({
      message: 'favorites.error_general',
      translated: false,
    });
  });

  it('should surface a translation key even when it equals the raw message', () => {
    // A pipeline may return a dotted i18n key directly; errorManager leaves it untouched so
    // message === meta.message. It is a translation key, not raw text, so it must be shown.
    const error = {
      message: 'cart.error_out_of_stock',
      meta: { message: 'cart.error_out_of_stock' },
    };
    expect(getDisplayErrorMessage(error, GENERIC)).toEqual({
      message: 'cart.error_out_of_stock',
      translated: false,
    });
  });

  it('should fall back to generic when nothing mapped (raw backend message)', () => {
    // No mapping: errorManager falls back to the raw message, so message === meta.message.
    const raw = 'Service unavailable: node pool drained';
    const error = {
      message: raw,
      meta: { message: raw },
    };
    expect(getDisplayErrorMessage(error, GENERIC)).toEqual({
      message: GENERIC,
      translated: false,
    });
  });

  it('should fall back to generic when translated flag is set but no message is present', () => {
    const error = {
      message: 'Some raw backend error',
      meta: { translated: true },
    };
    expect(getDisplayErrorMessage(error, GENERIC)).toEqual({
      message: GENERIC,
      translated: false,
    });
  });

  it('should fall back to generic when there is no meta', () => {
    expect(getDisplayErrorMessage({ message: 'raw text' }, GENERIC)).toEqual({
      message: GENERIC,
      translated: false,
    });
  });
});
