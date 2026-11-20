import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useWidget } from '@shopgate/engage/page/hooks';
import Accordion from './Accordion';

jest.mock('@shopgate/engage/page/hooks', () => ({
  useWidget: jest.fn(),
}));
jest.mock('@shopgate/engage/components', () => ({
  ChevronIcon: () => null,
  Typography: ({ children }: { children: string }) => <h2>{children}</h2>,
}));
jest.mock('@shopgate/engage/page/components', () => ({
  WidgetRichText: ({ content }: { content?: string }) => <div>{content}</div>,
}));

const entries = [
  {
    question: 'Shipping?',
    answer: '2-3 days',
  },
  {
    question: 'Returns?',
    answer: '30 days',
  },
  {
    question: 'Payment?',
    answer: 'PayPal',
  },
];

const renderAccordion = (config: object) => {
  (useWidget as jest.Mock).mockReturnValue({
    code: 'w1',
    config: {
      entries,
      ...config,
    },
  });
  return render(<Accordion />);
};

const expanded = () => screen.getAllByRole('button').map(button => button.getAttribute('aria-expanded'));

describe('<Accordion />', () => {
  it('shows the questions as headings one level below the headline', () => {
    renderAccordion({
      showHeadline: true,
      headline: {
        text: 'FAQ',
        typography: 'h2',
      },
    });

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('FAQ');
    expect(screen.getAllByRole('heading', { level: 3 }).map(heading => heading.textContent))
      .toEqual(['Shipping?', 'Returns?', 'Payment?']);
  });

  it('shows the questions as second level headings without a headline', () => {
    renderAccordion({
      headline: {
        text: 'FAQ',
        typography: 'h2',
      },
    });

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
  });

  it('opens no entry at the start by default', () => {
    renderAccordion({});

    expect(expanded()).toEqual(['false', 'false', 'false']);
  });

  it('opens the first entry at the start', () => {
    renderAccordion({ initiallyOpen: 'first' });

    expect(expanded()).toEqual(['true', 'false', 'false']);
    expect(screen.getByRole('region')).toHaveAccessibleName('Shipping?');
    expect(screen.getByRole('region')).toHaveTextContent('2-3 days');
  });

  it('opens and closes an entry on tap', () => {
    renderAccordion({});

    fireEvent.click(screen.getByRole('button', { name: 'Returns?' }));
    expect(expanded()).toEqual(['false', 'true', 'false']);

    fireEvent.click(screen.getByRole('button', { name: 'Returns?' }));
    expect(expanded()).toEqual(['false', 'false', 'false']);
  });

  it('closes the open entry when another one opens', () => {
    renderAccordion({ initiallyOpen: 'first' });

    fireEvent.click(screen.getByRole('button', { name: 'Payment?' }));

    expect(expanded()).toEqual(['false', 'false', 'true']);
  });

  it('keeps several entries open when allowed', () => {
    renderAccordion({
      initiallyOpen: 'first',
      allowMultipleOpen: true,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Payment?' }));

    expect(expanded()).toEqual(['true', 'false', 'true']);
  });

  it('opens the start entry again when the settings change, e.g. in the admin preview', () => {
    const { rerender } = renderAccordion({});
    fireEvent.click(screen.getByRole('button', { name: 'Returns?' }));

    (useWidget as jest.Mock).mockReturnValue({
      code: 'w1',
      config: {
        entries,
        initiallyOpen: 'first',
      },
    });
    rerender(<Accordion />);

    expect(expanded()).toEqual(['true', 'false', 'false']);
  });

  it('renders nothing without entries', () => {
    const { container } = renderAccordion({ entries: [] });

    expect(container).toBeEmptyDOMElement();
  });
});
