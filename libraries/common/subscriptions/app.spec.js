import { appWillStart$ } from '../streams/app';
import { embeddedMedia } from '../collections';
import { Vimeo, YouTube } from '../collections/media-providers';
import subscription from './app';

describe('App subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    subscription(subscribe);
  });

  describe('appWillStart$', () => {
    let stream;
    let callback;

    beforeEach(() => {
      [[stream, callback]] = subscribe.mock.calls;
      embeddedMedia.constructor();
    });

    it('should initialize', () => {
      expect(stream).toEqual(appWillStart$);
      expect(callback).toBeInstanceOf(Function);
    });

    it('should add media providers', () => {
      const addProviderSpy = jest.spyOn(embeddedMedia, 'addProvider');
      const action = { location: 'foo' };
      callback({
        dispatch,
        action,
      });

      expect(addProviderSpy).toHaveBeenCalledTimes(2);
      expect(addProviderSpy).toHaveBeenCalledWith(expect.any(YouTube));
      expect(addProviderSpy).toHaveBeenCalledWith(expect.any(Vimeo));
    });
  });
});
