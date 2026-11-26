import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useWidget } from '@shopgate/engage/page/hooks';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import TextBand from './TextBand';

jest.mock('@shopgate/engage/page/hooks', () => ({
  useWidget: jest.fn(),
}));
jest.mock('@shopgate/engage/a11y/hooks', () => ({
  useReduceMotion: jest.fn(() => false),
}));
jest.mock('@shopgate/engage/core/hooks', () => ({
  useElementSize: () => ({
    height: 40,
    width: 900,
  }),
}));
jest.mock('@shopgate/engage/components', () => ({
  Link: ({ children, href, tabIndex }: {
    children: ReactNode;
    href: string;
    tabIndex?: number;
  }) => (
    <div role="link" data-href={href} tabIndex={tabIndex}>{children}</div>
  ),
}));

const entries = [
  { text: 'Free shipping from 50 €' },
  {
    text: '30 days return',
    link: '/returns',
  },
  { text: 'Pay by invoice' },
];

const renderTextBand = (config: object) => {
  (useWidget as jest.Mock).mockReturnValue({
    config,
    isPreview: false,
  });
  return render(<TextBand />);
};

describe('<TextBand />', () => {
  it('shows the entries side by side when static', () => {
    const { container } = renderTextBand({
      entries,
      display: 'static',
    });

    expect(container.querySelectorAll('ul')).toHaveLength(1);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(container.firstChild).toHaveAttribute('data-display', 'static');
  });

  it('repeats the entries for the loop but hides the repetition from screen readers', () => {
    const { container } = renderTextBand({ entries });

    expect(container.querySelectorAll('ul')).toHaveLength(2);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getAllByText('30 days return')).toHaveLength(2);
  });

  it('keeps only the link of the first copy in the tab order', () => {
    const { container } = renderTextBand({ entries });

    expect(screen.getByRole('link', { name: '30 days return' })).toHaveAttribute('tabindex', '0');
    expect(container.querySelector('ul[aria-hidden] [role="link"]')).toHaveAttribute('tabindex', '-1');
  });

  it('moves one copy of the entries at the chosen speed', () => {
    const { container } = renderTextBand({
      entries,
      speed: 'slow',
    });

    expect(container.querySelector('.widget__text-band__track')).toHaveStyle({ animationDuration: '18s' });
  });

  it('shows a scrolling band static with reduced motion', () => {
    (useReduceMotion as jest.Mock).mockReturnValueOnce(true);
    const { container } = renderTextBand({
      entries,
      display: 'scrolling',
    });

    expect(container.querySelectorAll('ul')).toHaveLength(1);
    expect(container.firstChild).toHaveAttribute('data-display', 'static');
  });

  it('shows entries without a link as plain text', () => {
    renderTextBand({
      entries,
      display: 'static',
    });

    expect(screen.getByText('Pay by invoice').closest('[role="link"]')).toBeNull();
  });

  it('renders nothing without entries that have a text', () => {
    const { container } = renderTextBand({
      entries: [{
        text: ' ',
        link: '/sale',
      }],
    });

    expect(container).toBeEmptyDOMElement();
  });
});
