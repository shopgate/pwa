import { JSDOM } from 'jsdom';
import { logger } from '@shopgate/pwa-core/helpers';
import MediaProvider from './MediaProvider';

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: jest.fn(),
  },
}));

/**
 * Creates a DOM container with iframes.
 * @param {Array} srcs A list of video URLs.
 * @return {Object}
 */
const createContainer = (srcs) => {
  const html = srcs.map(src => `<iframe src="${src}"></iframe>`).join('');
  return new JSDOM(html).window.document;
};

describe('MediaProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('.constructor()', () => {
    it('should construct as expected', () => {
      const instance = new MediaProvider();
      expect(instance.containers).toBeInstanceOf(Map);
      expect(Array.from(instance.containers)).toHaveLength(0);
    });
  });

  describe('.add()', () => {
    it('should log an error when it is not overwritten', () => {
      const instance = new MediaProvider();
      instance.add();
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('.stop()', () => {
    it('should log an error when it is not overwritten', () => {
      const instance = new MediaProvider();
      instance.stop();
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('.remove()', () => {
    it('should remove containers as expected', () => {
      const instance = new MediaProvider();
      const containerOne = createContainer(['http://www.provider-one.com/video']);
      const containerTwo = createContainer(['http://www.provider-two.com/video']);

      instance.containers.set(containerOne, containerOne);
      instance.containers.set(containerTwo, containerTwo);

      instance.remove(containerTwo);

      expect(instance.containers.size).toBe(1);
      expect(instance.containers.get(containerTwo)).toBeUndefined();
      expect(instance.containers.get(containerOne)).toEqual(containerOne);

      instance.remove(containerOne);

      expect(instance.containers.size).toBe(0);
    });
  });

  describe.skip('.responsify()', () => {
    it('should optimize a container to be responsive', () => {
      // TODO: Implement the test when a solution for the insertBefore issue was found.
    });
  });
});
