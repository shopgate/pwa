import { JSDOM } from 'jsdom';
import URLSearchParams from 'url-search-params';
import YouTube from './YouTube';

const videos = [
  'https://youtube.com/fooo?enablejsapi=0&controls=0',
  'https://youtube.com/fooo?controls=0&enablejsapi=0',
  'https://youtube.com/fooo',
  'https://youtube-nocookie.com/fooo?controls=0',
];

describe('YouTube video provider', () => {
  let instance;

  beforeEach(() => {
    instance = new YouTube();
  });

  describe('.constructor()', () => {
    it('should work as expected', () => {
      expect(instance.containers).toBeInstanceOf(Map);
      expect(instance.containers.size).toBe(0);
    });
  });

  describe('.addContainer()', () => {
    it('should add multiple containers as expected', () => {
      const containerOne = new JSDOM(`<iframe src="${videos[0]}"></iframe>`).window.document;
      const containerTwo = new JSDOM(`<iframe src="${videos[1]}"></iframe>`).window.document;
      const iframesOne = containerOne.querySelectorAll('iframe');
      const iframesTwo = containerTwo.querySelectorAll('iframe');

      instance.addContainer(containerOne);
      instance.addContainer(containerTwo);
      instance.addContainer(containerOne);

      expect(instance.containers.size).toBe(2);
      expect(instance.containers.get(containerOne)).toEqual(iframesOne);
      expect(instance.containers.get(containerTwo)).toEqual(iframesTwo);
    });

    it('should add a container with different types of YouTube videos', () => {
      const html = videos.map(src => `<iframe src="${src}"></iframe>`).join('');
      const container = new JSDOM(html).window.document;
      const iframes = container.querySelectorAll('iframe');

      instance.addContainer(container);

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
      instance.addContainer(container);

      expect(instance.containers.size).toBe(0);
    });
  });

  describe('.removeContainer()', () => {
    it('should remove containers as expected', () => {
      const containerOne = new JSDOM(`<iframe src="${videos[0]}"></iframe>`).window.document;
      const containerTwo = new JSDOM(`<iframe src="${videos[1]}"></iframe>`).window.document;
      const iframesOne = containerOne.querySelectorAll('iframe');

      instance.addContainer(containerOne);
      instance.addContainer(containerTwo);

      instance.removeContainer(containerTwo);

      expect(instance.containers.size).toBe(1);
      expect(instance.containers.get(containerTwo)).toBeUndefined();
      expect(instance.containers.get(containerOne)).toEqual(iframesOne);

      instance.removeContainer(containerOne);

      expect(instance.containers.size).toBe(0);
    });
  });

  describe('.stop()', () => {
    it('should stop the videos within mutiple containers', () => {
      const postMessageMock = jest.fn();
      const containerOne = new JSDOM(`<iframe src="${videos[0]}"></iframe>`).window.document;
      const containerTwo = new JSDOM(`<iframe src="${videos[1]}"></iframe><iframe src="${videos[2]}"></iframe>`).window.document;

      instance.addContainer(containerOne);
      instance.addContainer(containerTwo);

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
