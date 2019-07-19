import { embeddedMedia } from './index';

/**
 * Creates a mocked media provider.
 * @return {Object}
 */
const createMockedProvider = () => ({
  add: jest.fn(),
  remove: jest.fn(),
  stop: jest.fn(),
});

describe('EmbeddedMedia collection', () => {
  const providerOne = createMockedProvider();
  const providerTwo = createMockedProvider();

  beforeEach(() => {
    jest.clearAllMocks();
    embeddedMedia.constructor();
  });

  describe('.constructor()', () => {
    it('should construct as expected', () => {
      expect(embeddedMedia.providers).toBeInstanceOf(Set);
      expect(embeddedMedia.providers.size).toBe(0);
    });
  });

  describe('.addProvider()', () => {
    it('should add a providers', () => {
      embeddedMedia.addProvider(providerOne);
      embeddedMedia.addProvider(providerTwo);
      embeddedMedia.addProvider(providerOne);

      expect(embeddedMedia.providers.size).toBe(2);
      expect(embeddedMedia.providers.has(providerOne)).toBeTruthy();
      expect(embeddedMedia.providers.has(providerTwo)).toBeTruthy();
    });
  });

  describe('.removeProvider()', () => {
    it('should remove providers', () => {
      embeddedMedia.addProvider(providerOne);
      embeddedMedia.addProvider(providerTwo);

      embeddedMedia.removeProvider(providerTwo);

      expect(embeddedMedia.providers.size).toBe(1);
      expect(embeddedMedia.providers.has(providerTwo)).toBeFalsy();
      expect(embeddedMedia.providers.has(providerOne)).toBeTruthy();

      embeddedMedia.removeProvider(providerOne);

      expect(embeddedMedia.providers.size).toBe(0);
      expect(embeddedMedia.providers.has(providerOne)).toBeFalsy();
    });
  });

  describe('Interactions with entries', () => {
    const mockedEntry = { mocked: 'entry' };

    beforeEach(() => {
      embeddedMedia.addProvider(providerOne);
      embeddedMedia.addProvider(providerTwo);
    });

    describe('.add()', () => {
      it('should add entries', () => {
        embeddedMedia.add(mockedEntry);

        expect(providerOne.add).toHaveBeenCalledTimes(1);
        expect(providerOne.add).toHaveBeenCalledWith(mockedEntry);
        expect(providerTwo.add).toHaveBeenCalledTimes(1);
        expect(providerTwo.add).toHaveBeenCalledWith(mockedEntry);
      });
    });

    describe('.remove()', () => {
      it('should remove entries', () => {
        embeddedMedia.add(mockedEntry);
        embeddedMedia.remove(mockedEntry);

        expect(providerOne.remove).toHaveBeenCalledTimes(1);
        expect(providerOne.remove).toHaveBeenCalledWith(mockedEntry);
        expect(providerTwo.remove).toHaveBeenCalledTimes(1);
        expect(providerTwo.remove).toHaveBeenCalledWith(mockedEntry);
      });
    });

    describe('.stop()', () => {
      it('should call the stop methods of registered providers', () => {
        embeddedMedia.stop();

        expect(providerOne.stop).toHaveBeenCalledTimes(1);
        expect(providerTwo.stop).toHaveBeenCalledTimes(1);
      });
    });
  });
});
