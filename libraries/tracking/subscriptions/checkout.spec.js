import getCart from '../selectors/cart';
import * as helpers from '../helpers';
import subscription from './checkout';

jest.mock('@shopgate/pwa-common/streams/app', () => ({
  appDidStart$: jest.fn(),
}));

jest.mock('../selectors/cart', () => state => state);

jest.mock('@shopgate/pwa-core/commands/registerEvents', () => jest.fn());

describe('Checkout subscriptions', () => {
  const subscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    subscription(subscribe);
  });

  it('should call subscribe as expected', () => {
    expect(subscribe).toHaveBeenCalledTimes(2);
  });

  describe('checkoutDidEnter$', () => {
    let callback;

    beforeAll(() => {
      [[, callback]] = subscribe.mock.calls;
    });

    it('should call the expected commands', () => {
      const trackSpy = jest.spyOn(helpers, 'track');
      /**
       * Mocked getState function.
       * @return {Object}
       */
      const getState = () => ({ mocked: 'state' });

      callback({ getState });
      expect(trackSpy).toHaveBeenCalledTimes(1);
      expect(trackSpy).toHaveBeenCalledWith(
        'initiatedCheckout',
        { cart: getCart(getState()) },
        getState()
      );
    });
  });
});
