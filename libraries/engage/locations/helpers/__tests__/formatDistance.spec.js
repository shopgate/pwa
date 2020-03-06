import { i18n } from '@shopgate/engage/core';
import formatDistance from '../formatDistance';

jest.unmock('@shopgate/engage/core/helpers/i18n');

describe('getDistanceFormatter()', () => {
  beforeAll(() => {
    i18n.init({
      locales: {
        formats: {
          distance: {
            pattern: '{distance} {unit}',
            units: {
              m: 'm',
              km: 'km',
              ft: 'ft',
              mi: 'mi',
            },
          },
        },
      },
      lang: 'en-US',
    });
  });

  describe('metric distances', () => {
    [
      [0.00, '0 m'],
      [0.25, '250 m'],
      [0.99, '990 m'],
      [1.00, '1 km'],
      [1.25, '1.3 km'],
      [52.23, '52.2 km'],
      [100.00, '100 km'],
      [101.23, '101 km'],
      [1250.79, '1,251 km'],
    ].forEach(([distance, formatted]) => {
      it(`should format ${distance} to ${formatted}`, () => {
        expect(formatDistance(distance)).toEqual(formatted);
      });
    });
  });

  describe('imperial distances', () => {
    [
      [0.00, '0 ft'],
      [0.04, '210 ft'],
      [0.09, '470 ft'],
      [0.094, '490 ft'],
      [0.095, '0.1 mi'],
      [0.9, '0.9 mi'],
      [1, '1 mi'],
      [1.13, '1.1 mi'],
      [1.25, '1.3 mi'],
      [99.5, '99.5 mi'],
      [100, '100 mi'],
      [105.23, '105 mi'],
      [1250, '1,250 mi'],
    ].forEach(([distance, formatted]) => {
      it(`should format ${distance} to ${formatted}`, () => {
        expect(formatDistance(distance, true)).toEqual(formatted);
      });
    });
  });
});
