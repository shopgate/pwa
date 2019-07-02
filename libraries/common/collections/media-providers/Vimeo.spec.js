import { JSDOM } from 'jsdom';
import { Vimeo } from './index';

const videos = [
  'https://player.vimeo.com/video/484765967?color=32ac5c&title=0&byline=0&portrait=0',
  'https://player.vimeo.com/video/224765967?color=32ac5c&title=0&byline=0&portrait=0',
];

/**
 * Creates a DOM container with iframes.
 * @param {Array} srcs A list of video URLs.
 * @return {Object}
 */
const createContainer = (srcs) => {
  const html = srcs.map(src => `<iframe src="${src}"></iframe>`).join('');
  return new JSDOM(html).window.document;
};

describe('Vimeo media provider', () => {
  let instance;
  const pauseMock = jest.fn();

  /**
   * Updates the global Vimeo player object.
   * @param {boolean} [available=true] Should the vimeo player object be injected.
   */
  const updatePlayer = (available = true) => {
    if (available) {
      window.Vimeo = {
        Player: class MockPlayer {
          /** */
          pause = () => { pauseMock(); }
        },
      };

      return;
    }

    delete window.Vimeo;
  };

  /**
   * Creates a Vimeo media provider instance.
   * @param {boolean} [addPlayer=true] Should the vimeo player object be injected.
   */
  const createInstance = (addPlayer = true) => {
    updatePlayer(addPlayer);

    document.getElementsByTagName('html')[0].innerHTML = '';
    instance = new Vimeo();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    createInstance();
  });

  describe('.constructor()', () => {
    it('should construct as expected', () => {
      createInstance(false);
      expect(instance.containers).toBeInstanceOf(Map);
      expect(instance.isPending).toBe(true);
      expect(instance.deferred).toEqual([]);
    });
  });

  describe('.add()', () => {
    it('should add multiple containers as expected', () => {
      const containerOne = createContainer([videos[0]]);
      const containerTwo = createContainer([videos[1]]);

      instance.add(containerOne);
      instance.add(containerTwo);
      instance.add(containerOne);

      expect(instance.containers.size).toBe(2);
      expect(instance.containers.get(containerOne)).toEqual([expect.any(window.Vimeo.Player)]);
      expect(instance.containers.get(containerTwo)).toEqual([expect.any(window.Vimeo.Player)]);
    });

    it('should defer addition of a container if the player is not ready', () => {
      createInstance(false);

      const container = createContainer([videos[0]]);
      instance.add(container);

      expect(instance.containers.size).toBe(0);
      expect(instance.deferred).toEqual([container]);
    });

    it('should not add a container when it does not contain a video', () => {
      const container = new JSDOM('<p>Some HTML content</p>').window.document;
      instance.add(container);

      expect(instance.containers.size).toBe(0);
    });
  });

  describe('.remove()', () => {
    it('should remove containers as expected', () => {
      const containerOne = createContainer([videos[0]]);
      const containerTwo = createContainer([videos[1]]);

      instance.add(containerOne);
      instance.add(containerTwo);

      instance.remove(containerTwo);

      expect(instance.containers.size).toBe(1);
      expect(instance.containers.get(containerTwo)).toBeUndefined();
      expect(instance.containers.get(containerOne)).toEqual([expect.any(window.Vimeo.Player)]);

      instance.remove(containerOne);

      expect(instance.containers.size).toBe(0);
    });
  });

  describe('.stop()', () => {
    it('should stop the videos within mutiple containers', () => {
      const containerOne = createContainer(videos);
      const containerTwo = createContainer([videos[1]]);

      instance.add(containerOne);
      instance.add(containerTwo);

      instance.stop();

      expect(pauseMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('.onScriptLoaded()', () => {
    it('should mark as ready (not pending)', () => {
      instance.onScriptLoaded();
      expect(instance.isPending).toBe(false);
    });

    it('should run deferred containers on script ready', () => {
      instance.deferred = ['container 1', 'container 2'];

      jest.spyOn(instance, 'add').mockReturnValue(true);

      instance.onScriptLoaded();

      expect(instance.add).toHaveBeenCalledTimes(2);
      expect(instance.add).nthCalledWith(1, 'container 1');
      expect(instance.add).nthCalledWith(2, 'container 2');

      expect(instance.deferred).toHaveLength(0);
    });
  });
});
