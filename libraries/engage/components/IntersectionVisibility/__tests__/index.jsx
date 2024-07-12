import IntersectionVisibility from '../index';

describe('<IntersectionVisibility />', () => {
  it('should build a list of 5 thresholds', () => {
    expect(IntersectionVisibility.buildThresholdList(5)).toEqual([
      0.20, 0.40, 0.60, 0.80, 1.00,
    ]);
  });

  it('should build a list of 20 thresholds', () => {
    expect(IntersectionVisibility.buildThresholdList(20)).toEqual([
      0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5,
      0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1,
    ]);
  });
});
