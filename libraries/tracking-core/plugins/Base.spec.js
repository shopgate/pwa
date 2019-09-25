import SgTrackingPlugin from './Base';

describe('Base', () => {
  let instance;

  beforeEach(() => {
    instance = new SgTrackingPlugin();
  });

  describe('.disableTracking() / .enableTracking()', () => {
    it('should disable and enable the tracking', () => {
      expect(instance.trackingDisabled).toBe(false);
      instance.disableTracking();
      expect(instance.trackingDisabled).toBe(true);
      instance.enableTracking();
      expect(instance.trackingDisabled).toBe(false);
    });
  });

  describe('.formatData()', () => {
    it('should return the input data when no formatter is available', () => {
      const raw = {
        some: 'property',
      };

      expect(SgTrackingPlugin.formatData('someEvent', raw)).toBe(raw);
    });

    it('should return formatted data for a known event', () => {
      const raw = {
        page: { link: 'http://m.atu.de/item/1234' },
      };

      expect(SgTrackingPlugin.formatData('pageview', raw)).toEqual({
        page: {
          merchantUrl: 'item/1234',
          shopgateUrl: 'item',
        },
      });
    });
  });
});
