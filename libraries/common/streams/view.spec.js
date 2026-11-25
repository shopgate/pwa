import { emitScrollEvents, stopScrollEvents, viewScroll$ } from './view';

const createScrollElement = () => {
  const element = document.createElement('div');
  Object.defineProperty(element, 'scrollHeight', { value: 2000 });
  Object.defineProperty(element, 'clientHeight', { value: 500 });
  return element;
};

describe('View streams', () => {
  let element;
  let subscriber;
  let subscription;

  const scrollTo = (scrollTop) => {
    element.scrollTop = scrollTop;
    element.dispatchEvent(new Event('scroll'));
  };

  beforeEach(() => {
    jest.useFakeTimers();
    element = createScrollElement();
    subscriber = jest.fn();
    subscription = viewScroll$.subscribe(subscriber);
    emitScrollEvents(element, 250);
  });

  afterEach(() => {
    subscription.unsubscribe();
    jest.useRealTimers();
  });

  it('should emit the latest position at the end of the window', () => {
    scrollTo(100);
    scrollTo(200);
    scrollTo(300);

    expect(subscriber).not.toHaveBeenCalled();
    jest.advanceTimersByTime(250);

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber.mock.calls[0][0]).toMatchObject({
      scrollTop: 300,
      direction: 'down',
    });
  });

  it('should emit a single final scroll event that opens a new window', () => {
    scrollTo(500);
    jest.advanceTimersByTime(250);

    jest.advanceTimersByTime(100);
    scrollTo(0);
    jest.advanceTimersByTime(250);

    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber.mock.calls[1][0]).toMatchObject({
      scrollTop: 0,
      previousScrollTop: 500,
      direction: 'up',
      scrollUp: true,
    });
  });

  it('should report a scroll down that reaches the bottom within one window', () => {
    scrollTo(800);
    scrollTo(1500);
    jest.advanceTimersByTime(250);

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber.mock.calls[0][0]).toMatchObject({
      scrollTop: 1500,
      direction: 'down',
      scrollDown: true,
      scrolled: true,
    });
  });

  it('should not report a scroll down that starts near the bottom', () => {
    scrollTo(1485);
    jest.advanceTimersByTime(250);

    scrollTo(1500);
    jest.advanceTimersByTime(250);

    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber.mock.calls[1][0]).toMatchObject({
      scrollTop: 1500,
      scrollDown: false,
      scrolled: false,
    });
  });

  it('should measure the first scroll event from the position the element already has', () => {
    const restored = createScrollElement();
    restored.scrollTop = 600;
    emitScrollEvents(restored, 250);

    restored.dispatchEvent(new Event('scroll'));
    jest.advanceTimersByTime(250);

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber.mock.calls[0][0]).toMatchObject({
      scrollTop: 600,
      previousScrollTop: 600,
      scrolled: false,
    });
  });

  it('should not emit events of an element whose scroll events were stopped', () => {
    const other = createScrollElement();
    emitScrollEvents(other, 250);
    stopScrollEvents(element);

    scrollTo(300);
    other.scrollTop = 200;
    other.dispatchEvent(new Event('scroll'));
    jest.advanceTimersByTime(250);

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber.mock.calls[0][0]).toMatchObject({ scrollTop: 200 });
  });

  it('should keep a shared stream until every caller stopped it', () => {
    emitScrollEvents(element, 250);
    stopScrollEvents(element);

    scrollTo(300);
    jest.advanceTimersByTime(250);
    expect(subscriber).toHaveBeenCalledTimes(1);

    stopScrollEvents(element);
    scrollTo(600);
    jest.advanceTimersByTime(250);
    expect(subscriber).toHaveBeenCalledTimes(1);
  });
});
