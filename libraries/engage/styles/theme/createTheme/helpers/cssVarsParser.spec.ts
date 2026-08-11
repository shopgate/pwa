import cssVarsParser from './cssVarsParser';

describe('styles/theme/createTheme/helpers/cssVarsParser', () => {
  const parse = (theme: object) => cssVarsParser(theme, { prefix: 'sg' }).css as Record<string, string | number>;

  it('appends px to variant font sizes provided as numbers', () => {
    const { '--sg-typography-body2-fontSize': body2 } = parse({
      typography: { body2: { fontSize: 12 } },
    });

    expect(body2).toBe('12px');
  });

  it('keeps the base typography.fontSize coefficient unitless', () => {
    const { '--sg-typography-fontSize': base } = parse({
      typography: { fontSize: 14 },
    });

    expect(base).toBe(14);
  });

  it('keeps genuinely unitless typography values unitless', () => {
    const css = parse({
      typography: {
        body2: {
          fontWeight: 900,
          lineHeight: 1.5,
        },
      },
    });

    expect(css['--sg-typography-body2-fontWeight']).toBe(900);
    expect(css['--sg-typography-body2-lineHeight']).toBe(1.5);
  });

  it('appends px to other numeric lengths', () => {
    const { '--sg-shape-borderRadius': borderRadius } = parse({
      shape: { borderRadius: 4 },
    });

    expect(borderRadius).toBe('4px');
  });

  it('passes string values through untouched', () => {
    const { '--sg-typography-body2-fontSize': body2 } = parse({
      typography: { body2: { fontSize: '0.75rem' } },
    });

    expect(body2).toBe('0.75rem');
  });

  it('emits a var() reference verbatim', () => {
    // Variant font weights reference the shared `fontWeight*` tokens (see createTypography), so the
    // reference has to survive the parser unchanged - no `px` suffix, no rewriting.
    const css = parse({
      typography: {
        fontWeightRegular: 400,
        body2: { fontWeight: 'var(--sg-typography-fontWeightRegular, 400)' },
      },
    });

    expect(css['--sg-typography-fontWeightRegular']).toBe(400);
    expect(css['--sg-typography-body2-fontWeight']).toBe('var(--sg-typography-fontWeightRegular, 400)');
  });
});
