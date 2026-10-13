import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FooterBar from './FooterBar';

let mockHeight = 62;
let mockModalCount = 0;

jest.mock('react-redux', () => ({ useSelector: (selector: () => unknown) => selector() }));
jest.mock('@shopgate/engage/a11y/selectors', () => ({ getModalCount: () => mockModalCount }));
jest.mock('@shopgate/engage/core/hooks', () => ({
  useElementSize: () => ({ height: mockHeight }),
}));

const footerBarHeight = () => document.documentElement.style.getPropertyValue('--footer-bar-height');
const bar = () => document.querySelector('.engage__footer-bar') as HTMLElement;

describe('<FooterBar />', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="AppFooterBars"></div><div id="tabBar"></div>';
  });

  afterEach(() => {
    mockHeight = 62;
    mockModalCount = 0;
  });

  it('publishes the height of a fixed bar on top of the tab bar', () => {
    const { unmount } = render(<FooterBar variant="fixed">content</FooterBar>);

    expect(screen.getByText('content')).toBeInTheDocument();
    expect(bar()).toHaveAttribute('data-variant', 'fixed');
    expect(footerBarHeight()).toBe(
      'max(calc(62px + max(var(--tabbar-height, 0px), var(--safe-area-inset-bottom))))'
    );

    unmount();
    expect(footerBarHeight()).toBe('0px');
  });

  it('keeps the gap above the tab bar for a floating bar', () => {
    render(<FooterBar variant="floating" gap={16}>content</FooterBar>);
    const offset = 'max(calc(var(--tabbar-height, 0px) + 16px), 16px, var(--safe-area-inset-bottom))';

    expect(bar().style.getPropertyValue('--footer-bar-offset'))
      .toBe(offset);
    expect(footerBarHeight()).toBe(`max(calc(62px + ${offset}))`);
  });

  it('hides an empty bar and keeps the page offset clear of it', () => {
    mockHeight = 0;
    render(<FooterBar variant="fixed">{null}</FooterBar>);

    expect(bar()).toHaveAttribute('data-empty', 'true');
    expect(footerBarHeight()).toBe('0px');
  });

  it('is hidden from assistive technology while a modal is open', () => {
    mockModalCount = 1;
    render(<FooterBar variant="fixed">content</FooterBar>);

    expect(bar()).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders in front of the tab bar and nothing without the app footer', () => {
    const { unmount } = render(<FooterBar variant="fixed">content</FooterBar>);

    expect(bar().parentElement).toBe(document.getElementById('AppFooterBars'));
    expect(document.getElementById('tabBar')?.compareDocumentPosition(bar()))
      .toBe(Node.DOCUMENT_POSITION_PRECEDING);

    unmount();
    document.body.innerHTML = '';
    render(<FooterBar variant="fixed">content</FooterBar>);
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });
});
