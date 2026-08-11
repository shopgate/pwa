// `createTypography` only needs `isDev` from the core helpers, but importing the real barrel pulls
// `createTheme` back in through `withTheme` - a cycle that leaves this module half initialized when
// the spec is the entry point.
jest.mock('@shopgate/engage/core/helpers', () => ({ isDev: false }));

// eslint-disable-next-line import/first
import createTypography from './createTypography';

describe('theme => createTypography', () => {
  const create = options => createTypography({}, options || {});

  describe('font weight custom properties', () => {
    it('references the shared token instead of inlining the weight', () => {
      const typography = create();

      expect(typography.body1.fontWeight).toBe('var(--sg-typography-fontWeightRegular, 400)');
      expect(typography.h1.fontWeight).toBe('var(--sg-typography-fontWeightBold, 700)');
      expect(typography.h3.fontWeight).toBe('var(--sg-typography-fontWeightMedium, 500)');
    });

    it('maps every variant to its token', () => {
      const typography = create();
      const tokenOf = variant => typography[variant].fontWeight.match(/--sg-typography-(\w+),/)[1];

      expect(tokenOf('h1')).toBe('fontWeightBold');
      expect(tokenOf('h2')).toBe('fontWeightBold');
      expect(tokenOf('h3')).toBe('fontWeightMedium');
      expect(tokenOf('h4')).toBe('fontWeightMedium');
      expect(tokenOf('h5')).toBe('fontWeightMedium');
      expect(tokenOf('h6')).toBe('fontWeightMedium');
      expect(tokenOf('subtitle1')).toBe('fontWeightRegular');
      expect(tokenOf('subtitle2')).toBe('fontWeightMedium');
      expect(tokenOf('body1')).toBe('fontWeightRegular');
      expect(tokenOf('body2')).toBe('fontWeightRegular');
      expect(tokenOf('button')).toBe('fontWeightMedium');
      expect(tokenOf('caption')).toBe('fontWeightRegular');
      expect(tokenOf('overline')).toBe('fontWeightRegular');
    });

    it('keeps the shared tokens themselves numeric', () => {
      const typography = create();

      expect(typography.fontWeightLight).toBe(300);
      expect(typography.fontWeightRegular).toBe(400);
      expect(typography.fontWeightMedium).toBe(500);
      expect(typography.fontWeightBold).toBe(700);
    });

    it('uses a configured token as the fallback', () => {
      const typography = create({ fontWeightMedium: 600 });

      expect(typography.fontWeightMedium).toBe(600);
      expect(typography.h3.fontWeight).toBe('var(--sg-typography-fontWeightMedium, 600)');
    });
  });

  describe('overrides', () => {
    it('lets a per variant font weight win over the token reference', () => {
      const typography = create({ h1: { fontWeight: 800 } });

      expect(typography.h1.fontWeight).toBe(800);
      expect(typography.h2.fontWeight).toBe('var(--sg-typography-fontWeightBold, 700)');
    });

    it('lets allVariants win over the token reference', () => {
      const typography = create({ allVariants: { fontWeight: 200 } });

      expect(typography.body1.fontWeight).toBe(200);
      expect(typography.h1.fontWeight).toBe(200);
    });

    it('supports options provided as a function of the palette', () => {
      const palette = { mode: 'light' };
      const typography = createTypography(palette, (received) => {
        expect(received).toBe(palette);
        return { fontWeightBold: 900 };
      });

      expect(typography.h1.fontWeight).toBe('var(--sg-typography-fontWeightBold, 900)');
    });
  });
});
