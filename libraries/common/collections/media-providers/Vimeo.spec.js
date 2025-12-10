/** @jest-environment jsdom */

import { Vimeo } from './index';

const videos = [
  'https://player.vimeo.com/video/484765967?color=32ac5c&title=0&byline=0&portrait=0',
  'https://player.vimeo.com/video/224765967?color=32ac5c&title=0&byline=0&portrait=0',
];

jest.mock('@shopgate/engage/core/helpers', () => ({
  logger: {
    error: jest.fn(),
  },
  i18n: {
    text: jest.fn(key => key),
  },
}));

/**
 * Creates a DOM container (Document) with iframes.
 * @param {string[]} srcs A list of video URLs.
 * @return {Document}
 */
const createContainer = (srcs) => {
  const doc = document.implementation.createHTMLDocument('container');
  doc.body.innerHTML = srcs.map(src => `<iframe src="${src}"></iframe>`).join('');
  return doc;
};

/**
 * Creates a mocked document with iframes.
 * @param {string[]} srcs A list of video URLs.
 * @return {Document}
 */
const createMockedDocument = (srcs) => {
  const doc = document.implementation.createHTMLDocument('mocked');
  doc.body.innerHTML = srcs.map(src => `<iframe src="${src}"></iframe>`).join('');
  return doc;
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
          pause = () => {
            pauseMock();
          };
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
    document.documentElement.innerHTML = '<head></head><body></body>';
    instance = new Vimeo();
    instance.responsify = jest.fn();
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

  describe('.getMediaContainers()', () => {
    it('should return all Vimeo iframes', () => {
      const container = createContainer([...videos, 'random/url']);
      const result = instance.getMediaContainers(container);
      expect(result).toMatchSnapshot();
      expect(result).toHaveLength(2);
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
      const doc = document.implementation.createHTMLDocument('plain');
      doc.body.innerHTML = '<p>Some HTML content</p>';
      instance.add(doc);

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

  describe.skip('.stop()', () => {
    it('should stop the videos within multiple containers', () => {
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

  describe('.handleCookieConsent()', () => {
    it('should remove player scripts from the input containers', () => {
      const embeddedCode = `
<body>
  <div style="padding:56.25% 0 0 0;position:relative;">
    <iframe src="https://player.vimeo.com/video/45" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="How to make a Vimeo Create video"></iframe>
  </div>
  <script src="https://player.vimeo.com/api/player.js"></script>
</body>
      `;

      const doc = document.implementation.createHTMLDocument('embed');
      doc.documentElement.innerHTML = embeddedCode.trim();

      instance.handleCookieConsent(doc);

      expect(doc.querySelectorAll('script')).toHaveLength(0);
      expect(doc.body.innerHTML).toMatchSnapshot();
    });
  });

  describe('.applyIframeOptimizations()', () => {
    it('should optimize multiple containers', () => {
      const doc = createMockedDocument(videos);

      const iframesOne = doc.querySelectorAll('iframe');
      const iframesTwo = doc.querySelectorAll('iframe');

      instance.applyIframeOptimizations(doc);

      expect(instance.responsify).toHaveBeenCalledWith(iframesOne[0]);
      expect(instance.responsify).toHaveBeenCalledWith(iframesTwo[0]);
    });
  });
});
