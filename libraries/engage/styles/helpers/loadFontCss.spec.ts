import { loadFontCss } from './loadFontCss';

jest.mock('@sentry/browser', () => ({
  withScope: (callback: (scope: unknown) => void) => callback({
    setLevel: jest.fn(),
    setExtra: jest.fn(),
  }),
  captureMessage: jest.fn(),
  Severity: { Warning: 'warning', Error: 'error' },
}));

const A = 'https://cdn.example/a.css';
const B = 'https://cdn.example/b.css';

const links = () => Array.from(document.querySelectorAll<HTMLLinkElement>('link.font-css'));
const hrefs = () => links().map(link => link.getAttribute('href'));

/**
 * Fires the load event on every link that has no result yet, so the pending promises settle.
 */
const settleAll = () => {
  links().forEach(link => link.onload?.(new Event('load')));
};

describe('styles/helpers/loadFontCss', () => {
  beforeEach(() => {
    document.head.innerHTML = '<meta name="font-css-insertion-point" content="" />';
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('inserts one link per url, in the passed order', async () => {
    const pending = loadFontCss([A, B]);
    settleAll();
    await pending;

    expect(hrefs()).toEqual([A, B]);
  });

  it('inserts them after the insertion point', async () => {
    const pending = loadFontCss([A]);
    settleAll();
    await pending;

    const anchor = document.querySelector('meta[name="font-css-insertion-point"]');

    expect(anchor?.nextElementSibling).toBe(links()[0]);
  });

  it('appends when the insertion point is absent', async () => {
    document.head.innerHTML = '';

    const pending = loadFontCss([A]);
    settleAll();
    await pending;

    expect(hrefs()).toEqual([A]);
  });

  it('resolves without inserting anything for an empty list', async () => {
    await loadFontCss([]);

    expect(hrefs()).toEqual([]);
  });

  it('keeps existing tags and only adds the new url', async () => {
    const first = loadFontCss([A]);
    settleAll();
    await first;

    const [existing] = links();

    const second = loadFontCss([A, B]);
    settleAll();
    await second;

    expect(hrefs()).toEqual([A, B]);
    expect(links()[0]).toBe(existing);
  });

  it('removes tags for urls that are no longer configured', async () => {
    const first = loadFontCss([A, B]);
    settleAll();
    await first;

    const second = loadFontCss([B]);
    settleAll();
    await second;

    expect(hrefs()).toEqual([B]);
  });

  it('is a no-op when called again with the same urls', async () => {
    const first = loadFontCss([A]);
    settleAll();
    await first;

    const [existing] = links();

    await loadFontCss([A]);

    expect(links()).toHaveLength(1);
    expect(links()[0]).toBe(existing);
  });

  it('loads a url once when it is configured globally and for a variant', async () => {
    const pending = loadFontCss([A, A, B]);
    settleAll();
    await pending;

    expect(hrefs()).toEqual([A, B]);
  });

  it('keeps the first occurrence, so the cascade order survives deduping', async () => {
    const pending = loadFontCss([B, A, B]);
    settleAll();
    await pending;

    expect(hrefs()).toEqual([B, A]);
  });

  it('collapses duplicate tags that are already in the document', async () => {
    const anchor = document.querySelector('meta[name="font-css-insertion-point"]');

    [1, 2].forEach(() => {
      const stale = document.createElement('link');
      stale.className = 'font-css';
      stale.setAttribute('data-font-css-url', A);
      stale.href = A;
      anchor?.parentNode?.insertBefore(stale, anchor.nextSibling);
    });

    expect(hrefs()).toEqual([A, A]);

    await loadFontCss([A]);

    expect(hrefs()).toEqual([A]);
  });

  it('resolves when a file fails, leaving the tag in place', async () => {
    const pending = loadFontCss([A]);

    links().forEach(link => link.onerror?.(new Event('error')));
    await pending;

    expect(hrefs()).toEqual([A]);
  });

  it('resolves when a file never settles, leaving the tag in place', async () => {
    const pending = loadFontCss([A]);

    jest.runAllTimers();
    await pending;

    expect(hrefs()).toEqual([A]);
  });
});
