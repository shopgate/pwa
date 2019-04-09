import { JSDOM } from 'jsdom';
import URLSearchParams from 'url-search-params';
import { YouTube } from './index';

const videos = [
  'https://youtube.com/fooo?enablejsapi=0&controls=0',
  'https://youtube.com/fooo?controls=0&enablejsapi=0',
  'https://youtube.com/fooo',
  'https://youtube-nocookie.com/fooo?controls=0',
];

/**
 * Creates a DOM container with iframes.
 * @param {Array} srcs A list of video URLs.
 * @return {Object}
 */
const createContainer = (srcs) => {
  const iframes = srcs.map(src => `<iframe src="${src}"></iframe>`).join('');
  const html = `<div>${iframes}</div>`;
  return new JSDOM(html).window.document;
};

describe('YouTube media provider', () => {
  let instance;

  beforeEach(() => {
    instance = new YouTube();
    // TODO Implement tests for the method when a solution for the insertBefore issue was found.
    instance.responsify = jest.fn();
  });

  describe('.constructor()', () => {
    it('should construct as expected', () => {
      expect(instance.containers).toBeInstanceOf(Map);
      expect(instance.containers.size).toBe(0);
    });
  });

  describe('.add()', () => {
    it('should add multiple containers as expected', () => {
      const containerOne = createContainer([videos[0]]);
      const containerTwo = createContainer([videos[1]]);
      const iframesOne = containerOne.querySelectorAll('iframe');
      const iframesTwo = containerTwo.querySelectorAll('iframe');

      instance.add(containerOne);
      instance.add(containerTwo);
      instance.add(containerOne);

      expect(instance.containers.size).toBe(2);
      expect(instance.containers.get(containerOne)).toEqual(iframesOne);
      expect(instance.containers.get(containerTwo)).toEqual(iframesTwo);
      expect(instance.responsify).toHaveBeenCalledWith(iframesOne[0]);
      expect(instance.responsify).toHaveBeenCalledWith(iframesTwo[0]);
    });

    it('should add a container with different types of YouTube videos', () => {
      const container = createContainer(videos);
      const iframes = container.querySelectorAll('iframe');

      instance.add(container);

      expect(instance.containers.size).toBe(1);
      expect(iframes).toHaveLength(videos.length);

      iframes.forEach(({ src }) => {
        const [, query] = src.split('?');
        const urlParams = new URLSearchParams(query);

        expect(urlParams.get('enablejsapi')).toBe('1');
        expect(urlParams.get('controls')).toBe('1');
      });
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
      const iframesOne = containerOne.querySelectorAll('iframe');

      instance.add(containerOne);
      instance.add(containerTwo);

      instance.remove(containerTwo);

      expect(instance.containers.size).toBe(1);
      expect(instance.containers.get(containerTwo)).toBeUndefined();
      expect(instance.containers.get(containerOne)).toEqual(iframesOne);

      instance.remove(containerOne);

      expect(instance.containers.size).toBe(0);
    });
  });

  describe('.stop()', () => {
    it('should stop the videos within multiple containers', () => {
      const postMessageMock = jest.fn();
      const containerOne = createContainer([videos[0]]);
      const containerTwo = createContainer([videos[1], videos[2]]);

      instance.add(containerOne);
      instance.add(containerTwo);

      const iframesOne = containerOne.querySelectorAll('iframe');
      const iframesTwo = containerTwo.querySelectorAll('iframe');
      iframesOne[0].contentWindow.postMessage = postMessageMock;
      iframesTwo[0].contentWindow.postMessage = postMessageMock;
      iframesTwo[1].contentWindow.postMessage = postMessageMock;

      instance.stop();

      expect(postMessageMock).toHaveBeenCalledTimes(3);
      expect(postMessageMock).toHaveBeenCalledWith('{"event":"command","func":"stopVideo","args":""}', '*');
    });
  });
});
