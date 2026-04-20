import isiOSTheme from './isIOSTheme';

describe('isiOSTheme', () => {
  const orgTHEME = process.env.THEME;
  afterAll(() => {
    process.env.THEME = orgTHEME;
  });
  it('should return false for gmd', () => {
    process.env.THEME = 'gmd';
    expect(isiOSTheme()).toBe(false);
  });
  it('should return true for ios', () => {
    process.env.THEME = 'ios';
    expect(isiOSTheme()).toBe(true);
  });
});
