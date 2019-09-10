import { SGLink } from './helper';

describe('Helpers', () => {
  let sgLink;
  beforeEach(() => {
    sgLink = new SGLink('/home');
  });

  describe('setUtmParams', () => {
    it('should set source and medium', () => {
      sgLink.setUtmParams({}, { type: 'raw' });
      expect(sgLink.toString()).toEqual('/home?utm_source=shopgate&utm_medium=raw');
    });
    it('should set utm campaign push message', () => {
      // eslint-disable-next-line extra-rules/no-single-line-objects
      sgLink.setUtmParams({}, { type: 'push_message', notificationId: 101 });
      expect(sgLink.toString()).toEqual('/home?utm_source=shopgate&utm_medium=push_message&utm_campaign=push-101');
    });
    it('should set utm content push message', () => {
      sgLink = new SGLink('/home?utm_campaign=cart_reminder');
      // eslint-disable-next-line extra-rules/no-single-line-objects
      sgLink.setUtmParams({}, { type: 'push_message', notificationId: 101 });
      expect(sgLink.toString()).toEqual('/home?utm_campaign=push-101&utm_source=shopgate&utm_medium=push_message&utm_content=cart_reminder');
    });
  });
});
