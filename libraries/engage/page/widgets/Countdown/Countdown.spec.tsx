import type { ReactNode } from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useWidget } from '@shopgate/engage/page/hooks';
import Countdown from './Countdown';

jest.mock('@shopgate/engage/page/hooks', () => ({
  useWidget: jest.fn(),
}));
jest.mock('@shopgate/engage/core', () => ({
  useNavigation: () => ({ push: jest.fn() }),
}));
jest.mock('@shopgate/engage/core/helpers', () => ({
  i18n: {
    text: (key: string, params?: object) => (params ? `${key} ${JSON.stringify(params)}` : key),
  },
}));
jest.mock('@shopgate/engage/components', () => ({
  Typography: ({ children, className, 'aria-hidden': ariaHidden }: {
    children: ReactNode; className?: string; 'aria-hidden'?: boolean;
  }) => <span className={className} aria-hidden={ariaHidden}>{children}</span>,
}));
jest.mock('@shopgate/engage/page/components', () => ({
  WidgetRichText: ({ content }: { content?: string }) => (content ? <div>{content}</div> : null),
}));

const renderCountdown = (config: object) => {
  (useWidget as jest.Mock).mockReturnValue({
    config,
    isPreview: false,
  });
  return render(<Countdown />);
};

const tileValues = (container: HTMLElement) => Array.from(
  container.querySelectorAll('.widget__countdown__value'),
  tile => tile.textContent
);

describe('<Countdown />', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-11-20T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows tiles for days, hours, minutes and seconds that tick every second', () => {
    const { container } = renderCountdown({ endDate: '2026-11-22T14:00:00Z' });

    expect(tileValues(container)).toEqual(['2', '02', '00', '00']);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(tileValues(container)).toEqual(['2', '01', '59', '59']);
  });

  it('drops the day tile with less than one day left', () => {
    const { container } = renderCountdown({ endDate: '2026-11-20T13:00:00Z' });

    expect(tileValues(container)).toEqual(['01', '00', '00']);
  });

  it('shows the remaining time in one line', () => {
    renderCountdown({
      endDate: '2026-11-22T14:00:00Z',
      display: 'inline',
    });

    expect(screen.getByRole('timer')).toHaveTextContent('common.countdown {"days":2,"time":"02:00:00"}');
  });

  it('gives screen readers the remaining time as one sentence', () => {
    renderCountdown({ endDate: '2026-11-22T14:00:00Z' });

    expect(screen.getByRole('timer')).toHaveAttribute(
      'aria-label',
      'page.countdown.remaining {"days":2,"hours":2,"minutes":0,"seconds":0}'
    );
  });

  it('disappears at the end when it hides after the end', () => {
    const { container } = renderCountdown({ endDate: '2026-11-20T12:00:02Z' });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(container).toBeEmptyDOMElement();
  });

  it('keeps only the headline and the text after the end when it shows a text', () => {
    renderCountdown({
      endDate: '2026-11-20T12:00:02Z',
      showHeadline: true,
      headline: { text: 'Black Friday ends in' },
      text: 'While stocks last',
      buttonText: 'Shop now',
      link: '/sale',
      afterExpiry: 'showText',
      expiredText: 'The sale is over',
    });

    expect(screen.getByRole('button', { name: 'Shop now' })).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Black Friday ends in')).toBeInTheDocument();
    expect(screen.getByText('The sale is over')).toBeInTheDocument();
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
    expect(screen.queryByText('While stocks last')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
